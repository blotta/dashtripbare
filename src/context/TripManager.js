import { createContext, useContext, useReducer } from "react";

// Trip
export const initialState = {
  id: null, // string
  userId: null, // string
  created_at: null, // date
  finished_at: null, // date
  transport: null, //  { name: string, title: string, needVehicle: boolean, vehicle: Vehicle }
  origin: null, // location
  destination: null, // location
  currentCoords: null, // { lat: number, lng: number}
};

export const tripReducer = (prevState, action) => {
  // console.log('trip update', action);
  switch (action.type) {
    case "SET_ORIGIN":
      return {
        ...prevState,
        origin: action.payload,
      };
      break;
    case "SET_DESTINATION":
      return {
        ...prevState,
        destination: action.payload,
      };
      break;
    case "SET_CURRENT_COORDS":
      return {
        ...prevState,
        currentCoords: action.payload,
      };
      break;
    case "SET_TRANSPORT":
      return {
        ...prevState,
        transport: action.payload,
      };
      break;
    default:
      return prevState;
  }
};

export const TripContext = createContext();

export const TripProvider = ({ children }) => {
  const [trip, _dispatchTrip] = useReducer(tripReducer, initialState);

  const dispatchTrip = (type, payload) => {
    _dispatchTrip({type: type, payload: payload});
  }

  return (
    <TripContext.Provider value={{ trip, dispatchTrip }}>
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => useContext(TripContext);
