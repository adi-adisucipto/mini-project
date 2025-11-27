"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface UserData {
    username: string
    email: string
    password: string
    role: string
    avatar: string
    avatar_id: string
    referral_code: string
    referrerId: string
    points_balance: number
    created_at: Date
}

function Profile() {
    const { data: session, status } = useSession();
    const [data, setData] = useState<UserData | null>(null);
    const email = session?.user?.email
    const accessToken = session?.user?.accessToken

    useEffect(() => {
      if(status === "authenticated" && session) {
        const user = async () => {
            try {
              const userInfo = await axios.post(`http://localhost:8000/api/user/profile`, 
                {
                  email: email
                },
              )
              setData(userInfo.data.user)
            } catch (error) {
              console.log(error);
            }
        }

        user();
      }
    }, [session, status])
  return (
    <div className="flex flex-col justify-center items-center h-[85vh]">
      <div className="w-4xl max-w-4xl h-[80%] bg-slate-100 rounded-2xl shadow-2xl p-12 grid grid-cols-2 grid-rows-2 gap-5">
        <div className="row-span-2 p-5 bg-amber-100 rounded-lg shadow-lg flex flex-col gap-3">
          <img src={data?.avatar} className="h-[50%] w-full object-cover rounded-2xl"/>
          <h1 className="text-2xl font-bold text-center">{data?.username}</h1>
          <div>
            <p>Email: {data?.email}</p>
            <p>Referral Code: {data?.referral_code}</p>
            <p>Points: {data?.points_balance}</p>
          </div>
        </div>
        <div className="p-5 bg-amber-50 rounded-lg shadow-lg">Adi</div>
        <div className="p-5 bg-amber-100 rounded-lg shadow-lg">Adi</div>
      </div>
    </div>
  )
}

export default Profile
