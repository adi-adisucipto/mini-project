"use client"

import { useFormik } from "formik"
import { useSearchParams } from "next/navigation";
import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { User } from "lucide-react"
import { useSnackbar } from "notistack";

function VerifyForm() {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const searchParams = useSearchParams();
    const paramValue = searchParams.get("token");
    const { enqueueSnackbar } = useSnackbar();


    const formik = useFormik({
        initialValues: {
            email: "",
            username: "",
            password: "",
            referrerCode: "",
            role: 'USER',
            avatar: null
        },
        onSubmit: async () => {
            const { username, password, referrerCode, avatar } = formik.values;
            const formData = new FormData;

            try {
                if(avatar) {
                    formData.append('avatar', avatar);
                }
                formData.append('username', username);
                formData.append('email', paramValue as string);
                formData.append('password', password);
                formData.append('referrerCode', referrerCode);

                const res = await axios.post("http://localhost:8000/api/auth/register", formData);
                enqueueSnackbar(res.data, { variant: "success" });
                return res;
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

    useEffect(() => {
        if(formik.values.avatar) {
            const url = URL.createObjectURL(formik.values.avatar);
            console.log(formik.values.avatar)
            setImageUrl(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setImageUrl(null);
        }
    }, [formik.values.avatar]);

    const handleFileChange = (e:any) => {
        const file = e.target.files[0];
        if(file && file.type.startsWith('image/')) {
            formik.setFieldValue('avatar', file);
        } else {
            formik.setFieldValue('avatar', null);
        }
    }

    const handleDrop = (e:any) => {
        e.preventDefault();
        e.currentTarget.classList.remove('border-indigo-500', 'bg-indigo-50');
        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileChange({ target: { files: [file] } });
        }
    }

    const roleProps = formik.getFieldProps('role');
  return (
    <div className="h-screen flex justify-center items-center">
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5 w-lg bg-slate-50 p-5 rounded-lg">
            <div className="mx-auto">
                {!imageUrl ? (
                    <div
                        className="w-12 h-12 rounded-full flex flex-col justify-center items-center"
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={(e) => {
                            e.preventDefault();
                            e.currentTarget.classList.add('border-indigo-500', 'bg-indigo-50');
                        }}
                        onDragLeave={(e) => {
                            e.preventDefault();
                            e.currentTarget.classList.remove('border-indigo-500', 'bg-indigo-50');
                        }}
                        onDrop={handleDrop}
                    >
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileChange} 
                            accept="image/*" 
                            name="avatar" // Harus sesuai dengan nama Formik initialValues
                            className="hidden"
                        />
                        <div className=" bg-slate-200 w-full h-full rounded-full flex justify-center items-center">
                            <User size={30}/>
                        </div>
                    </div>
                ) : (
                    <div className="w-12 h-12 rounded-full border-2 border-blue-200"
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={(e) => {
                            e.preventDefault();
                            e.currentTarget.classList.add('border-indigo-500', 'bg-indigo-50');
                            }}
                        onDragLeave={(e) => {
                            e.preventDefault();
                            e.currentTarget.classList.remove('border-indigo-500', 'bg-indigo-50');
                            }}
                        onDrop={handleDrop}
                    >
                        <img 
                            src={imageUrl} 
                            alt="Avatar Preview" 
                            className="w-full h-full rounded-full object-cover" 
                        />
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileChange} 
                            accept="image/*" 
                            name="avatar" // Harus sesuai dengan nama Formik initialValues
                            className="hidden"
                        />
                    </div>
                )}
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
                            value="ORGANAIZER"
                            checked={formik.values.role === 'ORGANAIZER'}
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
