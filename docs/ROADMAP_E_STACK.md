# Roadmap e Stack da Coraeli

## 1. Estratégia de desenvolvimento

A Coraeli será desenvolvida em versões utilizáveis.

Cada versão deverá:

- possuir um objetivo claro;
- funcionar do início ao fim;
- ser testada;
- ser documentada;
- gerar commits pequenos;
- não depender de funcionalidades futuras para ser compreendida.

A ambição do produto continuará alta, mas a complexidade será adicionada gradualmente.

## 2. Arquitetura inicial

A primeira arquitetura profissional será um monólito modular.

Isso significa que:

- front-end e back-end poderão ficar no mesmo repositório;
- cada área terá responsabilidades separadas;
- o sistema não começará com microsserviços;
- funcionalidades poderão ser separadas futuramente se existir necessidade real.

Começar com microsserviços aumentaria custos, configuração e dificuldade de testes sem resolver um problema atual.

## 3. Stack planejada

### Front-end

- React;
- TypeScript;
- Vite;
- React Router;
- React Hook Form;
- Zod;
- CSS organizado com variáveis e componentes;
- biblioteca de ícones;
- editor construído com componentes reutilizáveis.

### Back-end

- Node.js;
- TypeScript;
- Express;
- Zod para validação;
- arquitetura dividida por módulos;
- documentação OpenAPI;
- logs estruturados;
- tratamento centralizado de erros.

### Banco de dados

- PostgreSQL;
- Prisma ORM;
- migrações versionadas;
- dados demonstrativos;
- backups planejados antes de uso comercial.

### Autenticação

- senhas armazenadas com hash seguro;
- sessão protegida por cookie;
- recuperação de senha;
- verificação de propriedade dos recursos;
- limitação de tentativas;
- separação entre usuário comum e administrador.

Tokens de autenticação não serão armazenados de forma insegura no `localStorage`.

### Mídias

- upload controlado;
- validação de tipo e tamanho;
- compressão de imagens;
- armazenamento externo quando necessário;
- URLs temporárias para operações privadas;
- exclusão conforme regras de retenção.

### Testes

- Vitest para funções e componentes;
- Testing Library para interface;
- Supertest para API;
- Playwright para fluxos completos;
- testes manuais documentados.

### Qualidade

- ESLint;
- Prettier;
- GitHub Actions;
- variáveis de ambiente;
- documentação;
- auditoria de acessibilidade;
- verificação de desempenho;
- análise de dependências.

## 4. Organização futura do repositório

```text
coraeli/
├── apps/
│   ├── web/
│   └── api/
├── packages/
│   └── shared/
├── docs/
├── tests/
├── package.json
└── README.md