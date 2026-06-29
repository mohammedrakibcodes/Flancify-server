module.exports = (req, res, next) => {
  const tokenEmail = req.user?.email;

  const email =
    req.params.email ||
    req.query.email ||
    req.body?.email ||
    req.body?.client_email ||
    req.body?.freelancer_email;

  if (tokenEmail !== email) {
    return res.status(403).send({
      success: false,
      message: "Forbidden Access",
    });
  }

  next();
};
