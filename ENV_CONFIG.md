# Configuração de Ambiente - Meuagentefinanceiro

## Estrutura de Arquivos .env

- **`.env`**: Configuração base (NÃO vai para o Git)
- **`.env.local`**: Sobrescreve `.env` localmente (NÃO vai para o Git)
- **Vercel Environment Variables**: Configuração para produção (web)

## Regras

1. **Local (desenvolvimento)**: Next.js usa `.env.local` > `.env`
2. **Vercel (produção)**: Usa as variáveis configuradas no painel da Vercel

## Variáveis Necessárias

### GOOGLE_API_KEY
- **Valor atual**: `AIzaSyC3T2fMtnfUauCwsVbUJetGSeVADP6C6pQ`
- **Onde configurar**:
  - ✅ `.env.local` (local)
  - ✅ Vercel > Settings > Environment Variables

### DATABASE_URL
- **Problema identificado**: Supabase pode estar pausado ou com firewall bloqueando
- **Solução**: Usar conexão via PgBouncer (porta 6543) que funciona melhor com firewalls

**String correta para AMBOS os ambientes:**
```
postgresql://postgres:+U5%25cQ%23Ui78YUvf@db.zqrekxkvxrltnwzptsbx.supabase.co:6543/postgres?pgbouncer=true
```

### Outras variáveis (Clerk, etc.)
- Devem estar iguais em `.env.local` e Vercel

## Próximos Passos

1. Atualizar `.env` e `.env.local` com a DATABASE_URL correta (porta 6543)
2. Atualizar Vercel Environment Variables
3. Testar conexão local
4. Deploy e teste na web
