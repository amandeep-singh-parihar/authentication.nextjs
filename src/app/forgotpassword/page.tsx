"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios'; 
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function forgotPasswordPage(){
    const router = useRouter()
    const [loading, setLoading] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [token, setToken] = useState('');

    const forgotpassword = async () => {
        try {
            setLoading(true);
            const response = await axios.post('/api/users/forgotpassword', {newPassword,token });
            console.log(response.data);
            setLoading(false);
            toast.success('Password reset successfully');
            router.push('/login');
        } catch (error: any) {
            console.log("Error in reset password", error.message);
            setLoading(false);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const urlToken = window.location.search.split('=')[1];
        setToken(urlToken || '');
        if (urlToken) {
            setToken(urlToken);
        } else {
            toast.error('Invalid token');
        }
    },[])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if( newPassword !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        await forgotpassword();
        localStorage.removeItem('verifyToken');
    };

    return (
        <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded shadow">
            <h1 className="text-2xl font-bold mb-4 text-black">rest your Password</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <input
                        type="password"
                        className="w-full border px-3 py-2 rounded text-black"
                        value={newPassword}
                        placeholder='Enter your password'
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        minLength={6}
                    />
                </div>
                <div>
                    <input
                        type="password"
                        className="w-full border px-3 py-2 rounded text-black"
                        value={confirmPassword}
                        placeholder='Enter your confirm password'
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={6}
                    />
                </div>
                <button
                    onSubmit={handleSubmit}
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    forgot Password
                </button>
            </form>
        </div>
    );
}