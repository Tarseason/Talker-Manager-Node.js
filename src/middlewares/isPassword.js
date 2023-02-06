module.exports = (req, res, next) => {
  const { password } = req.body;

  if (!password || password <= 0) {
    return res.status(400).send({ message: 'O campo "password" é obrigatório' });
  }

  if (password.length >= 1 || password.length < 6) {
    return res.status(400).send({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  }

  next();
};