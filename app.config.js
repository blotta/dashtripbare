module.exports = {
  expo: {
    name: "dashtripbare",
    slug: "dashtripbare",
    version: "1.0.0",
    assetBundlePatterns: ["**/*"],
    android: {
      permissions: [
        "ACCESS_COARSE_LOCATION",
        "ACCESS_FINE_LOCATION",
        "FOREGROUND_SERVICE",
      ],
      config: {
        googleMaps: {
          apiKey: "",
        },
      },
    },
    extra: {
      googleApiKey: process.env.GOOGLE_API_KEY
    }
  },
};
