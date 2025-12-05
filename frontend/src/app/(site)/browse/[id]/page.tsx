"use client"

import axios from "axios";
import { useEffect, use, useState } from "react";
import Link from "next/link";
import Button from "@/components/Button";
import { Calendar, Clock, FileText, MapPin, NotebookText, Ticket, User } from "lucide-react";
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
    const [avatar, setAvatar] = useState<string | null>(null)
    const {id} =  use(params);
    useEffect(() => {
        const eventInfo = async () => {
            try {
                const event = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/transaction/event/${id}`);
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
    <div className="w-full">
      <div className="w-full xl:h-[285px] h-[300px] relative">
        <Image src="/party.jpg" alt="cover" fill={true} className="w-full absolute object-cover xl:bg-blend-overlay" />
        <div className="w-full h-[285px] xl:bg-black/30 xl:backdrop-blur-xl absolute">
          <div className="max-w-7xl px-8 xl:p-0 p-5 mx-auto xl:flex hidden justify-between">
            <div className="text-white pt-[50px] flex flex-col gap-[25px]">
              <h1 className="text-[25px] font-bold">{data?.name}</h1>
              <div className="flex gap-[15px]">
                <MapPin/>
                <p className="text-[17px]">{data?.location}</p>
              </div>

              <div className="flex gap-[15px]">
                <Calendar/>
                <p className="text-[17px]">{data?.end_date.toLocaleDateString("id-Id", {day: "numeric", month: "long", year: "numeric"})}</p>
              </div>
            </div>

            <div className="w-[500px] h-60 relative mt-[45px] rounded-t-lg">
              <Image src="/party.jpg" alt="cover" fill={true} className="absolute object-cover rounded-t-lg"/>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl px-8 xl:p-0 p-5 mx-auto xl:flex justify-between">
        <div className="xl:py-[30px]">
          <div className="xl:hidden flex flex-col mb-[25px]">
            <h1 className="text-[21px] font-bold">{data?.name}</h1>
          </div>

          <div className="flex lg:gap-[5px] gap-[18px] items-center">
            <NotebookText className="w-[30px] h-[30px] stroke-3 "/>
            <p className="text-[26px] font-bold">Description</p>
          </div>
          <p className="mt-2.5 leading-6">{data?.description}</p>

          <div className="flex gap-[5px] mt-[45px] items-center">
            <Ticket className="w-[30px] h-[30px] stroke-3"/>
            <p className="text-[26px] font-bold">Ticket</p>
          </div>
          <div className="xl:w-[680px] xl:h-[85px] w-full flex xl:flex-row flex-col xl:justify-between xl:items-center border px-[15px] xl:py-0 py-[5px] rounded-[5px] mt-2.5 shadow-lg">
            <div className="text-[20px] hidden lg:flex">{Number(data?.price).toLocaleString("id-ID", {style: "currency", currency: "IDR"})}</div>
            <div className="text-[20px]">{data?.name}</div>
            <div className="lg:hidden flex text-[20px]">{Number(data?.price).toLocaleString("id-ID", {style: "currency", currency: "IDR"})}</div>
            {data?.available_seats !== 0 ? (
              <div className="text-[13px] lg:px-2.5 lg:py-[3px] p-2.5 font-semibold bg-[#EEFDF3] lg:rounded-none rounded-[5px]">Available</div>
            ) : (
              <div className="text-[13px] lg:px-2.5 lg:py-[3px] p-2.5 font-semibold text-white bg-red-500 lg:rounded-none rounded-[5px]">Not Available</div>
            )}
          </div>

          <div className="flex gap-[5px] mt-[45px] items-center">
            <FileText className="w-[30px] h-[30px] stroke-3"/>
            <p className="text-[26px] font-bold">Terms and Conditions</p>
          </div>
          <div className="mt-2.5 leading-6 xl:w-[680px]">
            <p className="leading-6">1. Tiket Tidak Dapat Diuangkan Kembali.
            Seluruh pembelian tiket bersifat final dan non-refundable, kecuali apabila terjadi pembatalan dari pihak penyelenggara.</p>
            <p className="leading-6">2. Tiket Bersifat Terbatas.
            Tiket hanya berlaku untuk tanggal dan sesi acara yang tertera.
            Pastikan hadir sesuai jadwal agar pengalaman acara tetap optimal.</p>
            <p className="leading-6">3. Ketentuan Lainnya.
            Penyelenggara berhak melakukan perubahan waktu, lokasi, atau susunan acara dengan pemberitahuan sebelumnya melalui email.</p>
          </div>
        </div>

        <div className="xl:w-[500px] h-[350px] border-x border-b rounded-b-lg shadow-lg p-[15px] xl:flex flex-col hidden">
          <div className="flex justify-between items-center">
            <h1 className="text-[17px] font-bold">{Number(data?.price).toLocaleString("id-ID", {style: "currency", currency: "IDR"})}</h1>
            <button className="text-[16px] font-semibold text-white bg-[#F6A273] px-[27px] py-4 rounded-[10px] cursor-pointer hover:bg-[#f0b492]">Beli Tiket</button>
          </div>

          <div className="mt-[35px] flex flex-col gap-[15px]">
            <h1 className="text-[25px] font-bold">{data?.name}</h1>
            <div className="flex gap-[15px]">
              <MapPin/>
              <p className="text-[17px]">{data?.location}</p>
            </div>
            <div className="flex gap-[15px]">
              <Calendar/>
              <p className="text-[17px]">{data?.end_date.toLocaleDateString("id-ID", {day: "numeric", month: "long", year: "numeric"})}</p>
            </div>

            <div className="mt-[25px]">
              <hr className="opacity-20"/>
              <div className="mt-[15px] flex gap-2.5 items-center">
                <div>{ avatar === null ? (
                  <div className="w-10 h-10 rounded-full bg-black/30 flex justify-center items-center">
                    <User/>
                  </div>
                ) : (
                  <Image src={avatar} fill={true} alt="avatar" className="w-10 h-10 rounded-full"/>
                )}</div>
                <div>
                  <p className="text-[15px] opacity-50">Diselenggarakan oleh</p>
                  <p className="text-[16px] font-bold">{eo}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-[115px] px-[25px] xl:hidden">
        <div className="flex justify-between">
          <p className="text-[13px] opacity-40">Harga mulai dari</p>
          <h2 className="font-bold text-[19px]">{Number(data?.price).toLocaleString("id-Id", {style: "currency", currency: "IDR"})}</h2>
        </div>

        <Link href={`/purchase/${id}`} >
              <button className="w-full text-[16px] font-bold bg-[#F6A273] py-[15px] rounded-[10px] text-white hover:bg-[#f0b492] cursor-pointer">Beli Tiket</button>
        </Link>
      </div>
    </div>
  )
}

export default page
