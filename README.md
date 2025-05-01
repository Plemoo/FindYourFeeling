## About the App

This App is intended to help you identify your current feelings


## Get started with Expo

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```
or

   ```bash
    npm run start
   ```

3. Steps to Production
   
   As long as the App runs on the Emulator or the Phone through the expo app, no prebuild is necessary. But once it is tested for production always prebuild it
   
4. Prebuild the app (Android/iOS Package will be created new since the --clean Flag is provided)

   ```bash
    npm run prebuild
   ```
5. Test app on android or iOS

   ```bash
    npm run android
   ```
   ```bash
    npm run ios
   ```

6. Everything works, App is ready to be build

   ```bash
    npm run build
   ```

   The build and stacktrace is found online via expo.dev

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).


## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.