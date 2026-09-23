# Norte Studio — pacote para revisão

Versão em modo escuro, com detalhes em laranja avermelhado. Site estático preparado para `https://nortestudio.website`. Nada foi publicado e nenhum banco, usuário, registro, política de acesso ou configuração de produção foi alterado.

## Conteúdo

- `public/`: site completo, pronto para servir por HTTP/HTTPS. Contém a página inicial, os dois orçamentos, portfólio, painel existente, CSS, JavaScript, fontes, imagens, `robots.txt` e `sitemap.xml`.
- `documentacao/REVISAO.md`: mudanças, testes realizados e limites da verificação.
- `documentacao/previa-inicial.jpg`: captura da página inicial revisada.
- `referencia-backend/`: SQL e instruções originais do painel, preservados apenas para referência. **Não é necessário executar esse SQL para usar o novo front-end.**

## Conferir sem publicar

Extraia o ZIP. Em um terminal aberto nesta pasta, com Python 3 instalado, execute:

```sh
python3 -m http.server 8000 --directory public
```

Abra `http://localhost:8000/`. Para conferir em outro aparelho da mesma rede, use o IP local do computador e a porta 8000.

Use um servidor local: abrir o HTML diretamente com duplo clique (`file://`) não reproduz as URLs e os caminhos da publicação.

**Os formulários do pacote final mantêm a conexão com o Supabase real. Clicar em enviar poderá criar um pedido no banco existente.** Os testes descritos no relatório usaram um servidor separado com respostas simuladas; esse servidor de testes não está no pacote. É possível revisar aparência, navegação e etapas sem enviar um pedido.

## Publicar quando aprovado

Publique somente **o conteúdo de `public/`** na raiz do domínio. O arquivo `index.html` deve ficar na raiz pública, junto de `assets/`, `orcamento/` e demais pastas. Não publique `documentacao/` nem `referencia-backend/`.

Não há instalação, compilação, Node.js, pacote npm ou migração de banco necessários. O servidor deve servir `index.html` como índice das pastas e manter HTTPS. O `CNAME` do domínio e o arquivo `.nojekyll` foram preservados para compatibilidade com a hospedagem atual.

As configurações e permissões existentes do Supabase continuam necessárias. A revisão não mudou autenticação, políticas, tabelas, funções ou DNS. A entrega deste ZIP não executa deploy.

## Onde editar

| Conteúdo | Arquivo |
| --- | --- |
| Página inicial e valores R$ 490 / R$ 990 | `public/index.html` |
| Visual compartilhado e animações | `public/assets/css/site.css` |
| Apresentação dos formulários | `public/assets/css/forms.css` |
| Navegação mobile e revelação dos textos | `public/assets/js/site.js` |
| Conexão pública e validação comum | `public/assets/js/form-shared.js` |
| Etapas do orçamento padrão | `public/assets/js/orcamento.js` |
| Etapas do orçamento personalizado | `public/assets/js/orcamento-personalizado.js` |

Os campos e opções originais dos formulários foram mantidos, incluindo suas faixas de investimento. Essas opções não calculam automaticamente o valor de um plano.

As fontes Manrope são servidas localmente; a licença está em `public/assets/fonts/OFL.txt`.
