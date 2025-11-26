# 🚀 Guia de Deploy - GitHub + Vercel

## 📋 Passo a Passo

### 1️⃣ Criar Repositório no GitHub

1. Acesse: **https://github.com/new**
2. **Nome do repositório:** `financial-agent-nextjs`
3. **Descrição:** "Financial management app with Next.js, Clerk, Supabase, and Gemini AI"
4. **Visibilidade:** Private (recomendado para dados financeiros)
5. Clique em **"Create repository"**

### 2️⃣ Inicializar Git Local

Abra o PowerShell na pasta do projeto e rode:

```powershell
cd C:\Users\diego\.gemini\antigravity\scratch\financial_agent\financial-agent-nextjs

# Inicializar git
git init

# Adicionar todos os arquivos
git add .

# Fazer primeiro commit
git commit -m "Initial commit - Financial Agent Next.js"

# Adicionar remote (substitua SEU_USUARIO pelo seu username do GitHub)
git remote add origin https://github.com/SEU_USUARIO/financial-agent-nextjs.git

# Push para GitHub
git branch -M main
git push -u origin main
```

### 3️⃣ Deploy no Vercel

1. Acesse: **https://vercel.com**
2. Faça login com GitHub
3. Clique em **"Add New Project"**
4. Selecione o repositório **financial-agent-nextjs**
5. Clique em **"Import"**

### 4️⃣ Configurar Variáveis de Ambiente no Vercel

Na página de configuração do projeto, vá em **"Environment Variables"** e adicione:

```env
# Gemini AI
GOOGLE_API_KEY=sua_chave_aqui

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_dGVhY2hpbmctYnVubnktOC5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_GtELk3nrC6KMZH6wmi5SJkUrC7nxtwrXpjqF3bJL3I

# Database (Supabase)
DATABASE_URL=postgresql://postgres:+U5%25cQ%23Ui78YUvf@db.zqrekxkvxrltnwzptsbx.supabase.co:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres:+U5%25cQ%23Ui78YUvf@db.zqrekxkvxrltnwzptsbx.supabase.co:5432/postgres
```

**Importante:** Adicione cada variável separadamente!

### 5️⃣ Deploy

1. Clique em **"Deploy"**
2. Aguarde ~2-3 minutos
3. Vercel vai:
   - Instalar dependências
   - Rodar Prisma generate
   - Build do Next.js
   - Deploy automático

### 6️⃣ Configurar Domínio no Clerk

Após o deploy, você receberá uma URL tipo:
```
https://financial-agent-nextjs.vercel.app
```

1. Copie essa URL
2. Vá no **Clerk Dashboard**
3. **Settings → Domains**
4. Adicione o domínio do Vercel
5. Configure as URLs:
   - Production URL: `https://financial-agent-nextjs.vercel.app`
   - Sign-in URL: `https://financial-agent-nextjs.vercel.app/sign-in`
   - Sign-up URL: `https://financial-agent-nextjs.vercel.app/sign-up`

---

## ✅ Pronto!

Seu app estará disponível em:
**https://financial-agent-nextjs.vercel.app**

---

## 🔄 Atualizações Futuras

Sempre que você fizer mudanças:

```powershell
git add .
git commit -m "Descrição da mudança"
git push
```

O Vercel vai fazer **deploy automático**! 🎉

---

## 🆘 Troubleshooting

### Erro: "Build failed"
- Verifique as variáveis de ambiente
- Veja os logs no Vercel

### Erro: "Prisma Client not found"
- Adicione `postinstall` script no package.json:
```json
"scripts": {
  "postinstall": "prisma generate"
}
```

### Erro: "Authentication failed"
- Verifique se adicionou o domínio Vercel no Clerk
- Confirme as variáveis CLERK_* no Vercel

---

**Status:** Pronto para deploy!
