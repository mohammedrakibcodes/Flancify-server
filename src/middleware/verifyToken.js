const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  console.log("Cookies:", req.cookies);

  const token = req.cookies?.token;

  console.log("Token:", token);

  if (!token) {
    return res.status(401).send({
      success: false,
      message: "Unauthorized Access",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
    if (error) {
      console.log("JWT Error:", error.message);

      return res.status(403).send({
        success: false,
        message: "Invalid or expired token",
      });
    }

    console.log("Decoded User:", decoded);

    req.user = decoded;

    next();
  });
};

module.exports = verifyToken;
