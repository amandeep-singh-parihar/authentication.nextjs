import nodemailer from 'nodemailer';
import User from '@/models/userModel';
import bcrypt from 'bcryptjs';

export const sendEmail = async ({ email, emailType, userId }: any) => {
	try {
		// create a hash token
		const hashedToken = await bcrypt.hash(userId.toString(), 10);

		if (emailType === 'VERIFY') {
			await User.findByIdAndUpdate(userId, {
				verifyToken: hashedToken,
				verifyTokenExpiry: Date.now() + 3600000,
			});
		} else if (emailType === 'FORGOT_PASSWORD') {
			await User.findByIdAndUpdate(userId, {
				forgotPasswordToken: hashedToken,
				forgotPasswordTokenExpiry: Date.now() + 3600000,
			});
		}

		// Looking to send emails in production? Check out our Email API/SMTP product!
		var transport = nodemailer.createTransport({
			host: 'sandbox.smtp.mailtrap.io',
			port: 2525,
			auth: {
				user: '078393b817e585',
				pass: 'db4e18c6e166a3',
				// add these in the .env file
			},
		});

		const link =
			emailType === 'VERIFY'
				? `${process.env.DOMAIN}/verifyemail?token=${hashedToken}`
				: `${process.env.DOMAIN}/forgotpassword?token=${hashedToken}`;

		const mailOptions = {
			from: 'pisn604@gmail.com',
			to: email,
			subject:
				emailType === 'VERIFY'
					? 'Verify your email'
					: 'Reset your Password',
			html: `<p>Click <a href="${link}"> here </a> to ${emailType === 'VERIFY' ? 'verify your email' : 'reset your password'}</p>`,
		};

		const mailResponse = await transport.sendMail(mailOptions);
		console.log('Mail response:', mailResponse);
		return mailResponse;
	} catch (error: any) {
		throw new Error(error.message);
	}
};
