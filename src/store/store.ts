import { routerMiddleware } from 'connected-react-router';
import { applyMiddleware, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { history } from 'utils/history.util';
import rootReducer from './reducers/root.reducer';
import rootSaga from './sagas/root.saga';

const composeEnhancers =
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const sagaMiddleware = createSagaMiddleware();

const configureStore = () => {
  const store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(sagaMiddleware, routerMiddleware(history)))
  );
  sagaMiddleware.run(rootSaga);
  return store;
};

const store = configureStore();

export default store;
