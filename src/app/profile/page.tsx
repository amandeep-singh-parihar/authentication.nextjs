'use client';

import axios from 'axios';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ProfilePage() {
	const router = useRouter();

	const [data, setData] = useState('NoDATA');

	const logout = async () => {
		try {
			await axios.get('/api/users/logout');
			toast.success('Logout successfull');
			router.push('/login');
		} catch (error: any) {
			console.log(error.message);
			toast.error(error.message);
		}
	};

	const getUserDetails = async () => {
		const res = await axios.get('/api/users/me');
		console.log(res.data);
		setData(res.data.data._id);
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen py-2">
			<h1>Profile</h1>
			<hr />
			<p>Profile page</p>
			<h2 className='text-white '>{data ==="NoDATA" ? "NoDATA" : <Link href={`profile/${data}`}>{data}</Link>}</h2>
			<hr />

			<button
				onClick={logout}
				className="bg-blue-700 text-2xl rounded-lg p-1 px-2"
			>
				Logout
			</button>

			<button
				onClick={getUserDetails}
				className="bg-purple-700 text-2xl rounded-lg p-1 px-2"
			>
				Get User Details
			</button>
		</div>
	);
}
