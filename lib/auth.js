import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { connectDB } from "./db";
import User from "../models/User";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

const providers = [];

if (googleClientId && googleClientSecret) {
  providers.push(
    GoogleProvider({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    })
  );
}

providers.push(
  CredentialsProvider({
    name: "Email and Password",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) return null;
      await connectDB();

      const user = await User.findOne({ email: credentials.email.toLowerCase() });
      if (!user?.passwordHash) return null;

      const ok = await compare(credentials.password, user.passwordHash);
      if (!ok) return null;

      return {
        id: user._id.toString(),
        name: user.name || user.email.split("@")[0],
        email: user.email,
        image: user.image || "",
      };
    },
  })
);

export const authOptions = {
  session: {
    strategy: "jwt",
  },
  providers,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user }) {
      if (!user?.email) return false;
      await connectDB();

      const existing = await User.findOne({ email: user.email.toLowerCase() });
      if (!existing) {
        await User.create({
          name: user.name || user.email.split("@")[0],
          email: user.email.toLowerCase(),
          image: user.image || "",
        });
      } else if (user.image && !existing.image) {
        existing.image = user.image;
        await existing.save();
      }
      return true;
    },
    async jwt({ token }) {
      if (token?.email) {
        await connectDB();
        const dbUser = await User.findOne({ email: token.email.toLowerCase() });
        if (dbUser) {
          token.uid = dbUser._id.toString();
          token.name = dbUser.name || token.name;
          token.picture = dbUser.image || token.picture;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.uid || "";
        session.user.email = token.email || session.user.email;
        session.user.name = token.name || session.user.name;
        session.user.image = token.picture || session.user.image;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
