import type { Session } from "next-auth";
import { getRedis } from "@/lib/redis";
import type { AttemptPayload } from "@/lib/types";

const K = {
  global: "psychgrind:global",
  weekAttempts: "psychgrind:week:attempts",
  qAttempts: "psychgrind:q:attempts",
  qWrong: "psychgrind:q:wrong",
  users: "psychgrind:users",
  xpLeaderboard: "psychgrind:leaderboard:xp",
  attemptsLeaderboard: "psychgrind:leaderboard:attempts",
  accuracyLeaderboard: "psychgrind:leaderboard:accuracy",
  masteryLeaderboard: "psychgrind:leaderboard:mastery",
};

type Hash = Record<string, string | number | null>;

function userKey(email: string) {
  return `psychgrind:user:${encodeURIComponent(email.toLowerCase())}`;
}

export async function recordAttempt(payload: AttemptPayload, session: Session | null) {
  const redis = getRedis();
  if (!redis) return { persisted: false };

  const correctIds = payload.questionResults.filter((r) => r.correct).map((r) => r.id);
  const wrongIds = payload.questionResults.filter((r) => !r.correct).map((r) => r.id);

  await Promise.all([
    redis.hincrby(K.global, "attempts", 1),
    redis.hincrby(K.global, "answers", payload.total),
    redis.hincrby(K.global, "correct", payload.score),
    payload.week ? redis.hincrby(K.weekAttempts, String(payload.week), 1) : Promise.resolve(null),
    ...payload.questionResults.map((r) => redis.hincrby(K.qAttempts, r.id, 1)),
    ...wrongIds.map((id) => redis.hincrby(K.qWrong, id, 1)),
  ]);

  const email = session?.user?.email;
  if (!email) return { persisted: true, signedIn: false };

  const key = userKey(email);
  await redis.sadd(K.users, email);

  const [attempts, answers, correct, xp] = await Promise.all([
    redis.hincrby(key, "attempts", 1),
    redis.hincrby(key, "answers", payload.total),
    redis.hincrby(key, "correct", payload.score),
    redis.hincrby(
      key,
      "xp",
      payload.score * 10 + (payload.score === payload.total ? 50 : 0) + (payload.mode === "exam" ? 100 : 0),
    ),
  ]);

  if (payload.mode === "exam") {
    const currentBest = Number((await redis.hget(key, "bestExam")) ?? 0);
    if (payload.score > currentBest) await redis.hset(key, { bestExam: payload.score });
  }

  if (correctIds.length) {
    const [firstCorrectId, ...remainingCorrectIds] = correctIds;

    await redis.sadd(
      `${key}:mastered`,
      firstCorrectId,
      ...remainingCorrectIds
    );
  }
  const mastered = await redis.scard(`${key}:mastered`);
  const accuracy = Number(answers) > 0 ? Number(((Number(correct) / Number(answers)) * 100).toFixed(2)) : 0;

  await redis.hset(key, {
    email,
    name: session.user?.name ?? email.split("@")[0],
    image: session.user?.image ?? "",
    lastSeen: new Date().toISOString(),
    mastery: Number(mastered),
    accuracy,
  });

  await Promise.all([
    redis.zadd(K.xpLeaderboard, { score: Number(xp), member: email }),
    redis.zadd(K.attemptsLeaderboard, { score: Number(attempts), member: email }),
    redis.zadd(K.accuracyLeaderboard, { score: accuracy, member: email }),
    redis.zadd(K.masteryLeaderboard, { score: Number(mastered), member: email }),
  ]);

  return { persisted: true, signedIn: true };
}

export async function getGlobalStats() {
  const redis = getRedis();
  if (!redis) {
    return {
      enabled: false,
      attempts: 0,
      answers: 0,
      correct: 0,
      users: 0,
      busiestWeek: null as null | number,
    };
  }

  const [globalRaw, users, weeksRaw] = await Promise.all([
    redis.hgetall(K.global),
    redis.scard(K.users),
    redis.hgetall(K.weekAttempts),
  ]);
  const global = (globalRaw ?? {}) as Hash;
  const weeks = (weeksRaw ?? {}) as Hash;

  const weekEntries = Object.entries(weeks).map(([week, count]) => [Number(week), Number(count)] as const);
  weekEntries.sort((a, b) => b[1] - a[1]);

  return {
    enabled: true,
    attempts: Number(global.attempts ?? 0),
    answers: Number(global.answers ?? 0),
    correct: Number(global.correct ?? 0),
    users: Number(users),
    busiestWeek: weekEntries[0]?.[0] ?? null,
  };
}

