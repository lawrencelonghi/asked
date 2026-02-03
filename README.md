# 🎮 Asked - Multiplayer Real-Time Game

Um jogo multiplayer em tempo real onde jogadores escolhem números secretos e respondem perguntas criativas para descobrir as escolhas dos outros.

## 🚀 Tecnologias

### Backend
- **Node.js** + **Express** - Servidor HTTP
- **Socket.io** - Comunicação real-time via WebSockets
- **TypeScript** - Tipagem estática

### Frontend
- **Next.js 15** - React framework
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Socket.io Client** - Conexão WebSocket

## 📦 Instalação

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Setup
```bash
# Clone o repositório
git clone https://github.com/seu-usuario/asked.git
cd asked

# Instale as dependências do servidor
cd server
npm install
cp .env.example .env

# Instale as dependências do cliente
cd ../client
npm install
cp .env.example .env

# Volte para a raiz
cd ..
```

## 🎯 Configuração

### Server (.env)
```env
PORT=3001
NODE_ENV=development
```

### Client (.env)
```env
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

## 🚀 Executar

### Desenvolvimento
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

Acesse:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

### Produção
```bash
# Build
cd server && npm run build
cd ../client && npm run build

# Start
cd server && npm start
cd ../client && npm start
```

## 🎮 Como Jogar

1. **Criar Sala** - Host cria uma sala para até 5 jogadores
2. **Escolher Número** - 4 jogares combinam secretamente um número de 0 a 10 (ex. 1)
3. **Perguntas** - O jogador que não participou da escolha do numero faz uma pergunta para cada um dos outros 4 jogadores (ex. 'uma comida')
4. **Adivinhar** - Outros respondem baseado no número escolhido (ex. 'uma comida ruim' pois a nota é 1)
5. **Revelar** - Números e respostas são revelados simultaneamente
6. **Pontuar** - Sistema de pontuação baseado nas combinações

## 📁 Estrutura do Projeto
```
asked/
├── client/              # Frontend Next.js
│   ├── app/            # App Router
│   ├── components/     # Componentes React
│   └── lib/            # Utilitários
│
└── server/             # Backend Express
    └── src/            # Código TypeScript
        └── server.ts   # Entry point
```

## 🛠️ Scripts Disponíveis

### Server
```bash
npm run dev      # Desenvolvimento com hot reload
npm run build    # Build para produção
npm start        # Executar versão de produção
```

### Client
```bash
npm run dev      # Desenvolvimento
npm run build    # Build para produção
npm start        # Executar build de produção
npm run lint     # Executar ESLint
```


## 🤝 Contribua

Contribuições são bem-vindas! Sinta-se livre para abrir issues ou pull requests.


## 👤 Autor

Lawrence Longhi

**Seu Nome**
- GitHub: [@lawrencelonghi](https://github.com/lawrencelonghi)
- LinkedIn: [Lawrence Longhi](https://linkedin.com/in/lawrence-longhi)

---

⭐ Se você gostou deste projeto, considere dar uma estrela e... Vamos jogar!