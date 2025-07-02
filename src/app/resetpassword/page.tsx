'use client';
import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function ResetPasswordPage() {
	const [email, setEmail] = useState('');

	const [loading, setLoading] = useState(false);

	const onRest = async () => {
		try {
			setLoading(true);
			const response = await axios.post(
				'/api/users/resetpassword',
				{email},
			);
            console.log(response.data);
            setLoading(false);
            toast.success('Password reset link sent to your email');
		} catch (error:any) {
            console.log("Error in reset password", error.message);
            setLoading(false);
            toast.error(error.message);
        }finally {
            setLoading(false);
        }
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
        await onRest();
	};

	return (
		<div className="max-w-md mx-auto mt-16 p-6 bg-white rounded shadow">
			<h1 className="text-2xl font-bold mb-4 text-black">
				Reset Password
			</h1>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label className="block mb-1 font-medium text-black">
						Enter your email
					</label>
					<input
						type="email"
						className="w-full border px-3 py-2 rounded text-black"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						minLength={6}
					/>
				</div>
				<button
					type="submit"
					className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
				>
					Reset Password
				</button>
			</form>
		</div>
	);
}
