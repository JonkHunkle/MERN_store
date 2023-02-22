import { EDIT_PRODUCT, SET_PRODUCT } from '../utils/actions';


// Notice we moved the initial state object from our ProductComponent to the reducer itself
const initialState = {
  product: {
    name:'',
    type:'',
    quantity:0,
    onHold:false
  }
}

// Here we pass a default value of initialState if none is provided
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
