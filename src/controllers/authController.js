const jwt = require("jsonwebtoken");

const createToken = async (req, res) => {
  console.log("JWT API HIT");
  console.log(req.body);
  try {
    const user = req.body;

    const token = jwt.sign(
      {
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .send({
        success: true,
        token,
      });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

const logout = async (req, res) => {
  res
    .clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    })
    .send({
      success: true,
      message: "Logged out",
    });
};

module.exports = {
  createToken,
  logout,
};
