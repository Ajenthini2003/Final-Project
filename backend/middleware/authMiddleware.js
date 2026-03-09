import jwt from 'jsonwebtoken';
import User from '../models/User.js';

 //like security guard. It checks if the request has a valid token before allowing access to protected routes.
export const protect = async (req, res, next) => {     
  let token;   //store token
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'can_not_say');
      
      // Get user from token 
      const user = await User.findById(decoded.id).select('-password');
      

      //if token invalid
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }
      
      req.user = {
        id: user._id,
        role: user.role,
        name: user.name,
        email: user.email
      };
      
      next();
    } catch (error) {
      console.error("Auth error:", error.message);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// ADD THIS - admin middleware
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as admin' });
  }
};

// Remove the development bypass code for security



// Q1: What is the purpose of authMiddleware?
// A: To protect routes by verifying JWT tokens before allowing access

// Q2: Why check Authorization header and 'Bearer'?
// A: It's the standard format for sending tokens in HTTP requests

// Q3: What happens if token is expired?
// A: jwt.verify() throws error, catch block sends 401

// Q4: Why attach user to req object?
// A: So route handlers can access user data without querying DB again

// Q5: What's the difference between 401 and 403?
// A: 401 = Unauthorized (no token/invalid), 403 = Forbidden (wrong role)

// Q6: Why use .select('-password')?
// A: Security - never send password anywhere, even in backend

// Q7: What if token is valid but user doesn't exist?
// A: Send "User not found" error (user might have been deleted)

// Q8: Why same error message for all token failures?
// A: Security - don't give hints to hackers about why it failed


// இந்த file ஏன் தேவையென்றால் — இது உங்கள் backend-இன் security control center மாதிரி வேலை செய்கிறது.

// இந்த file இல்லாமல் இருந்தால், யாரும் login செய்யாமல் கூட உங்கள் protected API routes-ஐ access செய்ய முடியும். அதனால் user யார் என்று verify செய்யவும், அவருக்கு அந்த route access செய்ய permission இருக்கிறதா என்று check செய்யவும் இந்த file பயன்படுத்தப்படுகிறது.

// இந்த file இரண்டு முக்கிய வேலை செய்கிறது:

// 1️⃣ Authentication –
// User அனுப்பும் JWT token valid ஆ இருக்கிறதா என்று check செய்கிறது. Token verify பண்ணி, அந்த user database-ல இருக்கிறாரா என்று பார்த்து, சரியான user என்றால் மட்டும் அடுத்த route-க்கு அனுமதி தருகிறது.

// 2️⃣ Authorization –
// User login செய்திருந்தாலும், எல்லா routes-ஐயும் access செய்ய முடியாது. உதாரணமாக admin மட்டும் access செய்ய வேண்டிய routes இருக்கலாம். அதற்காக admin middleware user role-ஐ check செய்து, admin அல்லாதவர்களுக்கு 403 Forbidden error அனுப்புகிறது.

// சிம்பிளா சொல்லணும்னா 👇

// இந்த file இல்லையென்றால்:

// யாரும் data access பண்ணலாம்

// Hacker கள் API-ஐ misuse பண்ணலாம்

// Sensitive data leak ஆகலாம்

// இந்த file இருந்தால்:

// Login செய்த user மட்டும் access

// Role based access control

// Application secure ஆக இருக்கும்

// அதனால் தான் இந்த file backend-ல் மிகவும் முக்கியமானது 🔐