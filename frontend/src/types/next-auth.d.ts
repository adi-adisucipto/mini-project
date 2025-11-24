import NextAuth, { DefaultUser, DefaultSession } from "next-auth";
import { DefaultJWT, JWT } from "next-auth/jwt";

declare module "next-auth" {
	interface User extends DefaultUser {
		id:string,
        email: string
        username: string,
        role: string,
        avatar: string | null,
        points_balance: number,
        referral_code: string,
        accessToken: string,
        refreshToken: string
	}
	
	interface Session extends DefaultSession {
		user: User | null;
		accessToken?: string | null;
		error?: string | null;
	}
	
	type AdapterUser = User
}

declare module "next-auth/jwt" {
	interface JWT extends DefaultJWT {
		id:string,
        email: string
        username: string,
        role: string,
        avatar: string | null,
        points_balance: number,
        referral_code: string,
        accessToken: string,
        refreshToken: string
	}
}