import jwt from 'jsonwebtoken';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import user from '../models/user.js';
import nodemailer from 'nodemailer';
import paigam from "paigam";
export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Required field missing!' });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Invalid email address.' });
    }



    const existingUser = await user.findOne({ email });
    if (existingUser) {
      if (!existingUser.isVerified) {
        // If user exists but is not verified, they can try to signup again and we'll send a new OTP
        // Update their password, otp, etc. Or just tell them to verify.
        // Let's just generate a new OTP for the existing unverified user.
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        existingUser.password = hashedPassword;
        existingUser.username = username;
        existingUser.otp = otp;
        existingUser.otpExpires = otpExpires;
        await existingUser.save();

        // Send email
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
          }
        });

        const verifyEmailHTML = paigam.verificationEmailWithCodeV1({
          color: "#e11d48",
          username: existingUser.username,
          verificationCode: otp,
          expirationTime: "10",
          companyName: "Creozone",
          logoUrl: "https://res.cloudinary.com/ddo15zw7d/image/upload/v1780050561/Logo_Icon_1_dh1pqg.png",
        });

        await transporter.sendMail({
          from: process.env.MAIL_USER,
          to: email,
          subject: 'Creozone - Verify your email',
          html: verifyEmailHTML,
        });

        return res.status(200).json({ message: 'OTP sent to email. Please verify.' });
      }

      return res.status(400).json({
        message: 'User has already registered. Please login to your account.',
      });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    const newUser = await user.create({
      email,
      username,
      password: hashedPassword,
      isVerified: false,
      otp,
      otpExpires
    });

    // Send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });

    const verifyEmailHTML = paigam.verificationEmailWithCodeV1({
      color: "#e11d48",
      username: username,
      verificationCode: otp,
      expirationTime: "10",
      companyName: "Creozone",
      logoUrl: "https://res.cloudinary.com/ddo15zw7d/image/upload/v1780050561/Logo_Icon_1_dh1pqg.png",
    });

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: 'Creozone - Verify your email',
      html: verifyEmailHTML,
    });

    res.status(200).json({ message: 'OTP sent to email. Please verify.' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required!' });
    }

    const existingUser = await user.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: 'User not found!' });
    }

    if (existingUser.isVerified) {
      return res.status(400).json({ message: 'User is already verified!' });
    }

    if (existingUser.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP!' });
    }

    if (existingUser.otpExpires < new Date()) {
      return res.status(400).json({ message: 'OTP has expired. Please sign up again to receive a new one.' });
    }

    existingUser.isVerified = true;
    existingUser.otp = undefined;
    existingUser.otpExpires = undefined;
    await existingUser.save();

    const token = jwt.sign(
      { id: existingUser._id, email: existingUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const userObj = existingUser.toObject();
    delete userObj.password;
    res.status(200).json({ message: 'Email verified and signup successful!', user: userObj, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await user.findOne({ email });
  if (!existingUser) {
    return res.status(400).json({
      message: 'Email does not exist!'
    });
  }

  if (!existingUser.isVerified) {
    return res.status(400).json({
      message: 'Please verify your email before logging in. You can try signing up again to receive a new OTP.'
    });
  }

  const isCorrectPassword = await bcrypt.compare(password, existingUser.password);
  if (!isCorrectPassword) {
    return res.status(401).json({
      message: 'Incorrect Password'
    });
  }
  const token = jwt.sign(
    { id: existingUser._id, email: existingUser.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )

  res.cookie('token', token, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  const userData = existingUser.toObject();
  delete userData.password;

  res.status(201).json({ message: 'Welcome Back to Creozone!', user: userData, token });
}

export const logout = (req, res) => {
  console.log('Before logout cookies: ', req.cookies);

  const isProduction = process.env.NODE_ENV === 'production';

  res.clearCookie('token', {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
  });

  console.log('After logout cookies: ', req.cookies);
  res.status(200).json({ message: 'Successfully logged out!' });
};


export const verifyUser = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await user.findById(decoded.id).select('-password').populate('stash').populate('creations');
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    console.log(currentUser);
    res.status(200).json({ user: currentUser });
  } catch (err) {
    res.status(403).json({ message: 'Invalid token' });
  }
};