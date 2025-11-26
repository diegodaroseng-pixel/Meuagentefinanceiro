# 🚀 Guia de Instalação - Financial Agent Next.js

## Pré-requisitos

Certifique-se de ter instalado:
- **Node.js 18+** (baixe em: https://nodejs.org/)
- **npm** (vem com Node.js)

## Passo a Passo

### 1. Navegue até a pasta do projeto

```bash
cd C:\Users\diego\.gemini\antigravity\scratch\financial_agent\financial-agent-nextjs
```

### 2. Instale as dependências

```bash
npm install
```

Isso vai instalar:
- Next.js
- React
- TypeScript
- Tailwind CSS
- Recharts (gráficos)
- Lucide React (ícones)
- SQLite3

### 3. Rode o servidor de desenvolvimento

```bash
npm run dev
```

### 4. Abra no navegador

Acesse: **http://localhost:3000**

## 🎯 O que você vai ver

✅ **Dashboard com 4 métricas principais:**
- Total Gasto
- Número de Transações
- Ticket Médio
- Gastos Essenciais

✅ **3 Gráficos interativos:**
- Gastos por Categoria (Pizza)
- Classificação Comportamental (Barras)
- Evolução Mensal (Linha)

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Rodar produção
npm start

# Lint
npm run lint
```

## ⚠️ Troubleshooting

**Erro: "Cannot find module 'sqlite3'"**
- Rode: `npm install sqlite3`

**Erro: "Port 3000 already in use"**
- Rode em outra porta: `npm run dev -- -p 3001`

**Erro ao conectar no banco de dados**
- Verifique se `financial_db.sqlite` existe na pasta pai

## 📊 Próximos Passos

Após testar o dashboard, podemos implementar:
1. Interface de Upload
2. Processamento com IA
3. Tabelas editáveis
4. Previsões e recorrências

## 🆘 Precisa de Ajuda?

Se tiver qualquer erro, me avise que eu ajudo a resolver!
