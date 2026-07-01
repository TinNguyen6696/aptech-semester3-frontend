export default function LoginForm(){
    return(
        <>
            <div className="bg-white p-8 rounded-lg shadow-md w-full">
                <h2 className="text-2xl font-bold mb-1 text-start text-gray-800">Welcome back</h2>
                <span className="text-xs">Sign in to your Spotlight account</span>
                <form className="mt-4">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                        <input className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500" type="email" placeholder="email@example.com"/>
                    </div>
                    
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                        <input className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500" type="password" placeholder="********"/>
                    </div>
                    
                    <button className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition duration-300">
                        Sign In
                    </button>
                </form>
            </div>              
        </>
    )
}