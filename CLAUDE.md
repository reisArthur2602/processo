# Padrões de Desenvolvimento — Next.js

Este documento define os padrões obrigatórios para desenvolvimento neste projeto.

## Convenções de nomes

- Use sempre `kebab-case` para nomes de arquivos.
- Exemplos corretos: `upload-dialog.tsx`, `user-form.tsx`, `delete-upload.ts`, `upload-columns.tsx`.
- Evite nomes em PascalCase ou camelCase para arquivos.

## Organização por feature

Componentes específicos de uma página devem ficar dentro da própria rota, em uma pasta chamada `feature`.

```text
app/
└── upload/
    ├── page.tsx
    ├── feature/
    │   ├── upload-dialog.tsx
    │   ├── upload-data.tsx
    │   ├── upload-table.tsx
    │   └── upload-columns.tsx
    └── actions/
        ├── create-upload.ts
        └── delete-upload.ts
```

Regras:

- Todo componente específico da página deve usar o nome da feature.
- Não mova componentes específicos de rota para pastas globais.
- Componentes compartilhados entre várias páginas devem ir para `components/shared`.
- Componentes de UI base devem ir para `components/ui`.

## Pages e componentes client

- Toda `page.tsx` deve ser um Server Component.
- Não use `"use client"` diretamente em `page.tsx`.
- Quando houver necessidade de estado, eventos, hooks ou APIs do navegador, crie um componente separado dentro da pasta `feature`.
- Mantenha as pages pequenas e responsáveis apenas por composição, autenticação e carregamento inicial.

```tsx
import { UploadData } from './feature/upload-data'

const UploadPage = async () => {
  return <UploadData />
}

export default UploadPage
```

## Componentização

- Componentize o máximo possível sem criar abstrações desnecessárias.
- Evite arquivos muito grandes.
- Separe apresentação, carregamento de dados, validação e mutations.
- Use componentes já existentes antes de criar novos.
- Componentes de formulário, diálogos, tabelas e filtros devem ser separados quando tiverem responsabilidade própria.

## Componentes de UI

Todos os componentes visuais reutilizáveis devem ficar em:

```text
components/ui/
```

Componentes compartilhados com regra de negócio devem ficar em:

```text
components/shared/
```

## Tabelas

Use sempre TanStack Table para tabelas com filtros, busca, ordenação ou paginação.

Estrutura padrão:

```text
feature/
├── upload-data.tsx
├── upload-table.tsx
└── upload-columns.tsx
```

### `feature-data.tsx`

Responsabilidades:

- Ser um Server Component assíncrono.
- Buscar os dados no servidor.
- Validar autenticação quando necessário.
- Repassar os dados para o componente da tabela.
- Não conter configuração de colunas nem lógica de filtros da interface.

```tsx
import { prisma } from '@/lib/prisma'
import { UploadTable } from './upload-table'

export const UploadData = async () => {
  const uploads = await prisma.upload.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })

  return <UploadTable data={uploads} />
}
```

### `feature-table.tsx`

Responsabilidades:

- Ser um Client Component.
- Configurar TanStack Table.
- Controlar filtros, busca, paginação e ordenação.
- Renderizar estados vazios.
- Receber dados prontos do servidor.

### `feature-columns.tsx`

Responsabilidades:

- Definir apenas as colunas da tabela.
- Manter renderizações de células organizadas.
- Evitar lógica de busca de dados.
- Extrair células complexas para componentes separados quando necessário.

## Autenticação

Use:

- Cookie HTTP-only.
- JWT.
- `bcrypt` para hash e comparação de senha.
- Nunca salve senha em texto puro.
- Nunca exponha token ao JavaScript do navegador.

Estrutura:

```text
lib/
└── auth/
    ├── get-session.ts
    ├── redirect-auth.ts
    └── verify-auth.ts
```

### `getSession`

Responsabilidades:

- Ler o cookie HTTP-only.
- Validar o JWT.
- Extrair o ID do usuário.
- Buscar o usuário atualizado no banco.
- Retornar o usuário ou `null`.

### `redirectAuth`

Use em pages e layouts.

Responsabilidades:

- Redirecionar usuários deslogados para `/login`.
- Redirecionar usuários autenticados para a página principal quando acessarem rotas públicas.
- Ser baseada em `getSession`.

### `verifyAuth`

Use em Server Actions, Route Handlers e outras funções server-side protegidas.

Responsabilidades:

- Buscar a sessão com `getSession`.
- Lançar erro quando o usuário não estiver autenticado.
- Retornar o usuário autenticado.

## Proxy

Crie um arquivo:

```text
proxy.ts
```

Responsabilidades:

- Verificar a existência do token antes de acessar rotas protegidas.
- Fazer uma validação inicial do token.
- Redirecionar usuários não autenticados.
- Não substituir a validação server-side com `verifyAuth`.
- Nunca confiar apenas no proxy para autorização.

## Formulários

Use sempre:

- React Hook Form.
- Zod.
- `zodResolver`.
- Componentes de `components/ui`.
- Sonner para feedback visual.

## Schemas

Crie uma pasta:

```text
schema/
```

Regras:

- Cada schema deve ficar em seu próprio arquivo.
- Exporte o schema.
- Exporte o tipo inferido com `z.infer`.
- Não duplique tipos manualmente quando puderem ser inferidos pelo Zod.
- Use nomes de arquivos em `kebab-case`.

