// types/next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User extends DefaultUser {
  id?: string | null;
  email?: string | null;
    full_name?: string | null;
    username?: string | null;
    is_superuser?: boolean;
    is_staff?: boolean;
    address_line_1?: string | null;
    address_line_2?: string | null;
    city?: string | null;
    state?: string | null;
    postalCode?: string | null;
    countryCode?: string | null;
    phoneNumber?: string | null;
    profile_image?: string | null | any;
    access_token?: string;
  }

  interface Session extends DefaultSession {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
  id?: string | null;
  email?: string | null;
    full_name?: string | null;
    username?: string | null;
    is_superuser?: boolean;
    is_staff?: boolean;
    address_line_1?: string | null;
    address_line_2?: string | null;
    city?: string | null;
    state?: string | null;
    postalCode?: string | null;
    countryCode?: string | null;
    phoneNumber?: string | null;
    access_token?: string;
  }
}