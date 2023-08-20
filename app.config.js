// import 'dotenv/config';

export default () => ({
  expo: {
    name: "blipmoore",
    slug: "blipmoore",
    version: "1.1.1",
    scheme:"blipmoore",
    orientation: "portrait",
    icon: "./assets/ic_launcher/1024.png",
    splash: {
      image: "https://f004.backblazeb2.com/file/blipmoore/app+images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    androidStatusBar:{
      translucent:true
    },
    updates: {
      "fallbackToCacheTimeout": 0
    },
    assetBundlePatterns: [
      "assets/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.blipmoore.blipmoore",
      googleServicesFile: "./GoogleService-Info.plist",
      buildNumber: "1.0.0"
    },
    android: {
      versionCode:12,
      useNextNotificationsApi: true,
      adaptiveIcon: {
        foregroundImage: "./assets/ic_launcher/1024.png",
        backgroundColor: "#000"
      },
      googleServicesFile: "./google-services.json",
      package: "com.blipmoore.blipmoore"
    },
    plugins: [
      "@react-native-firebase/app",
      "@notifee/react-native",
      "sentry-expo",
      [
        "expo-image-picker",
        {
          photosPermission: "The app accesses your photos to serve you better."
        }
      ],
      [
        "onesignal-expo-plugin",
        {
          mode: "development",
          iPhoneDeploymentTarget: '12.0',
        }
      ],
      [
        "expo-build-properties",
        {
          "android": {
            "compileSdkVersion": 31,
            "targetSdkVersion": 31,
            "buildToolsVersion": "31.0.0",
            "enableProguardInReleaseBuilds":false
          },
          "ios": {
            "deploymentTarget": "12.0",
            "useFrameworks": "static"
          }
        }
      ]
    ],
    extra: {
      "oneSignalAppId": "05491084-3b03-43ed-9ad9-d56d6906f653",
      VERIFY_NIN_LIVE_SECRET_KEY:process.env.VERIFY_NIN_LIVE_SECRET_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEyMTk1NywiZW52IjoidGVzdCIsImlhdCI6MTY1MTEyNzg0N30.v0Mk6Cm1OmrutJ868AjOorv9o90lMq_Bipv89hnlVrA',
      VERIFY_NIN_TEST_SECRET_KEY:process.env.VERIFY_NIN_TEST_SECRET_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEyMTk1NywiZW52IjoidGVzdCIsImlhdCI6MTY1MTEyNzg0N30.v0Mk6Cm1OmrutJ868AjOorv9o90lMq_Bipv89hnlVrA',
      STREAM_CHAT_API:process.env.STREAM_CHAT_API || null,
      URL:process.env.URL || 'http://192.168.100.12:19002',
      COMET_AUTH_KEY:process.env.COMET_AUTH_KEY || null,
      GOOGLE_MAPS_APIKEY:process.env.GOOGLE_MAPS_APIKEY || null,
      eas: {
        "projectId": "aac43e6e-d7ed-47ef-8a6d-2e3a271a6ccc",
        EAS_NO_VCS: process.env.EAS_NO_VCS || 1,
        STREAM_CHAT_API_KEY: process.env.STREAM_CHAT_API_KEY,
      },
    }
  }
})
