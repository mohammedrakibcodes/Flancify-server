const verifyRole = (...roles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!roles.includes(userRole)) {
      return res.status(403).send({
        success: false,
        message: "Role Forbidden",
      });
    }

    next();
  };
};

module.exports = verifyRole;
