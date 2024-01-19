import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import FilterContextProvider from 'contexts/filter.context';
import NotificationProvider from 'contexts/notification.context';
import { Spin } from 'antd';
import store from 'store/store';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

const root = ReactDOM.createRoot(document.getElementById('root') as Element);
root.render(
//  <React.StrictMode>
  <Provider store={store}>
    <Suspense fallback={<div className='spinner'><Spin size='large' tip='Loading...' /></div>}>
      <FilterContextProvider>
        <NotificationProvider>
            <I18nextProvider i18n={i18n} defaultNS={'translation'}>
              <App />
            </I18nextProvider>
        </NotificationProvider>
      </FilterContextProvider>
    </Suspense>
  </Provider>
// </React.StrictMode>
);