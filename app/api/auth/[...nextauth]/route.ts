import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { supabase } from "@/lib/supabaseClient";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import type { NextAuthOptions } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    }
  }
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    error: '/auth/error',
    signIn: '/auth/sign-in',
  },
  events: {
    async signIn(message) { 
      console.log('Signin event:', message);
    },
    async error(error) {
      console.error('Auth error:', error);
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      authorization: {
        params: {
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile"
        }
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        }
      }
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
  callbacks: {
    async signIn({ user }) {
      console.log('SignIn callback - User:', user);
      if (!user.email) return false;
      
      try {
        // First try to get the existing user
        const { data: existingUser, error: selectError } = await supabaseAdmin
          .from("users")
          .select("*")
          .eq("email", user.email)
          .single();

        console.log('Existing user check:', { existingUser, selectError });

        if (!existingUser) {
          const newUserId = crypto.randomUUID();
          console.log('Creating new user with ID:', newUserId);
          
          const { error: insertError } = await supabaseAdmin
            .from("users")
            .insert({
              id: newUserId,
              email: user.email,
              full_name: user.name,
            });
          
          if (insertError) {
            console.error('Error creating user:', insertError);
            // If it's a duplicate key error, we can continue (user exists)
            if (insertError.code !== '23505') {
              return false;
            }
          } else {
            console.log('New user created successfully');
          }
        } else {
          console.log('User already exists, proceeding with sign in');
        }
        
        return true;
      } catch (error) {
        console.error('Unexpected error during sign in:', error);
        return false;
      }
    },
    async session({ session }) {
      console.log('Session callback - Initial session:', session);
      
      if (session.user?.email) {
        const { data, error } = await supabaseAdmin
          .from("users")
          .select("id, email, full_name")
          .eq("email", session.user.email)
          .single();

        console.log('Supabase user lookup result:', { data, error });

        if (data) {
          const updatedSession = {
            ...session,
            user: {
              ...session.user,
              id: data.id,
              name: data.full_name || session.user.name,
            },
          };
          console.log('Returning updated session:', updatedSession);
          return updatedSession;
        }
      }
      console.log('Returning original session:', session);
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };