# FSI Support Point System — Frontend v2

Reengenharia completa do frontend conforme documento `reengenharia_frontend.docx`.

## Stack

| Categoria | Biblioteca | Versão |
|---|---|---|
| Runtime | React | 19.x |
| Linguagem | TypeScript | 5.x strict |
| Build | Vite | 6.x |
| Roteamento | React Router | 7.x |
| Estado Global | Zustand | 5.x |
| Dados Assíncronos | TanStack Query | 5.x |
| Formulários | React Hook Form + Zod | 7.x + 3.x |
| HTTP | Axios | 1.x |
| UI / Estilo | Tailwind CSS | 4.x |
| Notificações | Sonner | 1.x |

## Configuração

```bash
# Instalar dependências
npm install

# Dev
npm run dev

# Build produção
npm run build

# Testes
npm test
```

## Variáveis de Ambiente

- `.env.development` — API local (`http://localhost:5000/api`)
- `.env.production` — API produção Azure

Para deploy via CI/CD, configure o secret `VITE_API_BASE_URL` no GitHub.

## Estrutura

```
src/
├── api/          # Camada de acesso à API (axios)
├── stores/       # Estado global Zustand
├── hooks/        # TanStack Query hooks
├── schemas/      # Zod schemas (contratos da API)
├── components/   # Componentes reutilizáveis + AuthGuard
├── pages/        # Telas
└── i18n/         # Traduções (pt, en, es, fr, zh)
```

## Melhorias v2 vs v1

- ✅ Zustand substitui localStorage como estado reativo
- ✅ React Hook Form + Zod substitui useState manual por campo
- ✅ TanStack Query substitui useEffect + axios direto
- ✅ AuthGuard protege rotas por role (ADMIN/SELLER)
- ✅ Sonner substitui sweetalert2 (mais leve)
- ✅ LoginResponse com `userRole/sellerId` (novo contrato da API)
- ✅ Mapeamento centralizado de erros da API por código
- ✅ useGeoLocation hook singleton no checkin
