import axios from "axios";

export async function verificationLinkService(email:string) {
    try {
        const payload = {
            email: email
        }
        const { data } = await axios.post("http://localhost:8000/api/auth/verification-link",
            payload
        );
        console.log(data);
        return data;
    } catch (error) {
        throw error;
    }
}