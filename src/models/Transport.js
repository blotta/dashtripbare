import theme from '../config/theme'
export const TRANSPORTS = [
  {
    name: "Legs",
    title: "Andando",
    needVehicle: false,
  },
  {
    name: "PublicTransport",
    title: "Transporte Público",
    needVehicle: false,
  },
  {
    name: "Car",
    title: "Carro",
    needVehicle: true,
  },
  {
    name: "Motorcycle",
    title: "Moto",
    needVehicle: true,
  },
  {
    name: "Bicycle",
    title: "Bicicleta",
    needVehicle: true,
  },
];

export function transportKeysAll() {
  return TRANSPORTS.map(t => t.name);
}

export function titleForTransport(key) {
  return TRANSPORTS.find((i) => i.name == key).title || "Transporte";
}

export function colorForTransport(key) {
  switch (key) {
    case "Car":
      return theme.colors.primary;
      break;
    case "Motorcycle":
      return theme.colors.secondary;
      break;
    case "Bicycle":
      return theme.colors.tertiary;
      break;
    case "PublicTransport":
      return theme.colors.error;
      break;
    case "Legs":
    default:
      return theme.colors.onPrimaryContainer;
      break;
  }
}