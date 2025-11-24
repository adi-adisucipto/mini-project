"use client";
import { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";

export default function AuthWatcher() {
	const { data: session } = useSession();
	
	useEffect(() => {
		if(
			session?.error === "RefreshTokenError" ||
			session?.error === "InvalidAccessToken"
		) {
			signOut({ callbackUrl: "/login" });
		}
	}, [session]);
	
	return null;
}