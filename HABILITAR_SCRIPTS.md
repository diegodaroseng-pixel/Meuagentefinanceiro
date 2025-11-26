# 🔓 Habilitar Execução de Scripts no PowerShell

## ⚠️ O Problema

O Windows está bloqueando a execução do npm por segurança.

## ✅ Solução Rápida (2 minutos)

### 1️⃣ Abra PowerShell como Administrador

**Opção A:**
- Pressione `Win + X`
- Clique em **"Windows PowerShell (Admin)"** ou **"Terminal (Admin)"**

**Opção B:**
- Pesquise "PowerShell" no menu Iniciar
- Clique com botão direito
- Escolha **"Executar como administrador"**

### 2️⃣ Rode este comando

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Quando perguntar, digite: **S** (Sim) e pressione Enter

### 3️⃣ Feche o PowerShell Admin

Pode fechar essa janela de administrador.

### 4️⃣ Abra PowerShell NORMAL

Agora abra um PowerShell normal (sem admin).

### 5️⃣ Navegue até o projeto

```powershell
cd C:\Users\diego\.gemini\antigravity\scratch\financial_agent\financial-agent-nextjs
```

### 6️⃣ Instale as dependências

```powershell
npm install
```

**Aguarde:** 2-5 minutos para baixar tudo.

### 7️⃣ Rode o servidor

```powershell
npm run dev
```

### 8️⃣ Acesse

**http://localhost:3000**

---

## ✅ Pronto!

Você deve ver o dashboard com:
- 📊 4 cards de métricas
- 📈 3 gráficos interativos
- 💰 Dados financeiros

---

## 🆘 Se der erro

**Erro: "Port 3000 already in use"**
```powershell
npm run dev -- -p 3001
```
Acesse: http://localhost:3001

**Erro: "Cannot find module"**
```powershell
npm install
```

Me avise quando conseguir! 🚀
