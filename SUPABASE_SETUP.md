# 🗄️ Guia de Configuração - Supabase PostgreSQL

## 📋 Passo a Passo

### 1️⃣ Criar Conta no Supabase

1. Acesse: **https://supabase.com**
2. Clique em **"Start your project"**
3. Faça login com GitHub
4. Clique em **"New Project"**

### 2️⃣ Configurar Projeto

**Informações do Projeto:**
- **Name:** financial-agent
- **Database Password:** Crie uma senha forte (anote!)
- **Region:** South America (São Paulo) - mais próximo
- **Pricing Plan:** Free

Clique em **"Create new project"**

⏱️ Aguarde ~2 minutos para o projeto ser criado.

### 3️⃣ Pegar a Connection String

1. No painel do Supabase, vá em **"Settings"** (⚙️)
2. Clique em **"Database"**
3. Role até **"Connection string"**
4. Copie a **"Connection pooling"** (Transaction mode)
5. Substitua `[YOUR-PASSWORD]` pela senha que você criou

Exemplo:
```
postgresql://postgres.xxx:[YOUR-PASSWORD]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
```

### 4️⃣ Adicionar ao .env.local

Abra `.env.local` e adicione:

```env
# Database
DATABASE_URL="postgresql://postgres.xxx:SUA_SENHA@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.xxx:SUA_SENHA@aws-0-sa-east-1.pooler.supabase.com:5432/postgres"
```

**Importante:**
- `DATABASE_URL` - Para queries (porta 6543 com pgbouncer)
- `DIRECT_URL` - Para migrations (porta 5432 direta)

---

## 🔄 Próximos Passos (Automáticos)

Após configurar o Supabase, eu vou:

1. ✅ Inicializar Prisma
2. ✅ Criar schema do banco
3. ✅ Rodar migrations
4. ✅ Migrar dados do SQLite
5. ✅ Atualizar todas as APIs

---

## 📊 Limites do Tier Gratuito

- ✅ **500 MB** de banco de dados
- ✅ **2 GB** de bandwidth/mês
- ✅ **50 MB** de storage
- ✅ **Backups automáticos** (7 dias)
- ✅ **SSL** incluído

Para uso pessoal, é perfeito!

---

## 🆘 Troubleshooting

### Erro: "Connection timeout"
- Verifique se copiou a string completa
- Confirme que substituiu `[YOUR-PASSWORD]`

### Erro: "SSL required"
- Adicione `?sslmode=require` no final da URL

### Projeto não aparece
- Aguarde 2-3 minutos após criação
- Recarregue a página

---

**Status:** Aguardando criação do projeto Supabase e connection string
