"use client"

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import Link from "next/link";

interface Transaction {
    transaction_id: string
    customer_id: string
    event_id: string
    ticket_quantity: number
    total_price_paid: number
    statusPay: string
    proof_upload_at: Date
    payment_proof_url: string
    payment_proof_due_at: Date
    organizer_confirmation_due_at: Date

    event: {
        event_id: string
        organizer_id: string
        name: string
        description: string
        price: number
        start_date: Date
        end_date: Date
        available_seats: number
        total_seats: number
        category: string
        location: string
        is_paid: boolean
        created_at: Date
    }

    points_used: number
    coupon_use_id: string
    voucher_used_id: string
}

function page() {
    const [datas, setDatas] = useState<Transaction[]>([])
    const { data: session, status } = useSession();

    useEffect(() => {
        if(status == "authenticated" && session) {
            const email =  session?.user?.email
            const transactionInfo = async () => {
                try {
                    const transaction = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/transaction/tickets`, { email });
                    setDatas(transaction.data.data);
                } catch (error) {
                    throw error;
                }
            }
            transactionInfo();
        }
    }, [status, session]);

    const handleClick = async (id:string) => {
        try {
            const cancel = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/transaction/cancel`, { id });
            window.location.reload();
        } catch (error) {
            console.log(error)
        }
    }

    const statusTextMap: { [key: string]: string } = {
        "WaitingPay": "Menunggu Pembayaran",
        "WaitingConfirm": "Menunggu Konfirmasi Penyelenggara",
        "Done": "Selesai",
        "Rejected": "Ditolak",
        "Expired": "Expired",
        "Canceled": "Dibatalkan"
    };

    const statusColorMap: { [key: string]: string } = {
        "WaitingPay": "text-red-500",
        "WaitingConfirm": "text-red-500",
        "Done": "text-green-500",
        "Rejected": "text-red-500",
        "Expired": "text-red-500",
        "Canceled": "text-red-500"
    };
  return (
    <div className='py-10 flex w-full'>
        {status == "loading" || (status == "authenticated" && datas.length === 0) ? (
            <p className="text-gray-500 w-full text-center">Memuat data transaksi ...</p>
        ) : (
            <div className="max-w-4xl w-4xl mx-auto">
                <div className="">
                    {datas.map((tx) => {
                        const colorClass = statusColorMap[tx.statusPay] || "text-gray-700";
                        const id = tx.event.event_id;
                        return (
                            <div key={tx.transaction_id}
                                className="flex flex-col gap-3 bg-slate-200 m-5 p-5 rounded-xl"
                                >
                                <div>
                                    <h1 className="font-bold text-2xl">{tx.event.name}</h1>
                                    <h3 className={`font-semibold ${colorClass}`}>
                                        {statusTextMap[tx.statusPay] || "Status tidak diketahui"}
                                    </h3>
                                    <h3>
                                        Waktu Jatuh Tempo: {' '}
                                        {new Date(tx.payment_proof_due_at).toLocaleTimeString('id-ID', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: false
                                        })}
                                    </h3>
                                </div>
                                {tx.statusPay === "WaitingPay" ? (
                                    <div className="flex flex-col gap-3">
                                        <Link href={`/tickets/${tx.transaction_id}`}>
                                            <button className="bg-green-950 text-white w-full p-2 rounded-lg hover:bg-green-950/80 cursor-pointer">Upload Bukti Pembayaran</button>
                                        </Link>
                                        <button
                                            className="bg-red-700 text-white w-full p-2 rounded-lg hover:bg-red-700/80 cursor-pointer"
                                            onClick={() => handleClick(tx.transaction_id)}
                                            >
                                                Cancel
                                        </button>
                                    </div>
                                ) : (<></>)}
                            </div>
                        )
                    })}
                </div>
            </div>
        )}
    </div>
  )
}

export default page
