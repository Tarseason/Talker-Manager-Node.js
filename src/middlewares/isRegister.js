const authorizationF = (req, res, next) => {
  const token = req.header('authorization');
  if (!token) {
    return res.status(401).json({ message: 'Token não encontrado' });
  }

  if (token.length !== 16) {
    return res.status(401).json({ message: 'Token inválido' });
  }

  next();
};

const isName = (req, res, next) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'O campo "name" é obrigatório' });
  }

  if (name.length < 3) {
    return res.status(400).json({
      message: 'O "name" deve ter pelo menos 3 caracteres',
    });
  }

  next();
};

const isAge = (req, res, next) => {
  if (!req.body.age) {
    return res.status(400).json({ message: 'O campo "age" é obrigatório' });
  }
  if (typeof req.body.age !== 'number') {
    return res.status(400).json({ message: 'O campo "age" deve ser do tipo "number"' }); 
  }
  if (!Number.isInteger(req.body.age)) { 
    return res.status(400).json({ message: 'O campo "age" deve ser um "number" do tipo inteiro' });
  }
  if (req.body.age < 18) {
    return res.status(400).json({ message: 'A pessoa palestrante deve ser maior de idade' });
  }
  next();
};

const isTalkWatch = (req, res, next) => {
  if (!req.body.talk) {
    return res.status(400).json({ message: 'O campo "talk" é obrigatório' });
  }
  if (!req.body.talk.watchedAt) {
    return res.status(400).json({ message: 'O campo "watchedAt" é obrigatório' });
  }

  const dataFormat = /^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/;
  const resultTestDataFormat = dataFormat.test(req.body.talk.watchedAt);
  if (!resultTestDataFormat) {
    return res.status(400).json({
      message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"',
    });
  }

  next();
};

const isTalkRate = (req, res, next) => {
  if (req.body.talk.rate === undefined) {
    return res.status(400).json({ message: 'O campo "rate" é obrigatório' });
  }

  if (req.body.talk.rate > 5 || req.body.talk.rate < 1 || !Number.isInteger(req.body.talk.rate)) {
    return res.status(400).json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
  }

  next();
};

module.exports = {
  authorizationF,
  isName,
  isAge,
  isTalkWatch,
  isTalkRate,
};
