import Image from "next/image"
import RegisterFrom from "./components/registerForm"

function RegisterView() {
  return (
    <div className="flex w-full h-screen">
        <div className="lg:w-[50%] w-full px-[83px] flex flex-col gap-10 justify-center">
            <h1 className="font-bold text-[50px] text-center">Sign Up</h1>
            <RegisterFrom/>
        </div>

        <div className='lg:w-[50%] md:w-[50%] bg-black/30 bg-cover relative z-20 lg:flex hidden justify-center items-center'>
          <Image src="/party.jpg" fill={true} alt='cover' className='absolute object-cover mix-blend-overlay'/>
          <h1 className='text-[130px] text-white font-monoton text-center'>LET'S PARTY WITH US</h1>
        </div>
    </div>
  )
}

export default RegisterView
