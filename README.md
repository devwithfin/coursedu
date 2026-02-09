# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start both Expo servers + the backends

   ```bash
   npm run start
   ```

   This command launches the new **coursedu-project** hub on port **8080**, automatically boots the
   existing **group1/app-expo** project on port **8081**, starts the **group1/app-backend** Nodemon
   server, and also launches the **group5** Expo app on port **8085** plus its backend on port
   **3004**.
   Use `npm run start:root`, `npm run start:group1`, `npm run start:backend`,
   `npm run start:group5`, or `npm run start:group5:backend` if you need to run any environment in
   isolation.

In the output, you'll find options to open the coursedu hub in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Linked Apps

- **Group 1**  
  Expo app: `group1/app-expo` (port **8081**). Backend: `group1/app-backend` (port from `.env`, defaults
  to **3000**). The launcher at port 8080 includes a card that links to `http://localhost:8081`.

- **Group 5**  
  Expo app: `group5/frontend` (port **8085**). Backend: `group5/backend` (port **3004** by default).
  A second card on the launcher links to `http://localhost:8085`, and the frontend expects the API at
  `http://localhost:3004` unless `EXPO_PUBLIC_GROUP5_API_URL` is set.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
