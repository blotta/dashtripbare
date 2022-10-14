import { createContext, useContext, useReducer } from "react";

// Trip
export const initialState = {
  id: null, // string
  userId: null, // string
  created_at: null, // date
  finished_at: null, // date
  status: "created", // string -> created, started, finished
  transport: null, //  { name: string, title: string, needVehicle: boolean, vehicle: Vehicle }
  origin: null, // location
  destination: null, // location
  currentCoords: null, // { lat: number, lng: number}
};

export const tripReducer = (prevState, action) => {
  let newState;
  switch (action.type) {
    case "SET_ORIGIN":
      newState = {
        ...prevState,
        origin: action.payload,
      };
      break;
    case "SET_DESTINATION":
      newState = {
        ...prevState,
        destination: action.payload,
      };
      break;
    case "SET_CURRENT_COORDS":
      newState = {
        ...prevState,
        currentCoords: action.payload,
      };
      break;
    case "SET_TRANSPORT":
      newState = {
        ...prevState,
        transport: action.payload,
      };
      break;
    case "START_TRIP":
      newState = {
        ...prevState,
        id: action.payload.id,
        created_at: action.payload.created_at,
        status: action.payload.status,
        // vvvvv: action.payload.vvvvv
      };
      break;
    case "FINISH":
      newState = {
        ...prevState,
        ...action.payload,
      };
      break;
    case "RESET":
      newState = initialState;
      break;
    default:
      newState = newState;
  }
  console.log("trip update", action.type);
  console.log(JSON.stringify(newState, null, 2));
  return newState;
};

export const TripContext = createContext();

export const TripProvider = ({ children }) => {
  const [trip, _dispatchTrip] = useReducer(tripReducer, initialState);

  const dispatchTrip = (type, payload) => {
    _dispatchTrip({ type: type, payload: payload });
  };

  return (
    <TripContext.Provider value={{ trip, dispatchTrip }}>
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => useContext(TripContext);

// region
export const calcRegion = (trip) => {
  const ret = {
    latitude: -23.56387116203152,
    longitude: -46.65244831533241,
    latitudeDelta: 0.02,
    longitudeDelta: 0.01,
  };
  if (trip.origin && trip.destination) {
    let o = trip.origin.coords;
    let d = trip.destination.coords;
    ret.latitude = (o.lat + d.lat) / 2;
    ret.longitude = (o.lng + d.lng) / 2;
    ret.latitudeDelta = Math.abs(o.lat - d.lat) + 0.01;
    ret.longitudeDelta = Math.abs(o.lng - d.lng) + 0.01;
  } else if (trip.origin) {
    ret.latitude = trip.origin.coords.lat;
    ret.longitude = trip.origin.coords.lng;
  } else if (trip.destination) {
    ret.latitude = trip.destination.coords.lat;
    ret.longitude = trip.destination.coords.lng;
  } else if (trip.currentCoords) {
    ret.latitude = trip.currentCoords.lat;
    ret.longitude = trip.currentCoords.lng;
  }
  return ret;
};

export const tripMarkers = (trip) => {
  const ret = [];
  if (trip.origin) {
    ret.push({
      id: "origin",
      title: "Origem",
      coords: {
        latitude: trip.origin.coords.lat,
        longitude: trip.origin.coords.lng,
      },
    });
  }
  if (trip.destination) {
    ret.push({
      id: "destination",
      title: "Destino",
      coords: {
        latitude: trip.destination.coords.lat,
        longitude: trip.destination.coords.lng,
      },
    });
  }
  return ret;
};

export const consolidateEvents = (events) => {
  const idleMs = events.filter(e => e.idle).reduce((acc, curr) => {
    return acc + curr.msSinceLast;
  }, 0)
  const maxSpeedMps = events.reduce((acc, curr) => {
    return acc.speed > curr.speed ? acc.speed : curr.speed;
  }, 0)

  return {
    idleMs,
    maxSpeedMps
  }
}