import { View, Text } from "react-native";
import React from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { TextInput } from "react-native-paper";

import Constants from "expo-constants";

function googlePlaceToAppLocation(data, details) {
  const ac = details.address_components;
  let location = {
    description: data.description,
    formatted_address: details.formatted_address,
    address: {
      streetNumber: ac.find((c) => c.types.includes("street_number"))?.short_name,
      street: ac.find((c) => c.types.includes("route"))?.short_name,
      subregion: ac.find((c) => c.types.includes("sublocality_level_1"))?.short_name,
      city: ac.find((c) => c.types.includes("administrative_area_level_2"))?.short_name,
      region: ac.find((c) => c.types.includes("administrative_area_level_1"))?.short_name,
      country: ac.find((c) => c.types.includes("country"))?.long_name,
      isoCountryCode: ac.find((c) => c.types.includes("country"))?.short_name,
      postalCode: ac.find((c) => c.types.includes("postal_code"))?.short_name,
    },
    coords: {
      lat: details.geometry.location.lat,
      lng: details.geometry.location.lng,
    },
    geometry: details.geometry,
  };

  location = JSON.parse(JSON.stringify(location));
  return location;
}

export default function AddressSearch({ placeholder, onPress }) {
  return (
    <GooglePlacesAutocomplete
      placeholder={placeholder ? placeholder : "Endereço"}
      fetchDetails={true}
      onPress={(data, details) => {
        const pos = googlePlaceToAppLocation(data, details);
        console.log("gmaps_pos", JSON.stringify(pos, null, 2));
        onPress(pos);
      }}
      onNotFound={() => {
        console.log("not found");
      }}
      onFail={(err) => console.log(err)}
      query={{
        key: Constants.expoConfig.android.config.googleMaps.apiKey
      }}
      textInputProps={{
        InputComp: TextInput,
      }}
      styles={{
        container: { flex: 0 },
      }}
    />
  );
}
