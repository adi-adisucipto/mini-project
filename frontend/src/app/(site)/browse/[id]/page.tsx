"use client"

import axios from "axios";
import { useEffect, use, useState } from "react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

interface EventData {
    event_id:string;
    organizer_id:string;
    name:string;
    description:string;
    price:number;
    start_date: Date
    end_date: Date
    available_seats:number;
    total_seats:number;
    category:string;
    location:string;
    is_paid:boolean;
    created_at:Date;
}

function page({params}:PageProps) {
    const [data, setData] = useState<EventData | null>(null)
    const {id} =  use(params);
    useEffect(() => {
        const eventInfo = async () => {
            try {
                const event = await axios.get(`http://localhost:8000/api/transaction/event/${id}`);
                setData(event.data.user);
            } catch (error) {
                
            }
        }

        eventInfo()
    }, [id]);
  return (
     <div className='md:h-[80vh] py-10 flex justify-center items-center'>
      <div className='md:max-w-2xl rounded-xl max-w-[400px] w-full md:flex shadow-xl'>
        <div className='md:w-[50%] flex items-center justify-center p-8 md:rounded-l-xl rounded-t-xl md:rounded-t-none bg-gray-200'>
        </div>
        <div className='md:w-[50%] rounded-xl p-8 flex flex-col gap-4'>
            <p className='text-black/70'>{data?.category}</p>
            <h1 className='text-2xl font-bold'>{data?.name}</h1>
            <p className='text-[15px] text-gray-900/70'>{data?.description}</p>
            <p className="font-bold text-3xl text-green-950/70">Rp{data?.price}</p>
            <div className="">
                <p className='text-[13px] text-gray-900/70'>Available seats: {data?.available_seats}</p>
                <Link href={`/purchase/${id}`}>
                    <button className="bg-green-950 text-white w-full p-2 rounded-lg hover:bg-green-950/80 cursor-pointer">Add to cart</button>
                </Link>
            </div>
        </div>
      </div>
    </div>
  )
}

export default page
