"use client";

import Button from "@/components/Button";
import axios, { AxiosError } from "axios";
import { useFormik } from "formik"
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import Link from "next/link";

function LoginPage() {
    const router = useRouter()
    const formik = useFormik({
        initialValues: {
            email: "",
            password: ""
        },
        onSubmit: async () => {
            try {
                const { email, password } = formik.values;
                const user = await signIn("credentials", {
                    email, password,
                    redirect: false
                });

                console.log(user);

                if(user?.ok) {
                    enqueueSnackbar("Login success", { variant: "success" });
                    router.push("/")
                }
            } catch (error) {
                if(error instanceof AxiosError) {
                    enqueueSnackbar(error.response?.data.error, { variant: "error" })
                }
            }
        }
    })
  return (
    <div>
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5">
        <input
            type="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            placeholder="Email"
            className="bg-black/30 px-5 py-4 rounded-[5px] outline-none text-white text-[20px]"
        />

        <input
            type="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            placeholder="Password"
            className="bg-black/30 px-5 py-4 rounded-[5px] outline-none text-white text-[20px]"
        />
        <Button type="submit" className="mt-10">Login</Button>
      </form>

      <div className="text-black/50">Not have account? <Link href='/auth/register' className="text-[#F6A273] underline">Sign Up</Link></div>
    </div>
  )
}

export default LoginPage
