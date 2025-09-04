import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";

// Extend the User and Session types in next-auth
declare module "next-auth" {
  interface User {
    id?: string;
    email?: string | undefined;
    full_name?: string | undefined;
    is_superuser?: boolean;
    is_staff?: boolean;
    address_line_1?: string | null;
    address_line_2?: string | null;
    city?: string | null;
    state?: string | null;
    postalCode?: string | null;
    countryCode?: string | null;
    phoneNumber?: string | null;
    access_token?: string; // Add this to User interface
  }

  interface Session {
    user: User;
    accessToken?: string; // Add this to Session interface
  }
}

// Extend JWT interface
declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    email?: string;
    full_name?: string;
    is_superuser?: boolean;
    is_staff?: boolean;
    address_line_1?: string | null;
    address_line_2?: string | null;
    city?: string | null;
    state?: string | null;
    postalCode?: string | null;
    countryCode?: string | null;
    phoneNumber?: string | null;
    accessToken?: string; // Add this to JWT interface
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "openid email profile",
        }
      }
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "email",
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
            "https://api.goamico.com/auth/jwt/create/",
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
            "https://api.goamico.com/api/user/",
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

          // Return the user object with all fields including access_token
          return {
            id: user.id,
            email: user.email,
            name: user.full_name,
            full_name: user.full_name,
            is_superuser: user.is_superuser,
            is_staff: user.is_staff,
            address_line_1: user.address_line_1,
            address_line_2: user.address_line_2,
            city: user.city,
            state: user.state,
            postalCode: user.postalCode,
            countryCode: user.countryCode,
            phoneNumber: user.phoneNumber,
            access_token: accessToken // Include the access token
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  basePath: "/api/auth",
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
            "https://api.goamico.com/auth/o/google-oauth2/",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                access_token: account?.access_token,
                id_token: account?.id_token,
                code: account?.code,
                redirect_uri: "http://goamico.com/api/auth/callback/google"
              })
            }
          );

          const data = await response.json();
          
          // Fetch user details from Django
          const userResponse = await fetch(
            "https://api.goamico.com/auth/email-login-register-cbv/",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Token 330d2cc652deab44dc0146abb2565ae24046b027",
              },
              body: JSON.stringify({ email: user?.email || data?.email })
            } 
          );
             
          if (userResponse.ok) {
            const userData = await userResponse.json();
            const djangoUser = userData.user;
            const tokens = userData.tokens;

            // Update user object with Django data
            user.id = djangoUser.id;
            user.email = djangoUser.email;
            user.full_name = djangoUser.full_name;
            user.is_superuser = djangoUser.is_superuser;
            user.is_staff = djangoUser.is_staff;
            user.address_line_1 = djangoUser.address_line_1;
            user.address_line_2 = djangoUser.address_line_2;
            user.city = djangoUser.city;
            user.state = djangoUser.state;
            user.postalCode = djangoUser.postalCode;
            user.countryCode = djangoUser.countryCode;
            user.phoneNumber = djangoUser.phoneNumber;
            user.access_token = tokens?.access; // Store access token properly
          }
          
          return true;
        } catch (error) {
          console.error("Google OAuth error:", error);
          return true;
        }
      }

      // Handle Facebook OAuth sign-in
      if (account?.provider === "facebook") {
        try {
          const response = await fetch(
            "https://api.goamico.com/auth/o/facebook/",
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
              "https://api.goamico.com/api/user/",
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
              user.access_token = data.access; // Store access token properly
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
      // If user is available (sign in), update token
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.full_name = user.full_name;
        token.is_superuser = user.is_superuser;
        token.is_staff = user.is_staff;
        token.address_line_1 = user.address_line_1;
        token.address_line_2 = user.address_line_2;
        token.city = user.city;
        token.state = user.state;
        token.postalCode = user.postalCode;
        token.countryCode = user.countryCode;
        token.phoneNumber = user.phoneNumber;
        token.accessToken = user.access_token;
      }
      return token;
    },
    
    async session({ session, token }) {
      // Pass token data to session
      session.user = {
        ...session.user,
        id: token.id as string,
        email: token.email as string,
        full_name: token.full_name as string,
        is_superuser: token.is_superuser as boolean,
        is_staff: token.is_staff as boolean,
        address_line_1: token.address_line_1 as string | null,
        address_line_2: token.address_line_2 as string | null,
        city: token.city as string | null,
        state: token.state as string | null,
        postalCode: token.postalCode as string | null,
        countryCode: token.countryCode as string | null,
        phoneNumber: token.phoneNumber as string | null,
      };
      
      // Make accessToken available at session level
      session.accessToken = token.accessToken as string;
      
      return session;
    },
  },
  pages: {
    signIn: "/login", 
  },
});