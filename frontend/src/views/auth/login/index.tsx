import LoginPage from './components/login'

function LoginView() {
  return (
    <div className='flex flex-col max-w-xl w-xl mx-auto text-center bg-slate-50 gap-5 p-10 rounded-xl shadow-xl'>
      <h1 className='font-bold text-2xl'>Welcome Back</h1>
      <LoginPage/>
    </div>
  )
}

export default LoginView
