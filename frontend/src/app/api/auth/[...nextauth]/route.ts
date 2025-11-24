import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

import { DecodedToken } from "@/types/auth";

async function refreshAccessToken(token: JWT) {
    try {
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, 
            {
                refreshToken: token.refreshToken
            }
        );

        const { accessToken, refreshToken } = data.data;
        const decoded = jwtDecode<DecodedToken>(accessToken);

        return {
            ...token,
            accessToken,
            refreshToken,
            id:decoded.user_id,
            email: decoded.email,
            username: decoded.username,
            role: decoded.role,
            avatar: decoded.avatar,
            points_balance: decoded.points_balance,
            referral_code: decoded.referral_code,
        }
    } catch (error) {
        return {
            ...token,
            accessToken: null,
            refreshToken: null,
            error: "RefreshTokenError" as string
        }
    }
}

const handler = NextAuth({
    pages: {
        signIn: "/auth/login"
    },
    session: { strategy: "jwt" },
    providers: [
        Credentials({
            credentials: {
                email: { label: "email", type: "email", required: true },
                password: { label: "password", type: "password", required: true}
            },
            async authorize(credentials, req) {
                try {
                    const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                        email: credentials?.email,
                        password: credentials?.password
                    });

                    const { accessToken, refreshToken } = data;

                    if(!accessToken) throw new Error("InvalidAccessToken");

                    const decoded = jwtDecode<DecodedToken>(accessToken);

                    return {
                        id:decoded.user_id,
                        email: decoded.email,
                        username: decoded.username,
                        role: decoded.role,
                        avatar: decoded.avatar,
                        points_balance: decoded.points_balance,
                        referral_code: decoded.referral_code,
                        accessToken,
                        refreshToken
                    }
                } catch (error) {
                    if(axios.isAxiosError(error)){
                        console.log(error.response?.data)
                    }
                    return null;
                }
            }
        }
    )],
    callbacks: {
        async jwt({ token, user }) {
            if(user) {
                return {
                    ...token,
                    id:user.id,
                    email: user.email,
                    username: user.username,
                    role: user.role,
                    avatar: user.avatar,
                    points_balance: user.points_balance,
                    referral_code: user.referral_code,
                    accessToken: user.accessToken,
                    refreshToken: user.refreshToken
                }
            }

            if(!token.accessToken){
				return { ...token, error: "InvalidAccessToken" };
			}

            let decoded: DecodedToken
            try {
                decoded = jwtDecode<DecodedToken>(token.accessToken as string);
            } catch (error) {
                return {...token, error: "InvalidAccessToken"}
            }
            const isExipired = decoded.exp * 1000 < Date.now();
            if(!isExipired) return token
			return await refreshAccessToken(token);
        },

        async session({session, token}) {
            if(
                !token ||
                token.error === "InvalidAccessToken" ||
                token.error === "RefreshTokenError"
            ) {
                return {
                    ...session,
                    user: null,
					accessToken: null,
					error: (token?.error as string) ?? "SessionExpired",
					expires: session.expires,
                }
            }

            return {
                ...session,
                user: {
                    id:token.id,
                    email: token.email,
                    username: token.username,
                    role: token.role,
                    avatar: token.avatar,
                    points_balance: token.points_balance,
                    referral_code: token.referral_code,
                    accessToken: token.accessToken,
                    refreshToken: token.refreshToken
                }
            }
        }
    }
});

export { handler as GET, handler as POST }