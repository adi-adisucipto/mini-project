import Image from 'next/image'
import LoginPage from './components/login'

function LoginView() {
  return (
    <div className='w-full h-screen flex'>
      <div className='flex flex-col w-[50%] mx-auto text-center gap-5 px-[83px] justify-center'>
        <h1 className='text-[50px] font-bold font-roboto'>Welcome Back</h1>
        <LoginPage/>
      </div>

      <div className="w-[50%] h-full bg-black/30 bg-cover relative z-10 flex items-center justify-center">
        <Image src='/party.jpg' fill={true} alt="cover" className="w-full h-full absolute object-cover mix-blend-overlay z-20"/>
        <h1 className="text-white text-[100px] text-center font-monoton">LET'S PARTY WITH US</h1>
      </div>
    </div>
  )
}

export default LoginView
