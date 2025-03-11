import NextAuth, { NextAuthOptions, TokenSet, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { jwtDecode } from 'jwt-decode';

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const response = await fetch(`${process.env.NEXT_PRIVATE_KEYCLOAK_ISSUER}/protocol/openid-connect/token`, {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            client_id: process.env.NEXT_PRIVATE_KEYCLOAK_CLIENT_ID as string,
            client_secret: process.env.NEXT_PRIVATE_KEYCLOAK_CLIENT_SECRET as string,
            grant_type: "password",
            username: credentials?.email ?? '',
            password: credentials?.password ?? '',
            scope: "openid profile email address",
          }),
          method: "POST",
          cache: "no-store",
        });

        const tokens: TokenSet = await response.json();

        if (!response.ok) {
          throw new Error("Invalid credentials");
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const decoded: any = jwtDecode(tokens.access_token as string);

        return {
          id: decoded.sub,
          name: decoded.name,
          email: decoded.email,
          image: decoded.image,
          address: decoded.address,
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
        } as User;
      }
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
        // httpOnly: true,
        sameSite: 'none',
        secure: true,
        path: '/',
      },
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session }) {
      return session;
    },
  },
  pages: {
    signIn: '/signin',
    error: '/error',
    newUser: '/signup',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
