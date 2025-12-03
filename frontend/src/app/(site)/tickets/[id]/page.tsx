"use client"

import axios from 'axios';
import { useFormik } from 'formik';
import { Upload } from 'lucide-react';
import { enqueueSnackbar } from 'notistack';
import React, { use, useEffect, useRef, useState } from 'react'
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";


interface PageProps {
  params: Promise<{ id: string }>;
}

function page({params} : PageProps) {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const {id} =  use(params);
    const router = useRouter();
    const { data: session, status } = useSession();

    const accessToken = session?.accessToken

    const formik = useFormik({
        initialValues: {
          bukti: null as File | null
        },
        onSubmit: async () => {
          try {
            const { bukti } = formik.values;
            const formData = new FormData();

            if(bukti) formData.append('bukti', bukti);
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/transaction/upload/${id}`, formData, {
              headers: {
                Authorization: `Bearer ${accessToken}`
              }
            });

            enqueueSnackbar("Berhasil", { variant: "success" });
            router.push("/tickets")
          } catch (error) {
            console.log(error)
          }
        }
    })
    
    useEffect(() => {
      if (formik.values.bukti) {
        const url = URL.createObjectURL(formik.values.bukti);
        setImageUrl(url);
        return () => URL.revokeObjectURL(url); 
      } else {
        setImageUrl(null);
      }
    }, [formik.values.bukti]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const bukti = e.target.files ? e.target.files[0] : null;
        formik.setFieldValue("bukti", bukti)

        if (bukti && bukti.type.startsWith('image/')) {
            formik.setFieldValue("bukti", bukti)
        } else {
            formik.setFieldValue("bukti", null)
        }
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.currentTarget.classList.remove('border-indigo-500', 'bg-indigo-50');
        const bukti = e.dataTransfer.files ? e.dataTransfer.files[0] : null;

        if (bukti) {
            handleFileChange({ target: { files: [bukti] } } as unknown as React.ChangeEvent<HTMLInputElement>);
        }
    }

    const openFileDialog = () => {
        fileInputRef.current?.click();
    };

    const dragOverClass = (e: React.DragEvent<HTMLDivElement>, add: boolean) => {
        e.preventDefault();
        if (add) {
            e.currentTarget.classList.add('border-indigo-500', 'bg-indigo-50');
        } else {
            e.currentTarget.classList.remove('border-indigo-500', 'bg-indigo-50');
        }
    };

    console.log(imageUrl)
  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col bg-slate-50 p-5 rounded-lg">
      <div
          className="w-full h-[85vh] flex flex-col justify-center items-center mx-auto cursor-pointer"
          onClick={openFileDialog}
          onDragOver={(e) => dragOverClass(e, true)}
          onDragLeave={(e) => dragOverClass(e, false)}
          onDrop={handleDrop}
      >
        {/* Tampilkan Placeholder atau Pratinjau Gambar */}
        {!imageUrl ? (
          <div className="bg-slate-200 w-[70vh] h-[70vh] rounded-2xl flex gap-5 justify-center items-center border-dashed border-2 border-black">
            <div>Drag and Drop your file</div>
            <Upload/>
          </div>
        ) : (
          <img
            src={imageUrl}
            alt="Bukti"
            className="w-[70vh] h-[70vh] rounded-2xl flex gap-5 justify-center items-center"
          />
        )}

          <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              name="bukti"
              className="hidden"
          />
      </div>

      <button type='submit' className='bg-gray-200 flex items-center justify-center font-semibold text-lg hover:opacity-60 cursor-pointer gap-3 p-5 w-[70vh] mx-auto rounded-2xl'>
        Upload
        <Upload/>
      </button>
    </form>
  )
}

export default page
function handleFileChange(arg0: React.ChangeEvent<HTMLInputElement>) {
  throw new Error('Function not implemented.');
}

