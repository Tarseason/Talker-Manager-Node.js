const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const isMail = require('./middlewares/isMail');
const isPassword = require('./middlewares/isPassword');
const isRegister = require('./middlewares/isRegister');
const getToken = require('./utils/getToken');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

const talkersPath = path.resolve(__dirname, './talker.json');

const readFile = async () => {
  try {
    const data = await fs.readFile(talkersPath);
    return JSON.parse(data);
  } catch (err) {
    console.error(`Arquivo nao pode ser lido meu ${err}`);
  }
};

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker/search', isRegister.authorizationF, async (req, res) => {
  const result = await readFile();
  const { q } = req.query;

  if (!q) {
    return res.status(200).json(result);
  }

  const talkersSearch = result.some((talk) => talk.name.toLowerCase()
    .includes(q.toLowerCase()));

  if (!talkersSearch) {
    return res.status(200).json([]);
  }

  const search = result.filter((talk) => talk.name.toLowerCase()
    .includes(q.toLowerCase()));

  res.status(200).json(search);
});

app.get('/talker', async (req, res) => {
  const talkers = await readFile();
    return res.status(200).json(talkers);
});

app.get('/talker/:id', async (req, res) => {
  const talkers = await readFile();
  const talker = talkers.find((talk) => talk.id === +req.params.id);
  if (!talker) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
  res.status(200).json(talker);
});

app.post('/login',
  isMail,
  isPassword,
  async (req, res) => { 
  const token = getToken();
  res.status(200).json({ token });
});

app.post('/talker',
  isRegister.authorizationF,
  isRegister.isName,
  isRegister.isAge,
  isRegister.isTalkWatch,
  isRegister.isTalkRate,
  async (req, res) => {
  const { name, age } = req.body;
  const { watchedAt, rate } = req.body.talk;
  const talkers = await readFile();
  const newTalker = {
    name,
    age,
    id: talkers[talkers.length - 1].id + 1,
    talk: {
      watchedAt,
      rate,
    },
  };
  const allTalkers = JSON.stringify([...talkers, newTalker]);
  await fs.writeFile(talkersPath, allTalkers);
  res.status(201).json(newTalker);
});

app.put('/talker/:id', 
isRegister.authorizationF,
isRegister.isName,
isRegister.isAge,
isRegister.isTalkWatch,
isRegister.isTalkRate,
 async (req, res) => {
  const { id } = req.params;
  const { name, age } = req.body;
  const { watchedAt, rate } = req.body.talk;

  const talkers = await readFile(); 

  let talkEdit = talkers.find((talk) => talk.id === +id);
  const newTalkers = talkers.filter((element) => element.id !== talkEdit.id);
  talkEdit = { id: +id, name, age, talk: { watchedAt, rate } };
  const updateTalkers = JSON.stringify([...newTalkers, talkEdit]);
  await fs.writeFile(talkersPath, updateTalkers);

  res.status(200).json(talkEdit);
});

app.delete('/talker/:id', isRegister.authorizationF, async (req, res) => {
  const { id } = req.params;
  const talkers = await readFile();
  const newTalkers = talkers.filter((talk) => talk.id !== +id);
  const talkersNow = JSON.stringify(newTalkers);
  await fs.writeFile(talkersPath, talkersNow);
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log('Online');
});
