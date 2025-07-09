const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path'); // 🟢 Adicione isso!
const app = express();
const PORT = process.env.PORT || 3000;

// 🟢 Garante caminho absoluto pro data.json no servidor do Render
const FILE = path.join(__dirname, 'data.json');

// 🟢 Cria o data.json se não existir
if (!fs.existsSync(FILE)) {
  fs.writeFileSync(FILE, JSON.stringify({
    pessoas: [],
    tarefasFeitas: [],
    locais: []
  }, null, 2));
}


app.get('/api/tarefas', (req, res) => {
  fs.readFile(FILE, 'utf8', (err, data) => {
    if (err) {
      console.error('Erro ao ler o arquivo:', err); // 🟢 Adicione isso!
      return res.status(500).json({ erro: 'Erro ao ler arquivo' });
    }
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
