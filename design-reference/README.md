# Processo — Protótipo funcional

Protótipo de uma plataforma de gestão de processos jurídicos, desenvolvido somente com HTML5, Tailwind CSS via CDN e JavaScript nativo.

## Como abrir

1. Extraia o arquivo ZIP.
2. Abra `index.html` ou `login.html` no navegador.
3. Na tela de login, preencha um e-mail válido e qualquer senha para acessar o dashboard.

Não é necessário instalar dependências ou executar build.

## Arquivos

- `design-system.html`: tokens, tipografia e componentes.
- `login.html`: login com validação e modal de recuperação.
- `dashboard.html`: tabela com busca e filtro de status.
- `detalhes.html`: dados do processo, linha do tempo e documentos.
- `cadastro.html`: formulário com máscara CNJ e validação.
- `index.html`: redirecionamento de conveniência para o login.

## Observações

- Todos os dados são fictícios.
- Os downloads na tela de detalhes geram arquivos demonstrativos no navegador.
- O cadastro valida os campos e redireciona para o dashboard, sem persistir dados.
- As fontes são carregadas do Google Fonts e o Tailwind CSS é carregado por CDN.


## Estilos compartilhados

- `tailwind.config.js`: tokens, fontes, sombras e raios usados pelo Tailwind CDN.
- `styles.css`: estilos globais, fallbacks de fontes e acessibilidade.

Mantenha estes dois arquivos na mesma pasta dos arquivos HTML. O protótipo usa o Tailwind Play CDN, portanto é necessária conexão com a internet para gerar as classes utilitárias. As fontes possuem fallbacks locais caso o Google Fonts não carregue.
