import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api/auth (authentication routes)
     * - login and register pages
     * - static files (_next, favicon, etc.)
     */
    "/((?!api/auth|login|register|_next/static|_next/image|favicon.ico).*)",
  ],
};
