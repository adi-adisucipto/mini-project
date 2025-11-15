import * as Yup from "yup";

const registerSchema = Yup.object({
    email: Yup.string().trim().email('Invalid email').required('Email is required'),
})

export default registerSchema;