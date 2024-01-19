import axios, { AxiosError, AxiosResponse } from 'axios';
import { ACCESS_TOKEN, REFRESH_TOKEN } from 'constants/auth.constant';
import { GenericResponse } from '../types/commonResponse.type';
import { showErrorToast } from '../utils/globalFunc.util';
import { resolve } from 'path';
import { reject } from 'lodash';
import { toast } from 'react-toastify';

const getLocalToken = () => {
  return window.localStorage.getItem(ACCESS_TOKEN);
};

const getRefreshToken = () => {
  return window.localStorage.getItem(REFRESH_TOKEN);
};

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_BASE_API_URL,
});

axiosClient.interceptors.request.use((config: any) => {
  const customHeaders: any = {};

  const accessToken = getLocalToken();
  if (accessToken) {
    customHeaders.Authorization = `Bearer ${accessToken}`;
  }

  return {
    ...config, headers: {
      ...customHeaders, // auto attach token
      ...config.headers, // but you can override for some requests
    },
  };
}, function(error) {
  return Promise.reject(error);
});

const callRequestRefreshToken = async () => {
  const refreshToken = getRefreshToken();
    console.log("get refresh token");
    const refresh = await axiosClient.post('/auth/refresh-token', {},
      {
        headers: {
          'Authorization': `Bearer ${refreshToken}`
        }
      })
    return refresh;  
}; 

// Add a response interceptor
// axiosClient.interceptors.response.use(createAxiosResponseInterceptor);
axiosClient.interceptors.response.use(async (response: any) => {
  return response;
}, async (axiosError: AxiosError<GenericResponse<any>>) => {
  const originalRequest: any = axiosError.config;
  if (axiosError.response?.data.data === "refresh-token") {
    return Promise.reject(axiosError);
  }
  if (!axiosError.response?.data.success && axiosError.response?.status === 401) { 
    try {
      const res: any = await callRequestRefreshToken();
      window.localStorage.setItem(ACCESS_TOKEN, res.data.data.access_token);
      window.localStorage.setItem(REFRESH_TOKEN, res.data.data.refresh_token);
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + res.data.data.access_token;
      originalRequest.headers['Authorization'] = 'Bearer ' + res.data.data.access_token;
      return axiosClient(originalRequest);
    } catch (err) {
      console.log(err);
      window.localStorage.removeItem(ACCESS_TOKEN);
      window.location.href = '/signin';
      return Promise.reject(err);
    }
  } else {
    console.log(axiosError);
    toast.error(axiosError.response?.data.message);
    // window.localStorage.removeItem(ACCESS_TOKEN);
    // window.location.href = '/signin';
    return Promise.reject(axiosError);
  }
}
)





// let isRetry: Boolean = true;
// let requestRefreshToken: any = null;

// axiosClient.interceptors.response.use(async (response: any) => {
//   const originalRequest: any = response.config;
//   if (!response.data.success && response.status === 401  && isRetry) {
//     try {
//       isRetry = false;
//       requestRefreshToken = requestRefreshToken || callRequestRefreshToken();
//       const res: any = await requestRefreshToken;
//       requestRefreshToken = null;
//       console.log(res);
//       window.localStorage.setItem(ACCESS_TOKEN, res.data.data.access_token);
//       axios.defaults.headers.common['Authorization'] = 'Bearer ' + res.data.data.access_token;
//       originalRequest.headers['Authorization'] = 'Bearer ' + res.data.data.access_token;
//       isRetry = true;
//       return axiosClient(originalRequest);
//     } catch (err) {
//       console.log(err);
//       window.localStorage.removeItem(ACCESS_TOKEN);
//       window.location.href = '/signin';
//       return Promise.reject(err);
//     }
//   } else {
//     return response;
//   }
// })
// ,(axiosError: AxiosError<GenericResponse<any>>) => {
//   console.log("axiosClient.ts - axiosError: ", axiosError);
//   if (axiosError.response?.status === 401) {
//     window.localStorage.removeItem(ACCESS_TOKEN);
//     window.location.href = '/signin';
//     return Promise.reject(axiosError);
//   }
//   showErrorToast(axiosError);
//   return Promise.reject(axiosError);
// };
export default axiosClient;
