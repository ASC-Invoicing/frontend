import React, { useState } from 'react';
import { Mail, Lock, LogIn } from 'lucide-react';
import { Button, Input } from '../../components/ui';
import { Link } from 'react-router-dom';


interface LoginFormState {
    email: string;
    password: string;
}


const FIRS_BLUE = '#00529A';


const Login = () => {
    const [formData, setFormData] = useState<LoginFormState>({
        email: '',
        password: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSignIn = () => {
        setIsLoading(true);
        console.log('Attempting Sign In:', formData);
        setTimeout(() => {
            setIsLoading(false);
            console.log('Sign in successful/failed ');
        }, 2000);
    };

    const handleGoogleSignIn = () => {
        console.log('Google Sign In clicked');

    };


    const logoStyles = `bg-[${FIRS_BLUE}] text-white`;


    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 font-sans">
            <div className="bg-white p-8 sm:p-10 shadow-xl rounded-xl max-w-md w-full transition-all duration-300">

                <div className="flex flex-col items-center mb-8">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center text-xl font-bold mb-4 ${logoStyles}`} style={{ backgroundColor: FIRS_BLUE }}>
                        FIRS
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">
                        Welcome to FIRS PayPro
                    </h1>
                    <p className="text-gray-500 text-sm">Log in to continue</p>
                </div>

                {/* Google Sign-in */}
                <div className="mb-6">
                    <Button variant='outline' fullWidth className=' border-gray-200' onClick={handleGoogleSignIn}>
                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 48 48">
                            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                        </svg>
                        <span className='text-gray-800 text-sm'>Continue with Google</span>
                    </Button>
                </div>

                <div className="flex items-center my-6">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="flex-shrink mx-4 text-gray-500 text-xs uppercase">or</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                {/* Form */}
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <Input
                        icon={<Mail className="w-5 h-5" />}
                        placeholder="you@example.com"
                        type="text"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />

                    <label className="block text-sm font-medium text-gray-700 pt-2">Password</label>
                    <Input
                        icon={<Lock className="w-5 h-5" />}
                        placeholder="********"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>

                {/* Sign In Button */}
                <div className="mt-8">
                    <Button onClick={handleSignIn} fullWidth loadingText="Signing In" variant='dark'>
                        <LogIn className="w-5 h-5" />
                        <span>Log in</span>
                    </Button>
                </div>

                {/* Footer Links */}
                <div className="flex justify-between flex-wrap items-center mt-6 text-sm">
                    <a href="#" className="text-gray-500 hover:text-firs-dark transition-colors">
                        Forgot password?
                    </a>
                    <div className="text-gray-500">
                        Need an account?
                        <Link to={'/signup'} className="font-semibold text-firs-dark hover:text-firs-dark/80 ml-1" style={{ color: FIRS_BLUE }}>
                            Sign up
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Login;
