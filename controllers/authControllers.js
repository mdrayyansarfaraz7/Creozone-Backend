import jwt from 'jsonwebtoken';
import validator from 'validator';  
import bcrypt from 'bcryptjs';
import user from '../models/user.js';

export const signup = async (req, res) => {
    const { username, email, password } = req.body;
    const existingUser = await user.findOne({ email });

    if(!username || !email || !password){
        return res.status(400).json({ 
            message: 'Required field missing!' 
        });
    }

    if (existingUser) {
        return res.status(400).json({ 
            message: 'User has already registered. Please login to your account.' 
        });
    }
    if (!validator.isEmail(email)) {
        return res.status(400).json({ 
            message: 'Invalid email address.' 
        });
    }
    
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUser=await user.create({email,username,password:hashedPassword});

    const token=jwt.sign(
        {id:newUser._id,email:newUser.email},
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    )

    res.cookie('token', token, {
        httpOnly: true,   
        secure: true,     
        sameSite: 'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000  
    });

    res.status(201).json({ message: 'Signup successful!', user: newUser,token });
    }

export const login=async (req,res) => {
    const {email,password}=req.body;
    const existingUser = await user.findOne({ email });
    if(!existingUser){
        return res.status(400).json({ 
            message: 'Email does not exist!' 
        });
    }
    const isCorrectPassword=await bcrypt.compare(password,existingUser.password);
    if(!isCorrectPassword){
      return  res.status(401).json({
            message:'Incorrect Password'
        });
    }
    const token=jwt.sign(
        {id:existingUser._id,email:existingUser.email},
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    )

    res.cookie('token', token, {
        httpOnly: true,   
        secure: true,     
        sameSite: 'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000  
    });
    const userData = existingUser.toObject();
    delete userData.password;
    
    res.status(201).json({ message: 'Welcome Back to Creozone!', user: userData ,token });
} 