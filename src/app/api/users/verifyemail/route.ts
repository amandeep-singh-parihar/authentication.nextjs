import { connect } from '@/dbConfig/dbConfig';
import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/userModel';

connect;

// Example: POST /api/users/verifyemail
export async function POST(request: NextRequest) {
	try {
		const reqbody = await request.json();
		const { token } = reqbody;

		console.log('Received token:', token);

		if (!token) {
			return NextResponse.json(
				{ error: 'Token is required.' },
				{ status: 400 },
			);
		}

		// TODO: Verify the token (e.g., check DB, decode JWT, etc.)
		const user = await User.findOne({
			verifyToken: token,
			verifyTokenExpiry: { $gt: Date.now() },
		});

		if (!user) {
			return NextResponse.json(
				{ error: 'Invalid or expired token.' },
				{ status: 400 },
			);
		}
		console.log('User found:', user);

		user.isVerified = true;
		user.verifyToken = undefined;
		user.verifyTokenExpiry = undefined;
		await user.save();

		return NextResponse.json(
			{ message: 'Email verified successfully.', success: true },
			{ status: 200 },
		);
	} catch (error) {
		return NextResponse.json(
			{ error: 'Internal server error.' },
			{ status: 500 },
		);
	}
}
// Note: In a real application, you would need to implement the logic to verify the token,
// such as checking it against a database or decoding a JWT. The above code is a placeholder
