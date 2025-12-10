import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import connectDB from "./libs/db";
import UserModel from "./models/user.model";
import bcrypt from "bcryptjs";
import Google from "next-auth/providers/google";

class InvalidLoginError extends CredentialsSignin {
  code = "Invalid identifier or password";
}

export const { handlers, signIn, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();
        const { email, password } = credentials;
        if (!email || !password) {
          throw new InvalidLoginError("Missing credentials", {
            cause: "MISSING_CREDENTIALS",
          });
        }
        const user = await UserModel.findOne({ email }).lean();
        if (!user) {
          throw new InvalidLoginError("User not found", {
            cause: "USER_NOT_FOUND",
          });
        }
        const isPasswordValid = await bcrypt.compare(
          String(password),
          user.password || ""
        );
        if (!isPasswordValid) {
          throw new InvalidLoginError("Invalid password", {
            cause: "INVALID_PASSWORD",
          });
        }
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.userId = token.id as string;
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    async signIn({ account, user }) {
      if (account?.provider === "google") {
        await connectDB();
        const existingUser = await UserModel.findOne({ email: user.email });
        if (existingUser) {
          return true;
        }
        const newUser = await UserModel.create({
          name: user.name,
          email: user.email,
          image: user.image as string,
        });
        user.id = newUser._id.toString();
        user.role = newUser.role;
      }
      return true;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  secret: process.env.AUTH_SECRET!,
});
