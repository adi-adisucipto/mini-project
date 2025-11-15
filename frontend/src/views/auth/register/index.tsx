import RegisterFrom from "./components/registerForm"

function RegisterView() {
  return (
    <div className="h-screen flex flex-col justify-center">
        <div className="bg-slate-100 md:max-w-2xl mx-auto p-5 rounded-xl shadow-lg mt-10 flex flex-col items-center gap-10">
            <h1 className="font-bold text-xl">Sign Up</h1>
            <RegisterFrom/>
        </div>
    </div>
  )
}

export default RegisterView
