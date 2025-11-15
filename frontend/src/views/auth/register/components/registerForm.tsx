"use client";

import { Formik, Form, FormikProps } from "formik";
import { useSnackbar } from "notistack";

import { verificationLinkService } from "@/services/auth";
import registerSchema from "../schema";

function RegisterFrom() {
    const { enqueueSnackbar } = useSnackbar();
    const initialValues = { email: "" }

    async function handleSubmit(values: { email: string }) {
        try {
            const data = await verificationLinkService(values.email);

            enqueueSnackbar(data.message, { variant: "success" });
        } catch (error) {
            if(error instanceof Error) {
                console.log(error)
                enqueueSnackbar(error.message, { variant: "error" })
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
                <Form className="flex flex-col gap-5">
                    <div className="w-lg">
                        <input
                            name="email"
                            type="email"
                            placeholder="Email"
                            value={props.values.email}
                            onChange={props.handleChange}
                            className="border border-slate-400 px-3 py-2 rounded-lg outline-0 w-full"
                        />
                        {props.errors.email && props.touched.email && (
                            <span className="text-red-500 text-[12px]">*{props.errors.email}</span>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-500 py-2 rounded-lg font-bold cursor-pointer hover:bg-green-400">
                            Send Email Verification
                    </button>
                </Form>
            )
        }}
    </Formik>
  )
}

export default RegisterFrom
