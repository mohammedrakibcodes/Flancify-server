const jwt = require("jsonwebtoken");

const createToken = async (req, res) => {
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
        secure: false,
        sameSite: "lax",
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
  res.clearCookie("token").send({
    success: true,
    message: "Logged out",
  });
};

module.exports = {
  createToken,
  logout,
};
