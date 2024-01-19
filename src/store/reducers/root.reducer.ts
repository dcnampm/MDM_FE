import { combineReducers } from 'redux';
import authReducer from 'store/slices/auth.slice';

const rootReducer = combineReducers({
  auth: authReducer,
  
});

export type AppState = ReturnType<typeof rootReducer>;

export default rootReducer;
