import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";

// Extend the User and Session types in next-auth
declare module "next-auth" {
  interface User {
    id?: string;
    email?: string | null;
    full_name?: string | null;
    is_superuser?: boolean;
    is_staff?: boolean;
    address_line_1?: string | null;
    address_line_2?: string | null;
    city?: string | null;
    state?: string | null;
    postalCode?: string | null;
    countryCode?: string | null;
    phoneNumber?: string | null;
  }

  interface Session {
    user: User;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile",
          redirect_uri: "https://trustdine-xi.vercel.app/api/auth/callback/google" // Add this
        }
      }
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "email",
          redirect_uri: "https://trustdine-xi.vercel.app/api/auth/callback/facebook"
        }
      }
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Step 1: Fetch JWT token
          const tokenResponse = await fetch(
            "https://trustdine-backend.vercel.app/auth/jwt/create/",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: credentials?.email,
                password: credentials?.password,
              }),
            }
          );

          if (!tokenResponse.ok) {
            console.error("Failed to fetch token:", tokenResponse.statusText);
            return null;
          }

          const tokenData = await tokenResponse.json();
          const accessToken = tokenData.access;

          // Step 2: Fetch user data using the token
          const userResponse = await fetch(
            "https://trustdine-backend.vercel.app/api/user/",
            {
              method: "GET",
              headers: {
                Authorization: `JWT ${accessToken}`,
              },
            }
          );

          if (!userResponse.ok) {
            console.error("Failed to fetch user:", userResponse.statusText);
            return null;
          }

          const user = await userResponse.json();

          // Return the user object with all fields
          return {
            id: user.id,
            email: user.email,
            name: user.full_name,
            is_superuser: user.is_superuser,
            is_staff: user.is_staff,
            address_line_1: user.address_line_1,
            address_line_2: user.address_line_2,
            city: user.city,
            state: user.state,
            postalCode: user.postalCode,
            countryCode: user.countryCode,
            phoneNumber: user.phoneNumber
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Handle Google OAuth sign-in
      if (account?.provider === "google") {
        try {
          // Check if user exists in Django backend
          const response = await fetch(
            "https://trustdine-backend.vercel.app/auth/o/google-oauth2/",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                access_token: account.access_token,
              }),
            }
          );

          if (response.ok) {
            const data = await response.json();
            
            // Fetch user details from Django
            const userResponse = await fetch(
              "https://trustdine-backend.vercel.app/api/user/",
              {
                method: "GET",
                headers: {
                  Authorization: `JWT ${data.access}`,
                },
              }
            );

            if (userResponse.ok) {
              const userData = await userResponse.json();
              // Update user object with Django data
              user.id = userData.id;
              user.full_name = userData.full_name;
              user.is_superuser = userData.is_superuser;
              user.address_line_1 = userData.address_line_1;
              user.address_line_2 = userData.address_line_2;
              user.city = userData.city;
              user.state = userData.state;
              user.postalCode = userData.postalCode;
              user.countryCode = userData.countryCode;
              user.phoneNumber = userData.phoneNumber;
              (user as any).access_token = data.access;
            }
          }
          return true;
        } catch (error) {
          console.error("Google OAuth error:", error);
          return false;
        }
      }

      // Handle Facebook OAuth sign-in
      if (account?.provider === "facebook") {
        try {
          // Check if user exists in Django backend
          const response = await fetch(
            "https://trustdine-backend.vercel.app/auth/o/facebook/",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                access_token: account.access_token,
              }),
            }
          );

          if (response.ok) {
            const data = await response.json();
            
            // Fetch user details from Django
            const userResponse = await fetch(
              "https://trustdine-backend.vercel.app/api/user/",
              {
                method: "GET",
                headers: {
                  Authorization: `JWT ${data.access}`,
                },
              }
            );

            if (userResponse.ok) {
              const userData = await userResponse.json();
              // Update user object with Django data
              user.id = userData.id;
              user.full_name = userData.full_name;
              user.is_superuser = userData.is_superuser;
              user.address_line_1 = userData.address_line_1;
              user.address_line_2 = userData.address_line_2;
              user.city = userData.city;
              user.state = userData.state;
              user.postalCode = userData.postalCode;
              user.countryCode = userData.countryCode;
              user.phoneNumber = userData.phoneNumber;
              (user as any).access_token = data.access;
            }
          }
          return true;
        } catch (error) {
          console.error("Facebook OAuth error:", error);
          return false;
        }
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        // Include all user fields in the token
        return {
          ...token,
          id: user.id,
          email: user.email,
          name: user.name,
          is_superuser: user.is_superuser,
          is_staff: user.is_staff,
          address_line_1: user.address_line_1,
          address_line_2: user.address_line_2,
          city: user.city,
          state: user.state,
          postalCode: user.postalCode,
          countryCode: user.countryCode,
          phoneNumber: user.phoneNumber
        };
      }
      return token;
    },
    async session({ session, token }) {
      // Include all fields from token in the session
      session.user = {
        ...session.user,
        id: token.id as string,
        email: token.email as string,
        full_name: token.name as string,
        is_superuser: token.is_superuser as boolean,
        is_staff: token.is_staff as boolean,
        address_line_1: token.address_line_1 as string | null,
        address_line_2: token.address_line_2 as string | null,
        city: token.city as string | null,
        state: token.state as string | null,
        postalCode: token.postalCode as string | null,
        countryCode: token.countryCode as string | null,
        phoneNumber: token.phoneNumber as string | null
      };
      return session;
    },
  },
  pages: {
    signIn: "/login", 
  },
});