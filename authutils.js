const jwt = require("jsonwebtoken");

/**
 * validateToken middleware:
 * - Accepts both `req.headers.authorization` and `req.header('authorization')` forms
 * - On missing/invalid token -> 400 + { message: "Authentication failed" }
 * - On valid token -> call next()
 */
const validateToken = (req, res, next) => {
  try {
    // Try both places (headers object or header() accessor)
    const headerFromHeaders = req.headers && req.headers.authorization;
    const headerFromFn = typeof req.header === "function" ? req.header("authorization") : undefined;
    const header = headerFromHeaders || headerFromFn || "";

    const token = header.startsWith("Bearer ") ? header.slice(7) : header;

    if (!token) {
      return res.status(400).json({ message: "Authentication failed" });
    }

    const secret = process.env.JWT_SECRET || "TEST_SECRET";

    try {
      jwt.verify(token, secret);
    } catch {
      return res.status(400).json({ message: "Authentication failed" });
    }

    next();
  } catch {
    return res.status(400).json({ message: "Authentication failed" });
  }
};

module.exports = { validateToken };
