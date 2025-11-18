# SIGEC - Sistema de Gestão de Estoque e Caixa

Projeto desenvolvido para as disciplinas de Construção de Software e Gerência de Configuração de Software.
Sistema Fullstack (Spring Boot + Angular) com autenticação JWT e controle de acesso.

##  Tecnologias
- **Backend:** Java 17, Spring Boot 3, Spring Security (JWT), JPA/Hibernate, H2 Database.
- **Frontend:** Angular 17, PrimeNG, RxJS.
- **Banco de Dados:** H2 (Arquivo local).

##  Como Rodar

### 1. Backend (API)
1. Navegue até a pasta `sigec-api`.
2. Execute: `mvnw spring-boot:run`
3. O servidor iniciará em: `http://localhost:8080`

### 2. Frontend (UI)
1. Navegue até a pasta `sigec-ui`.
2. Instale as dependências (primeira vez): `npm install`
3. Execute: `ng serve` or `npm start`
4. Acesse no navegador: `http://localhost:4200`

##  Credenciais de Acesso (Padrão)

O sistema inicia com os seguintes usuários (definidos no `data.sql`):

| Perfil | E-mail | Senha |
| :--- | :--- | :--- |
| **ADMIN** | `admin@sigec.com` | `12345678` |
| **OPERADOR** | `operador@sigec.com` | `123@Mudar` |

> **Nota:** Caso tenha alterado as senhas localmente, o banco H2 (arquivo) manterá as alterações. Delete a pasta `db` na raiz do backend para resetar a senha do admin padrão.

##  Funcionalidades Principais (v1.1.0)
- **Login Seguro:** Autenticação via Token JWT.
- **Dashboard:** Visão geral de vendas e estoque (Exclusivo Admin).
- **Gestão de Usuários:** CRUD com Soft Delete (Ativar/Desativar).
- **Controle de Estoque:** Cadastro de produtos com Soft Delete.
- **Caixa (PDV):** Registro de vendas com baixa automática de estoque (Exclusivo Operador).
- **Relatórios:** Histórico de vendas com filtros dinâmicos.
