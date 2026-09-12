import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.petualangankode.rubina",
  appName: "Petualangan Kode Rubina",
  webDir: "dist",
  server: {
    androidScheme: "https",
    allowNavigation: ["petualangankode.rubina"],
  },
  android: {
    buildOptions: {
      signingType: "apksigner",
    },
    backgroundColor: "#FAFAFA",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      backgroundColor: "#FAFAFA",
      androidScaleType: "CENTER_CROP",
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: "LIGHT",
      backgroundColor: "#E85D75",
    },
  },
};

export default config;
