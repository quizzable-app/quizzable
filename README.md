## Getting Started

This project is a starting point for a Firebase application using Next.js and a Postgres database. Here are a few resources to help get you started:

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase CLI Documentation](https://firebase.google.com/docs/cli)
- [Next.js Documentation](https://nextjs.org/docs)
- [Postgres Installers](https://www.postgresql.org/download/)
- [Prisma Documentation](https://www.prisma.io/docs/)

### Developing with GitHub Codespaces

To get started developing the app with GitHub Codespaces, select `New with options...` from the Codespaces tab, as described in the [About recommended secrets](https://docs.github.com/en/codespaces/setting-up-your-project-for-codespaces/configuring-dev-containers/specifying-recommended-secrets-for-a-repository?utm_source=pocket_saves#about-recommended-secrets) section of the documentation. This will prompt you to enter some environment variables, which will be used to configure the Firebase project. The environment variables only need to be entered once.

Once the Codespace is successfully created and configured, run the following commands to login to Firebase use the correct project:

```bash
firebase login
firebase use dev
```

After you've logged in to Firebase and selected the correct project, you can start the development server with the following command:

```bash
npm run dev
```
