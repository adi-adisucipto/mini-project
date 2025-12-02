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
    <div className="flex justify-center items-center lg:h-[85vh]">
        <Container className="lg:flex md:flex justify-center items-center w-full my-16 md:mx-16">
            <div className="lg:w-[50%] md:w-[50%] hidden lg:flex md:flex flex-col lg:px-[50px] lg:py-20 md:px-[50px] md:py-20">
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

            <div className="lg:w-[50%] hidden lg:flex md:flex flex-col md:w-[50%]">
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

            <div className="lg:hidden md:hidden">
                <div>
                    <h2 className="text-[18px] font-bold text-white tracking-[0.2em]">ITEM</h2>
                    <hr className="bg-white mb-5 mt-2.5 border-0 h-px"/>
                    <div className="w-[300px] h-[200px] mx-auto bg-slate-200 rounded-[10px]"></div>
                    <h1 className="text-white text-[20px] font-bold mt-5">{data?.name}</h1>
                    <h1 className="text-white text-[20px] font-bold">Rp{(data?.price ? data.price : 0).toLocaleString("id-ID")}</h1>
                    <hr className="bg-white my-5 border-0 h-px"/>
                </div>

                <div>
                    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-[30px]">
                        <div>
                            <label className="text-[20px] font-bold text-white tracking-[0.2em]">VOUCHER</label>
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
            </div>
        </Container>
    </div>
  )
}

export default page