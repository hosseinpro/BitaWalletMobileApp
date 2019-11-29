# BitaWalletMobileApp

## Enable live reload on Android device

Simulator: CTRL + M
Device: adb shell input keyevent 82

## Updated Android files

android/app/src/main/AndroidManifest.xml
android/app/src/main/java/com/bitawalletmobileapp/MainApplication.java
android/gradle.properties
android/app/build.gradle
.babelrc

## Generating the release APK

$ cd android
$ ./gradlew assembleRelease
output: android/app/build/outputs/apk/release/app-release.apk

Test:
$ cd ..
\$ react-native run-android --variant=release

Logging Debug:
code: Console.log("")
react-native run-android
react-native log-android
