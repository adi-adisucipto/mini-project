"use client";

import { Formik, Form, FormikProps } from "formik";
import { useSnackbar } from "notistack";
import Link from "next/link";

import { verificationLinkService } from "@/services/auth";
import registerSchema from "../schema";
import Button from "@/components/Button";
import { AxiosError } from "axios";

function RegisterFrom() {
    const { enqueueSnackbar } = useSnackbar();
    const initialValues = { email: "" }

    async function handleSubmit(values: { email: string }) {
        try {
            const data = await verificationLinkService(values.email);

            enqueueSnackbar(data.message, { variant: "success" });
        } catch (error) {
            if(error instanceof AxiosError) {
                console.log(error)
                enqueueSnackbar(error.response?.data.error, { variant: "error" })
            } else {
                enqueueSnackbar("Something went wrong", { variant: "error" })
            }
        }
    }
  return (
    <Formik
        initialValues={initialValues}
        validationSchema={registerSchema}
        onSubmit={handleSubmit}
    >
        {(props: FormikProps<{email: string}>) => {
            return (
                <Form className="flex flex-col text-center">
                    <div className="w-full">
                        <input
                            name="email"
                            type="email"
                            placeholder="Email"
                            value={props.values.email}
                            onChange={props.handleChange}
                            className="bg-black/30 px-5 py-4 rounded-[5px] outline-none text-white text-[20px] w-full"
                        />
                        {props.errors.email && props.touched.email && (
                            <span className="text-red-500 text-[12px]">*{props.errors.email}</span>
                        )}
                    </div>

                    <Button
                        className="mt-10"
                        type="submit"
                    >
                            Send Email Verification
                    </Button>

                    <div className="text-black/50">Already have account? <Link href='/auth/login' className="text-[#F6A273] underline">Login</Link></div>
                </Form>
            )
        }}
    </Formik>
  )
}

export default RegisterFrom
