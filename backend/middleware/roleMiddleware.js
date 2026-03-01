// backend/middleware/roleMiddleware.js

// Check if user is admin
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin only.' });
  }
};

// Check if user is technician
export const technician = (req, res, next) => {
  if (req.user && req.user.role === 'technician') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Technician only.' });
  }
};

// Check if user is admin or technician
export const adminOrTechnician = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'technician')) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin or technician only.' });
  }
};

// Check if user is the owner or admin
export const ownerOrAdmin = (model) => async (req, res, next) => {
  try {
    if (req.user.role === 'admin') {
      return next();
    }
    
    const resource = await model.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    if (resource.userId && resource.userId.toString() === req.user.id) {
      return next();
    }
    
    res.status(403).json({ message: 'Access denied. Not authorized.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};