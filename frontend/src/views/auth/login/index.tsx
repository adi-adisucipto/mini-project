import Image from 'next/image'
import LoginPage from './components/login'

function LoginView() {
  return (
    <div className='flex w-full h-screen'>
      <div className='flex flex-col justify-center lg:w-[50%] w-full p-[83px] text-center gap-5'>
        <h1 className='font-bold lg:text-[50px] text-[40px]'>Welcome Back</h1>
        <LoginPage/>
      </div>

      <div className='lg:w-[50%] md:w-[50%] bg-black/30 bg-cover relative z-20 lg:flex hidden justify-center items-center'>
        <Image src="/party.jpg" fill={true} alt='cover' className='absolute object-cover mix-blend-overlay'/>
        <h1 className='text-[130px] text-white font-monoton text-center'>LET'S PARTY WITH US</h1>
      </div>
    </div>
  )
}

export default LoginView
