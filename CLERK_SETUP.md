# 🔐 Guia de Configuração - Clerk Authentication

## 📋 Passo a Passo

### 1️⃣ Criar Conta no Clerk

1. Acesse: **https://clerk.com**
2. Clique em **"Start Building for Free"**
3. Faça login com Google ou GitHub
4. Crie uma nova aplicação:
   - Nome: **Financial Agent**
   - Tipo: **Next.js**

### 2️⃣ Pegar as Chaves de API

Após criar a aplicação, você verá uma tela com as chaves:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### 3️⃣ Configurar .env.local

1. Abra o arquivo `.env.local` (se não existir, crie)
2. Cole as chaves do Clerk:

```env
GOOGLE_API_KEY=sua_chave_gemini_aqui

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_cole_aqui
CLERK_SECRET_KEY=sk_test_cole_aqui
```

### 4️⃣ Configurar URLs no Clerk Dashboard

No painel do Clerk:

1. Vá em **"Configure" → "Paths"**
2. Configure:
   - **Sign-in URL:** `/sign-in`
   - **Sign-up URL:** `/sign-up`
   - **After sign-in:** `/`
   - **After sign-up:** `/`

### 5️⃣ Testar Localmente

1. Salve o `.env.local`
2. Reinicie o servidor:
   ```bash
   npm run dev
   ```
3. Acesse: **http://localhost:3000**
4. Clique em **"Login"**
5. Crie uma conta de teste

---

## ✅ O que foi implementado

### Arquivos Criados/Modificados:

**1. `middleware.ts`** - Protege todas as rotas
```typescript
// Apenas /sign-in e /sign-up são públicas
// Todas as outras rotas exigem login
```

**2. `app/layout.tsx`** - ClerkProvider
```typescript
// Envolve toda a aplicação com autenticação
```

**3. `components/Navigation.tsx`** - Botões de Login/Logout
```typescript
// Mostra "Login" se deslogado
// Mostra avatar do usuário se logado
```

---

## 🎨 Features do Clerk

✅ **Login Social:**
- Google
- GitHub
- Microsoft
- Apple

✅ **Login com Email:**
- Email + Senha
- Magic Links (sem senha)
- Códigos de verificação

✅ **Segurança:**
- 2FA (autenticação de dois fatores)
- Detecção de bots
- Rate limiting

✅ **UI Pronta:**
- Modais de login/signup
- Perfil do usuário
- Gerenciamento de sessões

---

## 🧪 Testando

### Cenário 1: Usuário Deslogado
1. Acesse http://localhost:3000
2. Será redirecionado para login
3. Crie uma conta
4. Será redirecionado para o Dashboard

### Cenário 2: Usuário Logado
1. Veja o avatar no canto superior direito
2. Clique para ver opções:
   - Manage Account
   - Sign Out

### Cenário 3: Proteção de Rotas
1. Tente acessar `/upload` sem login
2. Será bloqueado e redirecionado
3. Após login, terá acesso

---

## 🆓 Limites do Tier Gratuito

- ✅ **10.000 usuários ativos/mês**
- ✅ **Autenticação social ilimitada**
- ✅ **2FA incluído**
- ✅ **Suporte por email**

Para uso pessoal/familiar, é mais que suficiente!

---

## 🔧 Troubleshooting

### Erro: "Clerk: Missing publishable key"
- **Solução:** Verifique se o `.env.local` está na raiz do projeto
- Reinicie o servidor (`npm run dev`)

### Erro: "Invalid redirect URL"
- **Solução:** Configure as URLs no Clerk Dashboard
- Paths → Sign-in URL: `/sign-in`

### Botão de Login não aparece
- **Solução:** Limpe o cache do navegador
- Ou acesse em aba anônima

---

## 📞 Próximos Passos

Após configurar o Clerk:

1. ✅ Testar login/logout
2. ⏳ **Fase 6:** Migrar para Supabase (PostgreSQL)
3. ⏳ **Fase 7:** Deploy no Vercel

---

**Status:** Aguardando configuração das chaves do Clerk
