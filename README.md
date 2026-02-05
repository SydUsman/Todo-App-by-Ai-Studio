
# ZenTask - Modern Todo Mobile App

A clean, native-feeling task manager built with React, TypeScript, and Gemini AI.

## Features
- ✨ **AI Breakdown**: Let Gemini split a big task into manageable steps.
- 🌓 **Dark Mode**: Smooth transitions between light and dark themes.
- 📱 **Mobile-First**: Optimized for iOS/Android gesture feel.
- 💾 **Persistence**: Tasks stay saved in your browser.

## How to turn this into an Android APK

Since this is a web-based React app, you have two primary options for APK generation:

### Option 1: Capacitor (Recommended)
Capacitor is the modern replacement for Cordova and works seamlessly with React.
1. Install Capacitor: `npm install @capacitor/core @capacitor/cli @capacitor/android`
2. Initialize: `npx cap init ZenTask com.zentask.app --web-dir dist`
3. Build your React app: `npm run build`
4. Add Android platform: `npx cap add android`
5. Copy your build: `npx cap copy`
6. Open in Android Studio: `npx cap open android`
7. From Android Studio, select **Build > Build Bundle(s) / APK(s) > Build APK(s)**.

### Option 2: Trusted Web Activity (TWA)
Perfect if you want a lightweight "wrapper" for your PWA.
1. Use [Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap) CLI.
2. Run `bubblewrap init --manifest=https://your-deployed-app.com/manifest.json`.
3. Run `bubblewrap build` to generate the APK.

### Option 3: Progressive Web App (PWA)
For most users, an APK isn't necessary. ZenTask is PWA-ready.
1. Open the URL in Chrome on Android.
2. Tap the three dots and select **"Install App"**.
3. It will appear on your home screen with its own icon and splash screen, behaving exactly like a native app.
