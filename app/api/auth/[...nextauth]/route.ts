import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { supabase } from "@/lib/supabaseClient";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // Ensure the user exists in Supabase `users` table
      const { data: existingUser } = await supabase
        .from("users")
        .select("id")
        .eq("email", user.email)
        .single();

      if (!existingUser) {
        await supabase.from("users").insert({
          id: crypto.randomUUID(), // or from user.id if provided
          email: user.email,
          full_name: user.name,
        });
      }
      return true;
    },
    async session({ session }) {
      // Attach Supabase user ID to session
      const { data } = await supabase
        .from("users")
        .select("id")
        .eq("email", session.user?.email)
        .single();

      if (data) {
        session.user.id = data.id;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };