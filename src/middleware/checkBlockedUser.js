const { usersCollection } = require("../db/collections");

const checkBlockedUser = async (req, res, next) => {
  try {
    const email = req.user?.email;

    const user = await usersCollection.findOne({
      email,
    });

    if (user?.isBlocked) {
      return res.status(403).send({
        success: false,
        message: "Your account has been blocked",
      });
    }

    next();
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

module.exports = checkBlockedUser;
