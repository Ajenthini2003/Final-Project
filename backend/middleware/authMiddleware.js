import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {      //like security guard. It checks if the request has a valid token before allowing access to protected routes.
  let token;
  
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