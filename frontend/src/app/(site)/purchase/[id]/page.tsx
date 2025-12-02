"use client"

import axios from "axios";
import { useEffect, use, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useFormik } from "formik";
import { enqueueSnackbar } from "notistack";
import Container from "@/components/Container";
import { ChevronDown, ChevronUp } from "lucide-react";
import Button from "@/components/Button";

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
    const [discount, setDiscount] = useState<number>(0)
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
            ticket: 1, pointsToUse: 0, codeCoupon: "", codeVouche: "", quantity: 1
        },
        onSubmit: async () => {
            try {
                const { ticket, pointsToUse, codeCoupon, codeVouche, quantity } = formik.values;
                const data = await axios.post(`http://localhost:8000/api/transaction/purchase/${id}`, 
                    {
                        ticket: quantity,
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
    });

    const calculateDisc = async () => {
        const { ticket, pointsToUse, codeCoupon, codeVouche, quantity } = formik.values;
        const disc = await axios.post("http://localhost:8000/api/transaction/disc",
            {
                idEvent: id,
                ticket: quantity,
                pointsToUse,
                codeCoupon,
                codeVouche
            }
        )

        setDiscount(disc.data.disc.totalDis)
        return disc;
    }

    useEffect(() => {
        const handler = setTimeout(() => {
            calculateDisc();
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [
        formik.values.quantity, 
        formik.values.pointsToUse, 
        formik.values.codeCoupon, 
        formik.values.codeVouche, 
        data, 
        accessToken
    ])

    const increaseQuantity = () => {
        formik.setFieldValue('quantity', formik.values.quantity + 1);
    };

    const decreaseQuantity = () => {
        if (formik.values.quantity > 1) {
            formik.setFieldValue('quantity', formik.values.quantity - 1);
        }
    };

    const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        formik.handleSubmit(); 
    };
  return (
    <div className="flex justify-center items-center h-[85vh]">
        <Container className="flex justify-center items-center w-full">
            <div className="w-[50%] px-[50px] py-20">
                <div className="p-5">
                    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-[30px]">
                        <div>
                            <label className="text-[20px] font-bold text-white tracking-[0.2em]">VOUCHER</label>
                            <hr className="bg-white mt-[5px] mb-2.5 border-0 h-px"/>
                            <input
                                type="text"
                                placeholder="Voucher Code"
                                className="bg-white/30 px-4 py-3 rounded-[5px] outline-none text-white text-[17px] w-full"
                                name="codeVouche"
                                value={formik.values.codeVouche}
                                onChange={formik.handleChange}
                            />
                        </div>

                        <div>
                            <label className="text-[20px] font-bold text-white tracking-[0.2em]">COUPON</label>
                            <hr className="bg-white mt-[5px] mb-2.5 border-0 h-px"/>
                            <input
                                type="text"
                                placeholder="Coupon"
                                className="bg-white/30 px-4 py-3 rounded-[5px] outline-none text-white text-[17px] w-full"
                                name="codeCoupon"
                                value={formik.values.codeCoupon}
                                onChange={formik.handleChange}
                            />
                        </div>

                        <div>
                            <label className="text-[20px] font-bold text-white tracking-[0.2em]">POINTS</label>
                            <hr className="bg-white mt-[5px] mb-2.5 border-0 h-px"/>
                            <input
                                type="number"
                                placeholder="Points"
                                className="bg-white/30 px-4 py-3 rounded-[5px] outline-none text-white text-[17px] w-full"
                                name="pointsToUse"
                                value={formik.values.pointsToUse}
                                onChange={formik.handleChange}
                            />
                        </div>
                    </form>
                </div>
            </div>

            <div className="w-[50%]">
                <div>
                    <h1 className="text-[20px] font-bold text-white tracking-[0.2em]">ITEM</h1>
                    <hr className="bg-white mt-[5px] mb-2.5 border-0 h-px"/>
                </div>

                <div className="flex gap-7">
                    <div>
                        <div className="w-[200px] h-[150px] bg-slate-200 rounded-[10px]"></div>
                    </div>
                    <div>
                        <h1 className="text-white text-[20px] font-bold">{data?.name}</h1>
                        <p className="text-white text-[17px] font-bold">Rp{Number(data?.price).toLocaleString("id-ID")}</p>
                        <div className="flex justify-between items-center bg-white/30 gap-5 px-2 py-1 rounded-[5px] w-[70px]">
                            <div>
                                <span className="w-8 text-center text-[20px] font-semibold">{formik.values.quantity}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <button
                                    type="button"
                                    onClick={increaseQuantity}
                                    className="border border-black/20 rounded-[5px]"
                                >
                                    <ChevronUp size={18}/>
                                </button>
                                <button
                                    type="button"
                                    onClick={decreaseQuantity}
                                    disabled={formik.values.quantity <= 1}
                                    className="border border-black/20 rounded-[5px]"
                                >
                                    <ChevronDown size={18}/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-[25px]">
                    <hr className="bg-white mb-2.5 border-0 h-px"/>
                    <div className="flex justify-between">
                        <div className="text-white text-[20px] font-semibold tracking-[0.2em]">SUBTOTAL</div>
                        <div className="text-white font-semibold text-[20px]">Rp{data?.price ? (data.price * formik.values.quantity).toLocaleString("id-ID") : ""}</div>
                    </div>
                    <div className="flex justify-between">
                        <div className="text-white text-[20px] font-semibold tracking-[0.2em]">DISCOUNT</div>
                        <div className="text-white font-semibold text-[20px]">Rp{discount.toLocaleString("id-ID")}</div>
                    </div>
                </div>

                <div>
                    <hr className="bg-white mt-[5px] mb-2.5 border-0 h-px"/>
                    <div className="flex justify-between">
                        <div className="text-white text-[25px] font-semibold tracking-[0.2em]">TOTAL</div>
                        <div className="text-white font-semibold text-[25px]">Rp{data?.price ? (data.price * formik.values.quantity - discount).toLocaleString("id-ID") : 0}</div>
                    </div>
                </div>

                <Button type="submit" onClick={handleButtonClick} className="mt-[30px]">Payment</Button>
            </div>
        </Container>
    </div>
  )
}

export default page


// <div className='md:h-[80vh] py-10 flex justify-center items-center'>
    //     <div className='md:max-w-2xl rounded-xl max-w-[400px] w-full md:flex shadow-xl'>
    //         <div className='md:w-[50%] rounded-xl p-8 flex flex-col gap-4'>
    //             <p className='text-black/70'>{data?.category}</p>
    //             <h1 className='text-2xl font-bold'>{data?.name}</h1>
    //             <p className='text-[15px] text-gray-900/70'>{data?.description}</p>
    //             <p className="font-bold text-3xl text-green-950/70">Rp{data?.price}</p>
    //         </div>
            
    //         <div className='md:w-[50%] flex flex-col gap-5 p-8 md:rounded-l-xl rounded-t-xl md:rounded-t-none bg-gray-200'>
    //             <form onSubmit={formik.handleSubmit} className="flex flex-col gap-3">
    //                 <div>
    //                     <label>Ticket</label>
    //                     <input
    //                         type="number"
    //                         placeholder="Ticket"
    //                         className="bg-gray-300 w-full p-2 rounded-lg"
    //                         name="ticket"
    //                         value={formik.values.ticket}
    //                         onChange={formik.handleChange}
    //                     />
    //                 </div>

    //                 <div>
    //                     <label>Voucher Code</label>
    //                     <input
    //                         type="text"
    //                         placeholder="Voucher Code"
    //                         className="bg-gray-300 w-full p-2 rounded-lg"
    //                         name="codeVouche"
    //                         value={formik.values.codeVouche}
    //                         onChange={formik.handleChange}
    //                     />
    //                 </div>

    //                 <div>
    //                     <label>Coupon</label>
    //                     <input
    //                         type="text"
    //                         placeholder="Coupon"
    //                         className="bg-gray-300 w-full p-2 rounded-lg"
    //                         name="codeCoupon"
    //                         value={formik.values.codeCoupon}
    //                         onChange={formik.handleChange}
    //                     />
    //                 </div>

    //                 <div>
    //                     <label>Points</label>
    //                     <input
    //                         type="number"
    //                         placeholder="Points"
    //                         className="bg-gray-300 w-full p-2 rounded-lg"
    //                         name="pointsToUse"
    //                         value={formik.values.pointsToUse}
    //                         onChange={formik.handleChange}
    //                     />
    //                 </div>

    //                 <div className="">
    //                     <p className='text-[13px] text-gray-900/70'>Available seats: {data?.available_seats}</p>
    //                     <button className="bg-green-950 text-white w-full p-2 rounded-lg hover:bg-green-950/80 cursor-pointer"
    //                         type="submit"
    //                     >Confirm</button>
    //                 </div>
    //             </form>
    //         </div>
    //     </div>
    // </div>