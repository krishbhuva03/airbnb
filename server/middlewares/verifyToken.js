import jwt from "jsonwebtoken";
import { createError } from "../error.js";

export const verifyToken = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return next(createError(401, "You are not authenticated!"));
    }
    const token = req.headers.authorization.split(" ")[1];
    if (!token) return next(createError(401, "You are not authenticated!"));
    const decode = jwt.verify(token, process.env.JWT);
    req.user = decode;
    return next();
  } catch (err) {
    next(err);
  }
};

export const verifyAdmin = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return next(createError(403, "You are not authorized to access this resource!"));
    }
    return next();
  } catch (err) {
    next(err);
  }
};

