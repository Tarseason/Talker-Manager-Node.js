const express = require('express');
const fs = require('fs').promises;
const path = require('path');

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

app.listen(PORT, () => {
  console.log('Online');
});