export type LeaderboardMetric = "xp" | "attempts" | "accuracy" | "mastery";

export async function getLeaderboard(metric: LeaderboardMetric = "xp", limit = 25) {
  const redis = getRedis();
  if (!redis) return { enabled: false, rows: [] as Array<Record<string, unknown>> };

  const key =
    metric === "attempts"
      ? K.attemptsLeaderboard
      : metric === "accuracy"
        ? K.accuracyLeaderboard
        : metric === "mastery"
          ? K.masteryLeaderboard
          : K.xpLeaderboard;

  const members = (await redis.zrange(key, 0, Math.max(0, limit - 1), { rev: true })) as string[];

  const rows = await Promise.all(
    members.map(async (email, index) => {
      const profile = ((await redis.hgetall(userKey(email))) ?? {}) as Hash;
      return {
        rank: index + 1,
        email,
        name: String(profile.name ?? email.split("@")[0]),
        image: String(profile.image ?? ""),
        xp: Number(profile.xp ?? 0),
        attempts: Number(profile.attempts ?? 0),
        accuracy: Number(profile.accuracy ?? 0),
        mastery: Number(profile.mastery ?? 0),
        bestExam: Number(profile.bestExam ?? 0),
      };
    }),
  );

  return { enabled: true, rows };
}

export async function getAdminOverview() {
  const redis = getRedis();
  if (!redis) return { enabled: false as const };

  const [globalRaw, emailsRaw, qAttemptsRaw, qWrongRaw, weekAttemptsRaw] = await Promise.all([
    redis.hgetall(K.global),
    redis.smembers(K.users),
    redis.hgetall(K.qAttempts),
    redis.hgetall(K.qWrong),
    redis.hgetall(K.weekAttempts),
  ]);
  const global = (globalRaw ?? {}) as Hash;
  const emails = (emailsRaw ?? []) as string[];
  const qAttempts = (qAttemptsRaw ?? {}) as Hash;
  const qWrong = (qWrongRaw ?? {}) as Hash;
  const weekAttempts = (weekAttemptsRaw ?? {}) as Hash;

  const users = await Promise.all(
    emails.slice(0, 100).map(async (email) => {
      const profile = ((await redis.hgetall(userKey(email))) ?? {}) as Hash;
      return {
        email,
        name: String(profile.name ?? email.split("@")[0]),
        attempts: Number(profile.attempts ?? 0),
        accuracy: Number(profile.accuracy ?? 0),
        mastery: Number(profile.mastery ?? 0),
        xp: Number(profile.xp ?? 0),
        lastSeen: String(profile.lastSeen ?? ""),
      };
    }),
  );
  users.sort((a, b) => b.xp - a.xp);

  const hardest = Object.entries(qWrong)
    .map(([id, wrong]) => ({
      id,
      wrong: Number(wrong),
      attempts: Number(qAttempts[id] ?? 0),
      wrongRate: Number(qAttempts[id] ?? 0)
        ? Number(((Number(wrong) / Number(qAttempts[id] ?? 1)) * 100).toFixed(1))
        : 0,
    }))
    .sort((a, b) => b.wrongRate - a.wrongRate || b.wrong - a.wrong)
    .slice(0, 12);

  return {
    enabled: true as const,
    global: {
      attempts: Number(global.attempts ?? 0),
      answers: Number(global.answers ?? 0),
      correct: Number(global.correct ?? 0),
      users: emails.length,
    },
    weekAttempts: Object.entries(weekAttempts)
      .map(([week, attempts]) => ({ week: Number(week), attempts: Number(attempts) }))
      .sort((a, b) => a.week - b.week),
    hardest,
    users,
  };
}
