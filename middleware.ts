import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    authorized: ({ token }) => Boolean(token),
  },
});

export const config = {
  matcher: [
    "/weeks/:path*",
    "/practice/:path*",
    "/mix/:path*",
    "/exam/:path*",
    "/weak/:path*",
    "/dashboard/:path*",
    "/leaderboard/:path*",
    "/admin/:path*",
  ],
};
