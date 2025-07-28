import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { supabaseClient } from "../../supabase-server";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }: any) {
      if (!user?.email) {
        console.error("No email provided by Google");
        return false;
      }

      try {
        // Check if user exists in Supabase
        const { data: existingUser, error: selectError } = await supabaseClient
          .from('users')
          .select('id')
          .eq('email', user.email)
          .single();

        if (selectError && selectError.code !== 'PGRST116') { // PGRST116 = no rows returned
          console.error("Error checking existing user:", selectError);
          return false;
        }

        if (!existingUser) {
          // Insert new user
          const { error: insertError } = await supabaseClient.from('users').insert([
            {
              name: user.name,
              email: user.email,
              image: user.image,
            },
          ]);
          
          if (insertError) {
            console.error("Error inserting new user:", insertError);
            // Don't return false here, let the user sign in even if DB insert fails
            // You might want to handle this differently based on your requirements
          }
        }

        return true;
      } catch (error) {
        console.error("Unexpected error in signIn callback:", error);
        // Return true to allow sign in even if there are DB issues
        return true;
      }
    },
    async session({ session, token }: any) {
      // Add user ID to session if needed
      if (session.user?.email) {
        try {
          const { data: user } = await supabaseClient
            .from('users')
            .select('id')
            .eq('email', session.user.email)
            .single();
          
          if (user) {
            session.user.id = user.id;
          }
        } catch (error) {
          console.error("Error fetching user ID for session:", error);
        }
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === 'development',
  pages: {
    signIn: '/auth',
    error: '/auth/error',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 