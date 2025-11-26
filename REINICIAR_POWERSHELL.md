# ⚠️ Passo Importante - Reiniciar PowerShell

## O Problema

O Node.js foi instalado, mas o PowerShell atual ainda não reconhece o comando `npm`.

## ✅ Solução (Passo a Passo)

### 1. Feche TODAS as janelas do PowerShell/Terminal

Feche todas as janelas abertas do PowerShell, Terminal ou VS Code.

### 2. Abra um NOVO PowerShell

- Pressione `Win + X`
- Clique em "Windows PowerShell" ou "Terminal"

### 3. Navegue até a pasta do projeto

```powershell
cd C:\Users\diego\.gemini\antigravity\scratch\financial_agent\financial-agent-nextjs
```

### 4. Instale as dependências

```powershell
npm install
```

**Aguarde:** Isso vai baixar todas as bibliotecas (2-5 minutos).

### 5. Rode o servidor

```powershell
npm run dev
```

### 6. Acesse no navegador

**http://localhost:3000**

---

## 🆘 Se ainda não funcionar

**Opção 1:** Reinicie o computador

**Opção 2:** Verifique se Node.js foi instalado:
```powershell
node --version
```

Deve mostrar: `v20.x.x` ou similar

---

## ✅ Quando funcionar

Você verá:
- ✅ Mensagem: "Ready in X ms"
- ✅ URL: "http://localhost:3000"
- ✅ Dashboard com gráficos no navegador

Me avise quando conseguir! 🚀
