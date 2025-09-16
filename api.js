// Importa o Express
import express from 'express';

const app = express();
const PORT = 3000;

// Permite receber JSON no body
app.use(express.json());

// Base de dados mock (você pode substituir por JSON externo ou banco depois)
const termos = [
  {
    id: 1,
    termo: "API",
    basico: "Interface que permite comunicação entre sistemas.",
    historia: "O conceito de API existe desde os primeiros sistemas operacionais, mas ganhou força com a web e REST.",
  },
  {
    id: 2,
    termo: "REST",
    basico: "Estilo arquitetural para comunicação entre sistemas usando HTTP.",
    historia: "Definido por Roy Fielding em 2000 em sua tese, é amplamente utilizado em APIs modernas.",
  },
];

// Rota para listar todos os termos (apenas resumo)
app.get('/termos', (req, res) => {
  // Retorna só as informações básicas
  const resumo = termos.map(({ id, termo, basico }) => ({ id, termo, basico }));
  res.json(resumo);
});

// Rota para retornar detalhes de um termo específico
app.get('/termos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const termo = termos.find(t => t.id === id);
  if (!termo) {
    return res.status(404).json({ erro: "Termo não encontrado" });
  }
  res.json(termo); // retorna tudo (incluindo história)
});

// Inicializa o servidor
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
