# Guia de Diagnóstico Vercel-Supabase

## Testes Locais Realizados ✅

Todos os testes passaram com sucesso:
- ✅ Supabase REST API acessível
- ✅ Porta 5432 (PostgreSQL direto) acessível
- ✅ Porta 6543 (PgBouncer) acessível

**Conclusão:** O problema NÃO é com o Supabase ou sua rede local.

## Próximos Passos

### 1. Testar Endpoint de Diagnóstico na Vercel

Acesse no navegador:
```
https://seu-site.vercel.app/api/diagnostics
```

Este endpoint vai testar:
- Se as variáveis de ambiente estão configuradas
- Se o Prisma consegue criar um client
- Se consegue conectar ao banco
- Se consegue fazer queries

### 2. Verificar Variáveis de Ambiente na Vercel

Vá em **Vercel > Settings > Environment Variables** e confirme que você tem:

#### DATABASE_URL
```
postgresql://postgres:meuagentefinanceirodiego@db.zqrekxkvxrltnwzptsbx.supabase.co:5432/postgres
```

#### DIRECT_URL (opcional, mas recomendado)
```
postgresql://postgres:meuagentefinanceirodiego@db.zqrekxkvxrltnwzptsbx.supabase.co:5432/postgres
```

#### GOOGLE_API_KEY
```
AIzaSyC3T2fMtnfUauCwsVbUJetGSeVADP6C6pQ
```

### 3. Verificar Restrições de IP no Supabase

1. Acesse o Supabase Dashboard
2. Vá em **Settings > Database > Connection Pooling**
3. Verifique se há restrições de IP
4. Se houver, **desative temporariamente** para testar

### 4. Alternativa: Usar Supabase Connection Pooler

Se a conexão direta não funcionar, tente usar o Supabase Connection Pooler:

1. No Supabase, vá em **Settings > Database**
2. Copie a **Connection Pooler** string (porta 6543)
3. Use esta no Vercel:
```
postgresql://postgres.zqrekxkvxrltnwzptsbx:meuagentefinanceirodiego@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

## Possíveis Causas do Problema

1. **Variável de ambiente não configurada corretamente na Vercel**
2. **Supabase com restrições de IP** (bloqueando IPs da Vercel)
3. **Senha com caracteres especiais mal codificados** (já resolvemos isso)
4. **Timeout de conexão** (Vercel tem limite de 10s para cold starts)

## Se Nada Funcionar

Considere usar **Supabase via REST API** em vez de Prisma para a Vercel, mantendo Prisma apenas para local.
