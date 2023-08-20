export const LOGIN = "LOGIN"
export const AUTH_IS_READY = "AUTH_IS_READY"
export const SIGNUP = "SIGNUP"
export const PHONEAUTH = "PHONEAUTH"
export const UPDATE_LOCATION = "UPDATE_LOCATION"
export const UPDATE_ADDRESS = "UPDATE_ADDRESS"

export const MOBILE_AUTH = (result) => {
    return {
        type: PHONEAUTH,
        payload: {
          Number: result.user.phoneNumber,
        }
    }
}
export const LOCATION = (lat,lng) => {
  return {
    type: UPDATE_LOCATION,
    payload:{
      latitude: lat,
      longitude: lng
    }
  }
}
export const ADDRESS = ({ state,country,street_number,street_name,estate,lga,city }) => {
  return {
    type: UPDATE_ADDRESS,
    payload:{
      state, 
      country,
      street_number,
      street_name,
      city,
      estate,
      lga
    }
  }
}
export const LoginUser = ({ email,firstname,id,role,number,banned,lastname,address,customization }) => {
  return {
      type: LOGIN,
      payload: {
        email,
        displayName: firstname,
        id,
        role,
        number,
        banned,
        lastName:lastname,
        address:address,
        customization
      }
  }
}
export const SignupUser = ({ email,firstname,id,number,lastname,customization }) => {
    return {
        type: SIGNUP,
        payload: {
          id,
          email,
          displayName: firstname,
          role:'customer',
          banned:false,
          number,
          lastName:lastname,
          address: null,
          customization
        }
    }
}