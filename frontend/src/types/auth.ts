export interface DecodedToken {
    user_id: string;
    email: string;
    username:string;
    role:string;
    avatar:string | null;
    referral_code:string;
    points_balance:number;
    exp:number
}