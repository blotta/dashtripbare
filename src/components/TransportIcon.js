import { View } from 'react-native'
import React from 'react'
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { useTheme } from '@react-navigation/native';

export function iconNameForTrasport(trans) {
  let iconName = '';
  switch (trans) {
    case 'Bicycle':
      iconName = 'bicycle'
      break;
    case 'PublicTransport':
      iconName = 'train-car-passenger'
      break;
    case 'Legs':
      iconName = 'walk'
      break;
    case 'Motorcycle':
      iconName = 'motorbike'
      break;
    case 'Car':
    default:
      iconName = 'car-estate'
  }
  return iconName;
}

export default function TransportIcon({transportType = 'Car', size = 20, color = null }) {
  const theme = useTheme();
  const iconName = iconNameForTrasport(transportType);

  return (
    <MaterialCommunityIcons name={iconName} size={size} color={color || theme.colors.primary} />
  )
}