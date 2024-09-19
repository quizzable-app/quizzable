## Getting Started

This project is a starting point for a Firebase application using Next.js and a Postgres database. Here are a few resources to help get you started:

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase CLI Documentation](https://firebase.google.com/docs/cli)
- [Next.js Documentation](https://nextjs.org/docs)
- [Postgres Installers](https://www.postgresql.org/download/)
- [Prisma Documentation](https://www.prisma.io/docs/)

To use Firebase, you'll need to install the Firebase CLI, login, and set the project to the one you want to use. You can do this by running the following commands:

```bash
npm i -g firebase-tools
firebase login
firebase use dev
```

You'll also need to create a few .env files. There are examples of these files in their respective directories. You can copy the example files and fill in the necessary information.

```bash
cp .env.example .env
cp apps/functions/.env.example apps/functions/.env
cp apps/web/.env.example apps/web/.env
```

To run the project, you'll need to install the dependencies, create the database, and start the development server.

```bash
npm install
npx prisma db push
npm run dev
```

You can also add some seed data and view it in Prisma Studio.

```bash
npx prisma db seed
npx prisma studio
```
