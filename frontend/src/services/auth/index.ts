import axios from "axios";

export async function verificationLinkService(email:string) {
    try {
        const payload = {
            email: email
        }
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/verification-link`,
            payload
        );
        console.log(data);
        return data;
    } catch (error) {
        throw error;
    }
}