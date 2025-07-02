import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import User from '@/models/userModel';
import { sendEmail } from '@/helpers/mailer';

connect();

// Example: POST /api/users/resetpassword
export async function POST(req: NextRequest) {
	try {
		const { email } = await req.json();

		if (!email) {
			return NextResponse.json(
				{ error: 'Invalid email' },
				{ status: 400 },
			);
		}

		console.log('Email : ', email);

		const user = await User.findOne({ email });
		if (!user) {
			return NextResponse.json(
				{ error: 'User not found' },
				{ status: 404 },
			);
		}
		await sendEmail({
			email: email,
			emailType: 'FORGOT_PASSWORD',
			userId: user._id,
		});

		return NextResponse.json({ message: 'Password reset email sent' });
	} catch (error) {
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		);
	}
}
