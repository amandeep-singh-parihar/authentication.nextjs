import { connect } from '@/dbConfig/dbConfig';
import User from '@/models/userModel';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

connect();

export async function POST(request: NextRequest) {
	try {
		const reqBody = await request.json();
		const { email, password } = reqBody;

		console.log(reqBody);

		const user = await User.findOne({ email });
		if (!user) {
			return NextResponse.json(
				{ error: 'User does not exist' },
				{ status: 400 },
			);
		}

		const isValidPassword = await bcrypt.compare(password, user.password);

		if (!isValidPassword) {
			return NextResponse.json(
				{ error: 'Invalid password' },
				{ status: 400 },
			);
		}

		// create token data
		const tokenData = {
			id: user._id,
			username: user.username,
			email: user.email,
		};
		const token = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY!, {
			expiresIn: '1d',
		});

		const response = NextResponse.json({
			message: 'Login successful',
			success: true,
		});

		response.cookies.set('token', token, {
			httpOnly: true,
		});

		return response;
	} catch (error: any) {
		return NextResponse.json(
			{
				error: error.message,
			},
			{ status: 500 },
		);
	}
}
