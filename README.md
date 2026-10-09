V2 - Site mais simplificado
# Clube de Oficiais CBMDF - Site Institucional

Site estatico institucional do Clube de Oficiais dos Bombeiros do DF, com layout legado responsivo.

## Tecnologias
- HTML5
- CSS3
- JavaScript (vanilla)

## Estrutura de paginas
- `index.html`: home com destaques institucionais e banner de fotos
- `noticias.html`: noticias e comunicados
- `galeria.html`: galeria de fotos institucional
- `institucional.html`: landing institucional
- `historia.html`: historico do clube
- `diretoria.html`: tabela da diretoria executiva
- `horarios.html`: horarios de funcionamento do clube e secretaria
- `conheca-clube.html`: estrutura, beneficios e conteudo de convenios consolidado
- `regulamentos.html`: cards e tabela de regulamentos
- `transparencia.html`: secoes anuais com ancoras `#ano-2024` ate `#ano-2014`
- `associe-se.html`: documentos para associacao
- `localizacao.html`: endereco e acesso
- `contatos.html`: canais de contato e formulario


## Arquivos principais
- `styles.css`: tema legado global (header, nav, breadcrumb, tabelas, cards e footer)
- `app.js`: menu desktop/mobile, dropdowns, estado ativo, banner da home, formularios e botao de WhatsApp
- `images/`: favicon e imagens gerais do site

## Como executar
1. Abra a pasta `Clube-Oficiais-CBMDF`.
2. Execute `npm ci` para instalar as dependencias.
3. Execute `npm run dev` e abra o endereco local informado pelo Astro.

Para validar a tipagem e gerar o site estatico, execute `npm run check` e `npm run build`.

## Deploy na Vercel pelo GitHub Actions

O workflow de CI faz deploy de producao automaticamente quando um push para `main` passa nas verificacoes e no build. Tambem e possivel iniciar o workflow manualmente na branch `main` pela aba **Actions** do GitHub.

Configure estes valores em **Settings > Secrets and variables > Actions** no repositorio:

- Variavel `VERCEL_ORG_ID`: ID da conta/equipe Vercel.
- Variavel `VERCEL_PROJECT_ID`: ID do projeto Vercel.
- Secret `VERCEL_TOKEN`: token pessoal da Vercel.

Os IDs estao nas configuracoes gerais do projeto Vercel ou no arquivo `.vercel/project.json` depois de vincular o projeto com a CLI. O token deve ser cadastrado como secret e nunca colocado no codigo. Para evitar deploys duplicados, desative o deploy automatico por Git nas configuracoes do projeto Vercel se quiser que o Actions seja o unico responsavel por publicar.

## Personalizacao rapida
- Conteudo e estrutura das paginas: arquivos `.html`.
- Cores, layout e responsividade: `styles.css`.
- Comportamentos e interacoes: `app.js`.

## Licenca
Este projeto possui o arquivo `LICENSE` na raiz com os termos aplicaveis.

## Endereços públicos sem extensão

As páginas usam `/estrutura`, `/acomodacoes` e `/eventos/dia-das-criancas`, sem `.html` e sem barra final. Links internos, URLs canônicas e sitemap seguem esse padrão.

O Astro mantém `build.format: "file"` para gerar os arquivos estáticos. Na Vercel, o `vercel.json` habilita `cleanUrls` para servir esses arquivos nos endereços sem extensão e redirecionar os antigos `.html` com HTTP 308. `/index.html` e `/index` redirecionam para `/`.

Publique o projeto pela Vercel com o `vercel.json` na raiz; copiar somente `dist` para outro servidor não aplica essas regras. Em outra hospedagem, configure o comportamento equivalente. Após publicar, confira `/estrutura`, `/acomodacoes` e o redirecionamento de `/estrutura.html`, e reenvie `sitemap-index.xml` no Google Search Console.

