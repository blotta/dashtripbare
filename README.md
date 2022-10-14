# DashTripApp

## Configuration

### Firebase

Add Firebase config: `android/app/google-services.json`

### Google Maps and Places API

Add Google API key to `android/app/src/main/AndroidManifest.xml`

```xml
<application android:name=".MainApplication" android:label="@string/app_name" android:icon="@mipmap/ic_launcher" android:roundIcon="@mipmap/ic_launcher_round" android:allowBackup="false" android:theme="@style/AppTheme" android:usesCleartextTraffic="true">
    ...
    <meta-data android:name="com.google.android.geo.API_KEY" android:value="Your Google API key"/>
    ...
</application>
```

And also on `app.config.js` on `expo.android.config.googleMaps.apiKey`

## Start

Run `yarn android`
