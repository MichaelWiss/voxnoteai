import GoogleProvider from "next-auth/providers/google";
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
  debug: true,
  callbacks: {
    async signIn({ user }) {
      console.log('SignIn callback - User:', user);
      
      if (!user.email) {
        console.log('No email in user object, denying sign in');
        return false;
      }

      try {
        // Check if user exists
        const { data: existingUser, error: selectError } = await supabaseAdmin
          .from("users")
          .select("id, email")
          .eq("email", user.email)
          .single();

        console.log('Existing user check:', { existingUser, selectError });

        if (selectError && selectError.code !== 'PGRST116') {
          console.error('Error checking for existing user:', selectError);
          return false;
        }

        if (!existingUser) {
          console.log('Creating new user in Supabase');
          const { data: newUser, error: insertError } = await supabaseAdmin
            .from("users")
            .insert([
              {
                email: user.email,
                full_name: user.name,
              },
            ])
            .select()
            .single();

          console.log('User creation result:', { newUser, insertError });

          if (insertError) {
            console.error('Error creating user:', insertError);
            return false;
          }
        }

        console.log('Sign in successful');
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
