"use client"

import axios from "axios";
import { useEffect, use, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useFormik } from "formik";
import { enqueueSnackbar } from "notistack";

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
    const { data: session, status } = useSession()
    const accessToken = session?.accessToken
    const router = useRouter();
    useEffect(() => {
        const eventInfo = async () => {
            try {
                const event = await axios.get(`http://localhost:8000/api/transaction/event/${id}`);
                setData(event.data.user);
            } catch (error) {
                throw error;
            }
        }

        eventInfo()
    }, [id]);

    const formik = useFormik({
        initialValues: {
            ticket: 1, pointsToUse: 0, codeCoupon: "", codeVouche: ""
        },
        onSubmit: async () => {
            try {
                const { ticket, pointsToUse, codeCoupon, codeVouche } = formik.values;
                console.log(accessToken);
                const data = await axios.post(`http://localhost:8000/api/transaction/purchase/${id}`, 
                    {
                        ticket,
                        pointsToUse,
                        codeCoupon,
                        codeVouche
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    }
                );
                enqueueSnackbar(data.data.data.messgae, { variant: "success" });
                router.push("/tickets")
            } catch (error) {
                console.log(error)
            }
        }
    })
  return (
     <div className='md:h-[80vh] py-10 flex justify-center items-center'>
      <div className='md:max-w-2xl rounded-xl max-w-[400px] w-full md:flex shadow-xl'>
        <div className='md:w-[50%] rounded-xl p-8 flex flex-col gap-4'>
            <p className='text-black/70'>{data?.category}</p>
            <h1 className='text-2xl font-bold'>{data?.name}</h1>
            <p className='text-[15px] text-gray-900/70'>{data?.description}</p>
            <p className="font-bold text-3xl text-green-950/70">Rp{data?.price}</p>
            
        </div>
        <div className='md:w-[50%] flex flex-col gap-5 p-8 md:rounded-l-xl rounded-t-xl md:rounded-t-none bg-gray-200'>
            <form onSubmit={formik.handleSubmit} className="flex flex-col gap-3">
                <div>
                    <label>Ticket</label>
                    <input
                        type="number"
                        placeholder="Ticket"
                        className="bg-gray-300 w-full p-2 rounded-lg"
                        name="ticket"
                        value={formik.values.ticket}
                        onChange={formik.handleChange}
                    />
                </div>

                <div>
                    <label>Voucher Code</label>
                    <input
                        type="text"
                        placeholder="Voucher Code"
                        className="bg-gray-300 w-full p-2 rounded-lg"
                        name="codeVouche"
                        value={formik.values.codeVouche}
                        onChange={formik.handleChange}
                    />
                </div>

                <div>
                    <label>Coupon</label>
                    <input
                        type="text"
                        placeholder="Coupon"
                        className="bg-gray-300 w-full p-2 rounded-lg"
                        name="codeCoupon"
                        value={formik.values.codeCoupon}
                        onChange={formik.handleChange}
                    />
                </div>

                <div>
                    <label>Points</label>
                    <input
                        type="number"
                        placeholder="Points"
                        className="bg-gray-300 w-full p-2 rounded-lg"
                        name="pointsToUse"
                        value={formik.values.pointsToUse}
                        onChange={formik.handleChange}
                    />
                </div>
                <div className="">
                    <p className='text-[13px] text-gray-900/70'>Available seats: {data?.available_seats}</p>
                    <button className="bg-green-950 text-white w-full p-2 rounded-lg hover:bg-green-950/80 cursor-pointer"
                        type="submit"
                    >Confirm</button>
                </div>
            </form>
        </div>
      </div>
    </div>
  )
}

export default page
