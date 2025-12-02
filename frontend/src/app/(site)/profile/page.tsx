"use client";

import Button from "@/components/Button";
import Container from "@/components/Container";
import axios from "axios";
import { User } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
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
              const userInfo = await axios.post(`http://localhost:8000/api/profile/profile`, 
                {
                  email: email
                },
              )
              setData(userInfo.data.user);
            } catch (error) {
              console.log(error);
            }
        }

        user();
      }
    }, [session, status])
  return (
    <div className="w-full lg:h-[85vh] flex items-center justify-center">
      <Container className="my-10 lg:my-0">
        {/* Judul */}
        <div className="lg:flex lg:justify-between justify-center items-center lg:mx-[30px] lg:mt-[30px] lg:mb-[46px]">
          <div className="flex lg:flex-row flex-col justify-center items-center">
            <div className="w-20 h-20 mr-[25px] relative">
              {data?.avatar ? (
                <Image src={data.avatar} fill={true} alt="avatar" className="w-20 h-20 rounded-full absolute object-cover"/>
              ) : (
                <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center">
                  <User size={40}/>
                </div>
              )}
            </div>

            <div className="flex flex-col lg:gap-2.5 gap-[5px]">
              <div className="text-white lg:text-[25px] text-[20px] font-medium tracking-widest mx-auto lg:mx-0">{data?.username}</div>
              <div className="text-white/70 lg:text-[18px] text-[15px] font-medium tracking-widest mx-auto lg:mx-0">{data?.email}</div>
            </div>
          </div>

          <div className="w-[100px] lg:flex hidden">
            <Button>Edit</Button>
          </div>
        </div>

        {/* Info Account */}
        <div className="lg:px-[30px] lg:flex w-full gap-20 mb-[30px] mt-[30px] lg:mt-0">
          <div className="lg:w-[50%] flex flex-col gap-[25px] mb-[25px] lg:mb-0">
            <div className="">
              <h1 className="text-white text-[18px] font-medium tracking-widest">Username</h1>
              <div className="h-10 text-white bg-white/30 rounded-[10px] px-5 flex items-center">
                {data?.username}
              </div>
            </div>

            <div className="">
              <h1 className="text-white text-[18px] font-medium tracking-widest">Gender</h1>
              <div className="h-10 text-white bg-white/30 rounded-[10px] px-5 flex items-center">
                
              </div>
            </div>

            <div className="">
              <h1 className="text-white text-[18px] font-medium tracking-widest">Referral Code</h1>
              <div className="h-10 text-white bg-white/30 rounded-[10px] px-5 flex items-center">
                {data?.referral_code}
              </div>
            </div>
          </div>

          <div className="lg:w-[50%] flex flex-col gap-[25px]">
            <div className="">
              <h1 className="text-white text-[18px] font-medium tracking-widest">Email</h1>
              <div className="h-10 text-white bg-white/30 rounded-[10px] px-5 flex items-center">
                {data?.email}
              </div>
            </div>

            <div className="">
              <h1 className="text-white text-[18px] font-medium tracking-widest">Phone Number</h1>
              <div className="h-10 text-white bg-white/30 rounded-[10px] px-5 flex items-center"></div>
            </div>

            <div className="">
              <h1 className="text-white text-[18px] font-medium tracking-widest">Points</h1>
              <div className="h-10 text-white bg-white/30 rounded-[10px] px-5 flex items-center">
                {data?.points_balance}
              </div>
            </div>
          </div>

          
        </div>

        <Button className="lg:hidden flex justify-center items-center">Edit</Button>
      </Container>
    </div>
  )
}

export default Profile
