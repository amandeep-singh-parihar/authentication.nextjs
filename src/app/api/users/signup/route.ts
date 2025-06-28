import { connect } from '@/dbConfig/dbConfig';
import User from '@/models/userModel';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

connect();

export default async function POST(request: NextRequest) {
    try {
		const reqBody = await request.json();
		const { username, email, password } = reqBody;

		if (!username || !email || !password) {
			return NextResponse.json({
				message: 'All fields are required',
				status: 400,
			});
		}

		console.log(reqBody);

		// check if user exists
        const user = await User.findOne({email})

        if(user){
            return NextResponse.json({
                error:"User already exists",
            })
        }

        // hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        const newUser = new User({
            username,
            email,
            passowrd:hashedPassword
        })

        const savedUser = await newUser.save()
        console.log(savedUser);

	} catch (error: any) {
		return NextResponse.json({
			error: error.message,
            success:true
		});
	}
}
