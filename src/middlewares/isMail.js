module.exports = (req, res, next) => {
  const { email } = req.body;
  const valEmail = /\S+@\S+\.\S+/;

  if (!email) {
    return res.status(400).json({
      message: 'O campo "email" é obrigatório',
    });
  }

  if (!valEmail.test(email)) {
    return res.status(400).json({
      message: 'O "email" deve ter o formato "email@email.com"',
    });
  }
  return next();
};