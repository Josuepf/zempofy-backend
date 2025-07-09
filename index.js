const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;
const FILE = 'data.json';

// Criar arquivo se não existir (Render fix
if (!fs.existsSync(FILE)) {
  fs.writeFileSync(FILE, JSON.stringify({
    pessoas: [],
    tarefasFeitas: [],
    locais: []
  }, null, 2));
}

app.use(cors());
app.use(express.json());

app.get('/api/tarefas', (req, res) => {
    fs.readFile(FILE, 'utf8', (err, data) => {
      if (err) return res.status(500).json({ erro: 'Erro ao ler arquivo' });
      res.json(JSON.parse(data));
    });
  });  

  app.post('/api/tarefas', (req, res) => {
    fs.writeFile(FILE, JSON.stringify(req.body, null, 2), err => {
      if (err) return res.status(500).json({ erro: 'Erro ao salvar arquivo' });
      res.json({ sucesso: true });
    });
  });
  
  

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
