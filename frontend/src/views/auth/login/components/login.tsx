"use client";

import axios, { AxiosError } from "axios";
import { useFormik } from "formik"
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";

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
            className="bg-slate-200 px-3 py-2 rounded-xl"
        />

        <input
            type="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            placeholder="Password"
            className="bg-slate-200 px-3 py-2 rounded-xl"
        />
        <button type="submit" className="bg-sky-200 py-2 rounded-xl cursor-pointer">Login</button>
      </form>
    </div>
  )
}

export default LoginPage