```ts
import { z } from 'zod'

export const createUploadSchema = z.object({
  name: z.string().min(1, 'Informe o nome'),
})

export type CreateUploadInput = z.infer<typeof createUploadSchema>
```

## Server Actions

As actions devem ficar dentro da própria rota, em uma pasta chamada `actions`.

```text
app/
└── upload/
    ├── page.tsx
    ├── actions/
    │   ├── create-upload.ts
    │   ├── update-upload.ts
    │   └── delete-upload.ts
    └── feature/
```

Regras:

- Cada action deve ficar em seu próprio arquivo.
- Use sempre `"use server"` no início do arquivo.
- Use sempre arrow functions.
- Não tipar explicitamente o retorno da action.
- Deixe o TypeScript inferir o retorno.
- Valide os dados com Zod dentro da action.
- Verifique autenticação com `verifyAuth`.
- Retorne sempre o padrão:

```ts
{
  ok: boolean
  message: string
  data?: unknown
}
```

Exemplo:

```ts
'use server'

import { revalidatePath } from 'next/cache'

import { verifyAuth } from '@/lib/auth/verify-auth'
import { prisma } from '@/lib/prisma'
import {
  createUploadSchema,
  type CreateUploadInput,
} from '@/schema/create-upload-schema'

export const createUpload = async (input: CreateUploadInput) => {
  try {
    await verifyAuth()

    const parsed = createUploadSchema.safeParse(input)

    if (!parsed.success) {
      return {
        ok: false,
        message: 'Dados inválidos',
      }
    }

    const upload = await prisma.upload.create({
      data: parsed.data,
    })

    revalidatePath('/upload')

    return {
      ok: true,
      message: 'Upload criado com sucesso',
      data: upload,
    }
  } catch {
    return {
      ok: false,
      message: 'Não foi possível criar o upload',
    }
  }
}
```

## Arrow functions

Use sempre arrow functions.

Correto:

```ts
export const createUpload = async () => {
  // ...
}
```

Evite:

```ts
export async function createUpload() {
  // ...
}
```

## Toasts

Use sempre Sonner.

```ts
import { toast } from 'sonner'

toast.success('Registro criado com sucesso')
toast.error('Não foi possível concluir a operação')
```

Não use:

- `alert`.
- Toasts implementados manualmente.
- Bibliotecas alternativas sem necessidade.

## Estrutura de referência

```text
src/
├── app/
│   ├── login/
│   │   ├── page.tsx
│   │   ├── actions/
│   │   │   └── login.ts
│   │   └── feature/
│   │       └── login-form.tsx
│   └── upload/
│       ├── page.tsx
│       ├── actions/
│       │   ├── create-upload.ts
│       │   ├── update-upload.ts
│       │   └── delete-upload.ts
│       └── feature/
│           ├── upload-dialog.tsx
│           ├── upload-form.tsx
│           ├── upload-data.tsx
│           ├── upload-table.tsx
│           └── upload-columns.tsx
├── components/
│   ├── ui/
│   └── shared/
├── lib/
│   ├── auth/
│   │   ├── get-session.ts
│   │   ├── redirect-auth.ts
│   │   ├── verify-auth.ts
│   │   └── token.ts
│   └── prisma.ts
├── schema/
│   ├── login-schema.ts
│   └── create-upload-schema.ts
└── proxy.ts
```

## Checklist obrigatório

Antes de concluir qualquer implementação, confirme:

- [ ] Os arquivos usam `kebab-case`.
- [ ] A `page.tsx` continua sendo Server Component.
- [ ] Componentes client estão separados dentro de `feature`.
- [ ] Componentes específicos não foram colocados em pastas globais.
- [ ] Componentes de UI estão em `components/ui`.
- [ ] Componentes compartilhados estão em `components/shared`.
- [ ] Tabelas usam TanStack Table.
- [ ] Tabelas estão separadas em `data`, `table` e `columns`.
- [ ] Formulários usam React Hook Form, Zod e `zodResolver`.
- [ ] Toasts usam Sonner.
- [ ] Schemas ficam em `schema`, um por arquivo.
- [ ] Tipos dos schemas usam `z.infer`.
- [ ] Actions ficam dentro da rota em `actions`.
- [ ] Cada action está em um arquivo separado.
- [ ] Actions usam o retorno `{ ok, message, data? }`.
- [ ] Actions não possuem tipo de retorno manual.
- [ ] Funções usam arrow function.
- [ ] Rotas protegidas usam `redirectAuth` ou `verifyAuth`.
- [ ] O cookie de autenticação é HTTP-only.
- [ ] Senhas usam `bcrypt`.
- [ ] O token usa JWT.
- [ ] O proxy não é usado como única camada de segurança.

## Comportamento esperado do Claude Code

Ao criar ou alterar código neste projeto:

1. Leia este arquivo antes de implementar.
2. Preserve a estrutura existente.
3. Não mova componentes entre pastas sem necessidade.
4. Não transforme pages em Client Components.
5. Não crie tipos redundantes.
6. Não crie componentes de UI duplicados.
7. Não use function declarations.
8. Não coloque várias actions no mesmo arquivo.
9. Não faça consultas ao banco em componentes client.
10. Não finalize uma implementação que viole este documento.
