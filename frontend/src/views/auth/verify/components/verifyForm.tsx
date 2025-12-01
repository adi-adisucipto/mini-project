"use client"

import { useFormik } from "formik"
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios"
import { useSnackbar } from "notistack";
import AvatarUpload from "./AvatarUpload";
import Button from "@/components/Button";
import Image from "next/image";

function VerifyForm() {
    const router = useRouter()
    const searchParams = useSearchParams();
    const paramValue = searchParams.get("token");
    const { enqueueSnackbar } = useSnackbar();

    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
            referrerCode: "",
            isOrganizer: false,
            avatar: null,
            token: ""
        },
        onSubmit: async () => {
            try {
                const { username, password, referrerCode, avatar, isOrganizer } = formik.values;
                const formData = new FormData();

                formData.append('username', username);
                formData.append('password', password);
                if(referrerCode) formData.append('referrerCode', referrerCode);

                const role = isOrganizer ? "ORGANIZER" : "USER"

                formData.append('role', role);
                if(avatar) formData.append("avatar", avatar)

                const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify`, formData,
                    {
                        headers: {
                            Authorization: `Bearer ${paramValue}`
                        }
                    }
                );

                enqueueSnackbar(res.data.message, { variant: "success" });
                router.push("/auth/login")
            } catch (error) {
                if(error instanceof Error) {
                    console.log(error)
                    enqueueSnackbar(error.message, { variant: "error" })
                } else {
                    enqueueSnackbar("Something went wrong", { variant: "error" })
                }
            }
        }
    });
  return (
    <div className="w-full flex">
        <div className="h-screen w-[50%] flex justify-center items-center">
            <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6 w-full px-[83px]">
                <div className="mx-auto">
                    <AvatarUpload avatarValue={formik.values.avatar} setAvatarValue={(file: File | null) => formik.setFieldValue("avatar", file)}/>
                </div>

                <h1 className='font-bold lg:text-[50px] text-[40px] text-center'>CREATE ACCOUNT</h1>

                <input
                    type="text"
                    name="username"
                    onChange={formik.handleChange}
                    value={formik.values.username}
                    placeholder="Username"
                    className="bg-black/30 px-5 py-4 rounded-[5px] outline-none text-white text-[20px] w-full"
                />
                <input
                    type="password"
                    name="password"
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    placeholder="Password"
                    className="bg-black/30 px-5 py-4 rounded-[5px] outline-none text-white text-[20px] w-full"
                />
                <input
                    type="text"
                    name="referrerCode"
                    onChange={formik.handleChange}
                    value={formik.values.referrerCode}
                    placeholder="Referral Code (Optional)"
                    className="bg-black/30 px-5 py-4 rounded-[5px] outline-none text-white text-[20px] w-full"
                />

                <div className="flex justify-between w-full items-center mx-auto">
                    <div className="flex items-center cursor-pointer gap-2 text-sm text-gray-700">
                        <label className="flex items-center cursor-pointer gap-3 text-lg">
                            <input 
                                type="checkbox" 
                                name="isOrganizer"
                                value="USER"
                                checked={formik.values.isOrganizer}
                                onChange={formik.handleChange}
                                className="h-5 w-5 rounded border-gray-400 bg-white checked:bg-orange-500 checked:border-orange-500 focus:ring-orange-500 text-orange-500"
                            />
                            
                            <span className="text-[17px]">Register as Organizer</span>
                        </label>
                    </div>
                </div>

                <Button
                    type="submit"
                >Submit Register</Button>
            </form>
        </div>

        <div className='lg:w-[50%] md:w-[50%] bg-black/30 bg-cover relative z-20 lg:flex hidden justify-center items-center'>
          <Image src="/party.jpg" fill={true} alt='cover' className='w-full absolute object-cover mix-blend-overlay'/>
          <h1 className='text-[130px] text-white font-monoton text-center'>LET'S PARTY WITH US</h1>
        </div>
    </div>
  )
}

export default VerifyForm
