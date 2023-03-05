import { EDIT_PRODUCT, SET_PRODUCT } from '../utils/actions';


const initialState = {
  product: {
    name:'',
    type:'',
    quantity:0,
    onHold:false
  }
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_PRODUCT: {
      if(action.payload ===null) {
        return state
      }
      else return state.product = action.payload
      
    }
    case EDIT_PRODUCT: {
      console.log(action)
      const {prop, value} = action.variables
      console.log(state.product.name)
      return {...state.product[prop]=value} 
    }
    default: {
      return state;
    }
  }
}
