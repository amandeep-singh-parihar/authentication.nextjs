'use client';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { NextResponse } from 'next/server';
import toast from 'react-hot-toast';

export default function LoginPage() {
	const router = useRouter();

	const [buttonDisabled, setButtonDisabled] = React.useState(false);

	const [loading, setLoading] = React.useState(false);

	const [user, setUser] = React.useState({
		email: '',
		password: '',
	});

	const onLogin = async () => {
		try {
			setLoading(true);
			const response = await axios.post('api/users/login', user);
			console.log('Login success ', response.data);
			toast.success('Login success');
			router.push('/profile');
		} catch (error: any) {
			console.log('Login failed : ', error);
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (user.email.length > 0 && user.password.length > 0) {
			setButtonDisabled(false);
		} else {
			setButtonDisabled(true);
		}
	}, [user]);

	return (
		<div className="flex flex-col items-center justify-center min-h-screen py-2">
			<h1>Login</h1>
			<hr />

			<label htmlFor="email">email</label>
			<input
				className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
				type="text"
				id="email"
				value={user.email}
				onChange={(e) => setUser({ ...user, email: e.target.value })}
				placeholder="email"
			/>

			<label htmlFor="password">password</label>
			<input
				className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
				type="password"
				id="password"
				value={user.password}
				onChange={(e) => setUser({ ...user, password: e.target.value })}
				placeholder="password"
			/>

			<button
				onClick={onLogin}
				className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 bg-white text-black font-black"
			>
				Signup
			</button>
			<Link href="/signup">Visit Signup page</Link>
		</div>
	);
}
