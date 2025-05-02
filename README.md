# 🚀 Compass Reservation API

API RESTful para gerenciamento de reservas de espaços e recursos, desenvolvida com **NestJS**, **Prisma**, **TypeScript**, **MySQL**, e documentação via **Swagger**.

---

## 👨‍💻 Equipe CodeBuilders

Desenvolvido pela equipe **CodeBuilders** como parte da estrutura de backend para o sistema Compass Reservation.

---

## 🛠️ Tecnologias Utilizadas

- ⚙️ **NestJS** – Framework backend modular
- 📘 **TypeScript** – Tipagem estática moderna
- 🧠 **Prisma ORM** – Acesso a banco de dados relacional
- 🐬 **MySQL** – Banco de dados relacional
- 🧾 **Swagger** – Documentação automática da API
- 🔒 **JWT** – Autenticação por token
- 📏 **Class-validator** – Validações nos DTOs
- 🐳 **Docker** (estrutura inicial prevista)
- 🧹 **ESLint + Prettier** – Padronização e qualidade de código

---

## 📁 Estrutura de Pastas

```
src/
├── clients/              # Módulo de clientes
├── decorators/           # Decorators personalizados
├── enums/                # Enums globais
├── middlewares/          # Middlewares de autenticação, etc.
├── prisma/               # Configuração do Prisma
├── reservations/         # Módulo de reservas
├── resources/            # Módulo de recursos
├── spaces/               # Módulo de espaços
├── users/                # Módulo de usuários
├── app.module.ts         # Módulo raiz
├── app.controller.ts     # Controller raiz
├── app.service.ts        # Serviço global
└── main.ts               # Entry point da aplicação
```

---

## ⚙️ Variáveis de Ambiente `.env`

Configure seu arquivo `.env` com base no exemplo abaixo:

```env
DATABASE_URL="mysql://root:minhasenha@localhost:3306/ANMAR25_D02_COMPASSRESERVATION"
JWT_SECRET="sua_chave_jwt"
JWT_EXPIRES_IN="1d"
DEFAULT_ADMIN_EMAIL=admin@compass.com
DEFAULT_ADMIN_PASSWORD=Admin1234
DEFAULT_ADMIN_NAME=Admin
```

---

## 📦 Instalação e Execução

```bash
# Instalar dependências
npm install --legacy-peer-deps

# Gerar Prisma Client
npx prisma generate

# Aplicar migrações
npx prisma migrate dev --name init

# Iniciar a aplicação
npm run dev
```

---

## 📚 Swagger - Documentação Interativa

Swagger está configurado no projeto em `src/main.ts`.

Após iniciar o servidor, acesse:
```
http://localhost:3000/api
```

> Para que os endpoints apareçam corretamente:
> - Os módulos devem estar importados em `AppModule`
> - Os controllers devem conter:
>   - `@ApiTags('NomeDoGrupo')`
>   - `@ApiOperation({ summary: 'Descrição' })`

---

## ✅ Status do Projeto

| Funcionalidade             | Status         |
|----------------------------|----------------|
| Estrutura NestJS           | ✅ Finalizado  |
| Banco MySQL conectado      | ✅ Operacional |
| Prisma configurado         | ✅ Pronto      |
| Swagger habilitado         | ✅ Ativo       |
| CRUDs integrados           | 🚧 Em andamento|
| Autenticação JWT           | 🚧 Em breve    |

---

## 📌 Observações

- Branch de integração atual: `feature/integrate-infra-auth`
- Em caso de erro `.git/index.lock`, feche o VS Code e remova o arquivo manualmente
- Evite usar OneDrive como workspace principal (pode gerar problemas de permissões com arquivos removidos)

---

> Documento atualizado por **CodeBuilders** – versão em desenvolvimento contínuo 💻✨
