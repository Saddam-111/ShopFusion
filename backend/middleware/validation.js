import mongoose from 'mongoose';

export const validateBody = (allowedFields) => {
  return (req, res, next) => {
    const bodyFields = Object.keys(req.body);
    const extraFields = bodyFields.filter(field => !allowedFields.includes(field));
    
    if (extraFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid fields: ${extraFields.join(', ')}`
      });
    }
    next();
  };
};

export const sanitizeInput = (req, res, next) => {
  const sanitize = (obj) => {
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = obj[key].trim();
        if (obj[key].length > 10000) {
          obj[key] = obj[key].substring(0, 10000);
        }
      } else if (typeof obj[key] === 'object') {
        sanitize(obj[key]);
      }
    }
  };
  
  if (req.body) sanitize(req.body);
  if (req.query) sanitize(req.query);
  if (req.params) sanitize(req.params);
  next();
};

export const validateObjectId = (paramName) => {
  return (req, res, next) => {
    const id = req.params[paramName];

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format"
      });
    }
    next();
  };
};