'use client';

import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function VerifyEmail() {
	const [token, setToken] = useState('');
	const [verified, setVerified] = useState(false);
	const [error, setError] = useState(false);

	const verifyUserEmail = async () => {
		try {
			const response = await axios.post('/api/users/verifyemail', {
				token,
			});
			if (response.data.success) {
				setVerified(true);
			} else {
				setError(true);
			}
		} catch (err: any) {
			console.error(err);
			setError(true);
			console.log(err?.response?.data);
		}
	};

	useEffect(() => {
		const urlToken = window.location.search.split('=')[1];
		setToken(urlToken || '');
	}, [token]);
	useEffect(() => {
		if (token.length > 0) {
			verifyUserEmail();
		}
	}, [token]);

	return (
		<div className="flex flex-col items-center justify-center min-h-screen py-2">
			<h1 className="text-4xl">Verify email</h1>
			<h2 className="p-2 bg-amber-800 text-black">
				{token ? `${token}` : 'No token'}
			</h2>

			{verified && (
				<div className="text-green-500 mt-4">
					<h2>Email verified successfully!</h2>
					<Link href="/login">Login</Link>
				</div>
			)}

			{error && (
				<div className="text-rose-500 mt-4">
					<h2>Error</h2>
				</div>
			)}
		</div>
	);
}
