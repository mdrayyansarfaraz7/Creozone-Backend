import jwt from 'jsonwebtoken';
import validator from 'validator';  
import bcrypt from 'bcryptjs';
import user from '../models/user.js';

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
        return res.status(400).json({
          message: 'User has already registered. Please login to your account.',
        });
      }
 
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);

      const newUser = await user.create({ email, username, password: hashedPassword });

      const token = jwt.sign(
        { id: newUser._id, email: newUser.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
  
  
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
  
      const userObj=newUser.toObject();
      delete userObj.password;
      res.status(200).json({ message: 'Signup successful!', user: userObj});
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error. Please try again.' });
    }
  };
  
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

export const logout = (req, res) => {
  console.log('Before logout cookies: ', req.cookies); 
  res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
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
      const currentUser = await user.findById(decoded.id).select('-password');
      if (!currentUser) {
          return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ user: currentUser });
  } catch (err) {
      res.status(403).json({ message: 'Invalid token' });
  }
};