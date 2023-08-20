import React from 'react';
import * as actions from '../actions/actions';

export default function CleanerOrderReducer(state = {active:false,orderId:null,address:null,number:null},action) {
    switch (action.type) {
      case 'CLEANER_ORDER':
        return {
          ...state,
          orderId:action.payload.orderId,
          active:action.payload.active,
          number:action.payload.number,
          address:action.payload.address,
        }    
      default:
        return state;
  }
}
