const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const isMail = require('./middlewares/isMail');
const isPassword = require('./middlewares/isPassword');
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

app.listen(PORT, () => {
  console.log('Online');
});
