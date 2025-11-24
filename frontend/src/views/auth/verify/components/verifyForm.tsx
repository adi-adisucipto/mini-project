"use client"

import { useFormik } from "formik"
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios"
import { useSnackbar } from "notistack";
import AvatarUpload from "./AvatarUpload";

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
            role: 'USER',
            avatar: null,
            token: ""
        },
        onSubmit: async () => {
            try {
                const { username, password, referrerCode, avatar, role } = formik.values;
                const formData = new FormData();

                formData.append('username', username);
                formData.append('password', password);
                if(referrerCode) formData.append('referrerCode', referrerCode);
                formData.append('role', role);
                if(avatar) formData.append("avatar", avatar)

                const res = await axios.post(`http://localhost:8000/api/auth/verify`, formData,
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

    const roleProps = formik.getFieldProps('role');
  return (
    <div className="h-screen flex justify-center items-center">
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5 w-lg bg-slate-50 p-5 rounded-lg">
            <div className="mx-auto">
                <AvatarUpload avatarValue={formik.values.avatar} setAvatarValue={(file: File | null) => formik.setFieldValue("avatar", file)}/>
            </div>

            <input
                type="text"
                name="username"
                onChange={formik.handleChange}
                value={formik.values.username}
                placeholder="Username"
                className="border border-slate-400 px-3 py-2 rounded-lg outline-0 w-full"
            />
            <input
                type="password"
                name="password"
                onChange={formik.handleChange}
                value={formik.values.password}
                placeholder="Password"
                className="border border-slate-400 px-3 py-2 rounded-lg outline-0 w-full"
            />
            <input
                type="text"
                name="referrerCode"
                onChange={formik.handleChange}
                value={formik.values.referrerCode}
                placeholder="Referral Code (Optional)"
                className="border border-slate-400 px-3 py-2 rounded-lg outline-0 w-full"
            />

            <div className="flex justify-between w-[400px] items-center mx-auto">
                <div>
                    <label className="flex items-center cursor-pointer gap-3 text-lg">
                        <input 
                            type="radio" 
                            {...roleProps}
                            value="USER"
                            checked={formik.values.role === 'USER'}
                            className="peer hidden"
                        />
                        
                        <span className="
                            w-4 h-4 rounded-full border-2 border-gray-400 
                            flex items-center justify-center transition-all duration-150
                            peer-checked:border-blue-600                       
                            peer-checked:bg-white
                        ">
                            <span className="
                                w-2.5 h-2.5 rounded-full bg-blue-600 
                                transform scale-0 transition-all duration-150
                                peer-checked:scale-100
                            "></span>
                        </span>
                        User
                    </label>
                </div>

                <div>
                    <label className="flex items-center cursor-pointer gap-3 text-lg">
                        <input 
                            type="radio" 
                            {...roleProps}
                            value="ORGANIZER"
                            checked={formik.values.role === 'ORGANIZER'}
                            className="peer hidden"
                        />
                        
                        <span className="
                            w-4 h-4 rounded-full border-2 border-gray-400 
                            flex items-center justify-center transition-all duration-150
                            peer-checked:border-blue-600
                            peer-checked:bg-white
                        ">
                            <span className="
                                w-2.5 h-2.5 rounded-full bg-blue-600 
                                transform scale-0 transition-all duration-150
                                peer-checked:scale-100
                            "></span>
                        </span>
                        Organizer
                    </label>
                </div>
            </div>

            <button
                type="submit" 
                className="mt-6 w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition cursor-pointer"
            >Submit Register</button>
        </form>
    </div>
  )
}

export default VerifyForm
