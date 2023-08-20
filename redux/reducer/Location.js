import React from 'react';
import * as actions from '../actions/actions';

export default function LocationReducer(state = {latitudeDelta: 0.0012,longitudeDelta: 0.002},action) {
    switch (action.type) {
      case actions.UPDATE_LOCATION:
        return {
          ...state,latitude:action.payload.latitude,longitude:action.payload.longitude
        }
      case actions.UPDATE_ADDRESS:
        return{
          ...state,
          state:action.payload.state,
          street_number:action.payload.street_number,
          street_name:action.payload.street_name,
          city:action.payload.city,
          lga: action.payload.lga,
          estate:action.payload.estate,
          country:action.payload.country
        }
      default:
        return state;
  }
}
