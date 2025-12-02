"use client"

import axios from "axios";
import { useEffect, use, useState } from "react";
import Link from "next/link";
import Button from "@/components/Button";
import { Calendar, Clock, User } from "lucide-react";
import Image from "next/image";

interface PageProps {
  params: Promise<{ id: string }>;
}

interface EventData {
    event_id:string;
    organizer_id:string;
    name:string;
    description:string;
    price:number;
    start_date: Date | undefined;
    end_date: Date
    available_seats:number;
    total_seats:number;
    category:string;
    location:string;
    is_paid:boolean;
    created_at:Date;
    organizer: {
      username: string;
      avatar: string | null;
    }
}

function page({params}:PageProps) {
    const [data, setData] = useState<EventData | null>(null);
    const [eo, setEo] = useState<string>("")
    const [avatar, setAvatar] = useState<string>("")
    const {id} =  use(params);
    useEffect(() => {
        const eventInfo = async () => {
            try {
                const event = await axios.get(`http://localhost:8000/api/transaction/event/${id}`);
                const rawData = event.data.user;
                setEo(event.data.user.organizer.username)
                setAvatar(event.data.user.organizer.avatar)

                const processedData: EventData = {
                    ...rawData,
                    start_date: rawData.start_date ? new Date(rawData.start_date) : undefined,
                    end_date: new Date(rawData.end_date)
                };
                setData(processedData);
            } catch (error) {
                
            }
        }

        eventInfo()
    }, [id]);
  return (
    <div className="flex flex-col items-center justify-center lg:w-full lg:my-20 my-5">
      <div className="lg:w-[1080px] w-[420px] lg:h-[433px] h-[203px] bg-slate-200 rounded-[15px]"></div>

      <div className="lg:flex justify-between w-[420px] lg:w-[1080px] lg:max-w-[1080px] lg:mt-[70px] mt-[30px]">
        <div className="flex flex-col lg:gap-[50px] gap-5 lg:w-[70%]">
          <h1 className="lg:text-[50px] text-[30px] font-black tracking-widest leading-none">{data?.name}</h1>
          <p className="lg:hidden text-[25px] font-bold">Rp{Number(data?.price).toLocaleString("id-ID")}</p>

          <div className="flex flex-col lg:gap-5 gap-2.5">
            <h3 className="lg:text-[30px] text-[18px] font-semibold tracking-widest">Date and Time</h3>

            <div className="lg:flex hidden items-center gap-5">
              <Calendar size={40}/>
              <p className="lg:text-[20px] text-[15px] font-semibold">
                {data?.start_date instanceof Date 
                  ? data.start_date.toLocaleDateString('id-ID', {
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric'
                    })
                  : 'Tanggal Tidak Tersedia'
                }</p>
            </div>

            <div className="lg:hidden flex items-center gap-2.5">
              <Calendar size={30}/>
              <p className="text-[15px] font-semibold">
                {data?.start_date instanceof Date 
                  ? data.start_date.toLocaleDateString('id-ID', {
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric'
                    })
                  : 'Tanggal Tidak Tersedia'
                }</p>
            </div>

            <div className="lg:flex hidden items-center gap-5">
              <Clock size={40}/>
              <p className="text-[20px] font-semibold">12.00 - end</p>
            </div>

            <div className="lg:hidden flex items-center gap-2.5">
              <Clock size={30}/>
              <p className="text-[15px] font-semibold">12.00 - end</p>
            </div>
          </div>

          <div className="flex flex-col lg:gap-5 gap-2.5">
            <h3 className="lg:text-[30px] text-[18px] font-semibold tracking-widest">Hosted By</h3>

            <div className="flex items-center gap-5">
              {avatar ? (
                <Image src={avatar} fill={true} alt="avatar" className="lg:w-[60px] lg:h-[60px] w-[50px] h-[50px] rounded-full"/>
              ) : (
                <div className="lg:w-[60px] lg:h-[60px] w-[50px] h-[50px] rounded-full bg-[#D9D9D9] flex justify-center items-center">
                  <User/>
                </div>
              )}

              <div className="flex flex-col gap-[15px]">
                <h4 className="lg:text-[20px] text-[15px] font-semibold">{eo}</h4>
                <Button className="lg:h-[26px] h-5 lg:text-[15px] text-[10px] flex justify-center items-center">Profile</Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:gap-5 gap-2">
            <h3 className="lg:text-[30px] text-[18px] font-semibold tracking-widest">Event Description</h3>
            <p className="text-[15px] leading-[1.7]">{data?.description}</p>
          </div>
        </div>

        <div className="lg:flex hidden flex-col lg:gap-[15px] lg:items-end lg:w-[30%]">
          <h1 className="text-[50px] font-semibold tracking-widest">Rp{Number(data?.price).toLocaleString("id-ID")}</h1>
          <Link href={`/purchase/${id}`}><Button className="w-[150px]">Buy Ticket</Button></Link>
        </div>

        <Link href={`/purchase/${id}`}><Button className="w-full mt-[30px] flex lg:hidden">Buy Ticket</Button></Link>
      </div>
    </div>
  )
}

export default page
