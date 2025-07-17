import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { supabase } from "../../supabase";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user?.email) return false;
      // Check if user exists in Supabase
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('email', user.email)
        .single();
      if (!data) {
        // Insert new user
        const { error: insertError } = await supabase.from('users').insert([
          {
            name: user.name,
            email: user.email,
            image: user.image,
          },
        ]);
        if (insertError) {
          // Optionally log error
          return false;
        }
      }
      return true;
    },
  },
  // You can add more NextAuth config here (callbacks, pages, etc.)
});

export { handler as GET, handler as POST }; 