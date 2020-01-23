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

## ios device

npm install -g ios-sim
ios-sim showdevicetypes
ios-sim start --devicetypeid "iPhone-8, 13.3"

npm install -g ios-deploy
react-native run-ios
react-native run-ios --device

### if could not find iPhone X simulator

install iPhone X
edit this file:
node_modules/react-native/local-cli/runIOS/findMatchingSimulator.js
!version.includes('iOS')
simulator.isAvailable !== 'YES' &&
simulator.isAvailable !== true

edit this file:
node_modules/react-native/React/Base/RCTModuleMethod.mm
return RCTReadString(input, "**attribute**((unused))") ||
RCTReadString(input, "**attribute**((**unused**))") ||
RCTReadString(input, "\_\_unused");

### Add NFC to iOS

open .xcodeproj in Xcode. Select the project. Select Target. Goto Signing & Capabilities tab. Select a Team. Add Capability. Select NFC (requires Apple Developer Licence). (Add .entitlement)

select info.plist
Add an item to ISO7816. Write AID of the applet.
Add Row for "Privacy - NFC Scan Usage Description" with Value "XebaWallet"

### Patched to work for iOS

/Users/hossein/Code/BitaWalletMobileApp/node_modules/react-native/React/Base/RCTBridgeModule.h
