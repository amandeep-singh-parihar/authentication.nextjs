import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import User from '@/models/userModel';
import bcrypt from 'bcryptjs';

connect();

export async function POST(request: NextRequest) {
	try {
		const { newPassword, token } = await request.json();
		if (!newPassword || !token) {
			return NextResponse.json(
				{ error: 'New password and token are required.' },
				{ status: 400 },
			);
		}
		console.log('Received token:', token);

		const user = await User.findOne({
			forgotPasswordToken: token,
			forgotPasswordTokenExpiry: { $gt: Date.now() },
		});
		if (!user) {
			return NextResponse.json(
				{ error: 'Invalid or expired token.' },
				{ status: 400 },
			);
		}

		// hash the new password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(newPassword, salt);

		// update the user
		user.password = hashedPassword;
		user.forgotPasswordToken = undefined;
		user.forgotPasswordTokenExpiry = undefined;
		await user.save();

		return NextResponse.json({
			message: 'Password has been reset successfully.',
			success: true,
		});
	} catch (error: any) {
		console.error('Error in forgot password route:', error.message);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		);
	}
}
