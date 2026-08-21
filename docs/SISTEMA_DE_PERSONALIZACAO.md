# Sistema de Personalização

## 1. Conceito principal

A plataforma será construída com dois elementos separados:

- **tema:** controla aparência, cores, fontes, espaçamentos e animações;
- **bloco:** representa uma parte do conteúdo, como carta, galeria ou contador.

O conteúdo não ficará preso ao tema. O usuário poderá trocar de tema sem perder fotos, textos, datas ou blocos.

## 2. Personalização com limites

A plataforma oferecerá liberdade, mas também manterá limites de design.

O usuário não poderá modificar qualquer detalhe do CSS livremente, pois isso poderia gerar páginas ilegíveis, quebradas ou pouco acessíveis.

A personalização será feita por opções preparadas e testadas:

- tema;
- paleta;
- combinação de fontes;
- intensidade das animações;
- formato das imagens;
- estilo dos botões;
- ordem dos blocos;
- visibilidade de cada seção;
- textos e mídias.

## 3. Temas da primeira versão

### Tema Aurora

Estilo romântico e elegante.

Características:

- cores claras ou rosadas;
- detalhes suaves;
- elementos florais discretos;
- transições delicadas;
- fontes elegantes para títulos;
- boa leitura em textos longos.

### Tema Cosmos

Estilo escuro inspirado no céu e nas estrelas.

Características:

- fundo azul-escuro ou preto;
- estrelas com movimento suave;
- detalhes luminosos;
- galeria com profundidade;
- contador em destaque;
- opção para reduzir animações.

### Tema Memórias

Estilo inspirado em fotografias e recordações.

Características:

- cartões semelhantes a fotografias;
- texturas discretas de papel;
- linha do tempo em destaque;
- legendas manuscritas apenas em detalhes;
- aparência acolhedora;
- navegação semelhante a um álbum.

## 4. Blocos da primeira versão

### 4.1 Capa

Conteúdo:

- título;
- nomes;
- pequena mensagem;
- foto principal;
- botão para iniciar a experiência.

Configurações:

- alinhamento;
- intensidade do efeito visual;
- exibição ou ocultação da foto;
- texto do botão.

### 4.2 Contador

Conteúdo:

- data e horário de início;
- título personalizado;
- tempo decorrido.

Exibição:

- anos;
- meses;
- dias;
- horas;
- minutos;
- segundos.

O cálculo deverá considerar datas reais e não apenas dividir o tempo total por valores aproximados.

### 4.3 Carta

Conteúdo:

- título;
- mensagem;
- assinatura.

Dinâmica:

- envelope fechado;
- animação de abertura;
- opção de leitura direta para usuários que preferem menos movimento.

### 4.4 Galeria

Conteúdo:

- fotos;
- legendas;
- texto alternativo para acessibilidade.

Configurações:

- grade;
- carrossel;
- fotografias empilhadas;
- ordem das imagens;
- destaque de uma foto principal.

### 4.5 Linha do tempo

Conteúdo:

- data;
- título do momento;
- descrição;
- foto opcional.

Configurações:

- ordem cronológica;
- momentos em destaque;
- aparência vertical no celular.

### 4.6 Música

Conteúdo:

- link permitido;
- título da música;
- artista;
- pequena explicação sobre sua importância.

Regras:

- o usuário controlará a reprodução;
- a plataforma não prometerá reprodução automática;
- links incompatíveis deverão apresentar uma mensagem clara;
- direitos autorais e regras do serviço de origem deverão ser respeitados.

### 4.7 Cartões surpresa

Conteúdo:

- título curto;
- mensagem escondida;
- ícone ou imagem.

Dinâmica:

- o presenteado toca ou clica para revelar;
- cada cartão informa claramente se está aberto;
- a interação também deverá funcionar pelo teclado.

### 4.8 Encerramento

Conteúdo:

- mensagem final;
- assinatura;
- data;
- opção de retornar ao início.

## 5. Organização dos blocos

O usuário poderá:

- adicionar blocos permitidos;
- alterar a ordem;
- duplicar blocos compatíveis;
- ocultar temporariamente;
- excluir com confirmação;
- editar o conteúdo;
- visualizar imediatamente o resultado.

Cada bloco possuirá:

- identificador único;
- tipo;
- posição;
- conteúdo;
- configurações;
- situação visível ou oculta.

## 6. Pré-visualização

O editor apresentará duas áreas principais:

- painel de edição;
- prévia do presente.

A prévia poderá alternar entre:

- celular;
- tablet;
- computador.

Alterações simples deverão aparecer rapidamente. Uploads e salvamentos deverão mostrar seu próprio estado de progresso.

## 7. Salvamento

O sistema deverá indicar:

- salvando;
- salvo;
- alteração pendente;
- falha ao salvar.

Para evitar excesso de requisições, alterações de texto poderão aguardar um curto período antes de serem enviadas ao servidor.

## 8. Recursos futuros

Depois da primeira versão, poderão ser adicionados:

- raspadinha digital;
- quebra-cabeça;
- quiz do casal;
- mapa de momentos;
- mensagem de voz;
- cápsula do tempo;
- constelação personalizada;
- livro de visitas;
- vídeo de retrospectiva;
- escolhas que mudam o caminho da história;
- blocos desbloqueados por senha;
- contagem regressiva;
- temas para amizade e família;
- marketplace de temas.

Esses recursos não entrarão juntos. Cada um precisará ser acessível, responsivo e testado antes de ser publicado.

## 9. Regra de qualidade

Um novo tema ou bloco somente será considerado pronto quando:

- funcionar no celular e no computador;
- possuir estado vazio;
- possuir validação;
- tratar erros;
- funcionar pelo teclado;
- respeitar preferência por menos movimento;
- não perder conteúdo ao trocar de tema;
- possuir testes;
- estar documentado.