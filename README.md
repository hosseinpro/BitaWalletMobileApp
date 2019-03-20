# BitaWalletMobileApp

## Enable live reload on Android device

Simulator: CTRL + M
Device: adb shell input keyevent 82

## Generating the release APK

$ cd android
$ ./gradlew assembleRelease
output: android/app/build/outputs/apk/release/app-release.apk

Test:
\$ react-native run-android --variant=release

Debug:
react-native log-android
