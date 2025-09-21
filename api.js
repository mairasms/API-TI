// Importa o Express
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const caminhoDados = path.join(process.cwd(), 'data', 'termos.json');

// Função para carregar termos
function carregarTermos() {
  try {
    if (!fs.existsSync(caminhoDados)) {
      console.error('Arquivo termos.json não encontrado!');
      return [];
    }
    
    const dados = fs.readFileSync(caminhoDados, 'utf8');
    if (!dados.trim()) return [];
    
    const parsed = JSON.parse(dados);
    return parsed.termos || [];
    
  } catch (erro) {
    console.error('Erro ao carregar termos:', erro.message);
    return [];
  }
}

// Rota para listar todos os termos (apenas resumo)
app.get('/termos', (req, res) => {
  const termos = carregarTermos();
  const resumo = termos.map(termo => ({
    word: termo.word,
    category: termo.category,
    definition: termo.meanings[0]?.definition || 'Definição não disponível'
  }));
  res.json(resumo);
});

// Rota para buscar termo por nome
app.get('/buscar/:termo', (req, res) => {
  const termos = carregarTermos();
  const termoBuscado = req.params.termo.toLowerCase();
  
  const resultado = termos.filter(t => 
    t.word.toLowerCase().includes(termoBuscado) ||
    t.category.toLowerCase().includes(termoBuscado) ||
    t.meanings[0]?.definition.toLowerCase().includes(termoBuscado)
  );
  
  if (resultado.length === 0) {
    return res.status(404).json({ erro: "Nenhum termo encontrado" });
  }
  
  // Retorna só informações básicas na busca
  const resumo = resultado.map(termo => ({
    word: termo.word,
    category: termo.category,
    definition: termo.meanings[0]?.definition || 'Definição não disponível'
  }));
  
  res.json(resumo);
});

// Rota para retornar detalhes COMPLETOS de um termo específico
app.get('/termo/:palavra', (req, res) => {
  const termos = carregarTermos();
  const palavra = req.params.palavra.toLowerCase();
  
  const termo = termos.find(t => t.word.toLowerCase() === palavra);
  
  if (!termo) {
    return res.status(404).json({ erro: "Termo não encontrado" });
  }
  
  // Retorna TODAS as informações (incluindo história)
  res.json(termo);
});

// Rota de saúde da API
app.get('/status', (req, res) => {
  const termos = carregarTermos();
  res.json({ 
    status: 'online', 
    totalTermos: termos.length,
    versao: '1.0.1'
  });
});
// Rota raiz
app.get('/', (req, res) => {
  res.json({ 
    mensagem: 'Bem-vindo à API de Termos de TI!',
    endpoints: {
      status: '/status',
      todosTermos: '/termos', 
      buscar: '/buscar/:termo',
      detalhes: '/termo/:palavra'
    },
    repositorio: 'https://github.com/mairasms/API-TI'
  });
});
// Inicializa o servidor
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));