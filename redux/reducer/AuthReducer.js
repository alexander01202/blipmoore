import * as actions from '../actions/actions';

export default function AuthReducer(state = {AuthIsReady:null},action) {
    switch (action.type) {
      case actions.LOGIN:
        return {
          ...state,
          id:action.payload.id,
          email:action.payload.email,
          displayName:action.payload.displayName,
          lastName:action.payload.lastName,
          AuthIsReady:true,
          role: action.payload.role,
          address:action.payload.address,
          number:action.payload.number,
          banned:action.payload.banned,
          agentId: null,
          AgentCacNumber: null,
          customization:action.payload.customization
        }
      case actions.SIGNUP:
        return {
          ...state,
          id:action.payload.id,
          email:action.payload.email,
          displayName:action.payload.displayName,
          lastName:action.payload.lastName,
          address:action.payload.address,
          AuthIsReady:true,
          role: action.payload.role,
          number:action.payload.number,
          banned:action.payload.banned,
          customization:action.payload.customization
        }
      case actions.AUTH_IS_READY:
        return {
          ...state,
          AuthIsReady: action.isLogin,
        }
      case 'UPDATE_USER':
        return{
          ...state,
          email:action.payload.email,
          displayName:action.payload.displayName,
          lastName:action.payload.lastname,
        }
      // case 'UPDATE_ADDRESS':
      //   return{
      //     ...state,
      //     address:action.payload.address
      //   }
      case 'CHANGE_ROLE':
        return{
          ...state,
          role:action.payload.role
        }      
      case 'REGISTER_AGENT':
        return{
          ...state,
          role:action.payload.role,
          agentId:action.payload.agentId,
          AgentCacNumber:action.payload.AgentCacNumber
        }  
      default:
        return state;
  }
}
