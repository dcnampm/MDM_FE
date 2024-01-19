import axiosClient from './axiosClient';
import { GenericResponse } from 'types/commonResponse.type';
import authAxiosClient from './authAxiosClient';
import { TokenResponse } from '../types/tokenResponse.type';
import { ACCESS_TOKEN, GRANT_TYPE_PASSWORD } from '../constants/auth.constant';
import qs from 'qs';
import { AxiosResponse } from 'axios';
import { ChangePasswordForm, UserDetailDto } from '../types/user.type';
import { ConfirmResetPasswordForm, IntrospectTokenRequest, IntrospectTokenResponse } from '../types/auth.type';

const authApi = {
  login(params: object): Promise<TokenResponse> {
    const url = '/login';
    params = {
      ...params,
      grant_type: GRANT_TYPE_PASSWORD,
      // client_id: process.env.REACT_APP_CLIENT_ID_API_GATEWAY,
      // client_secret: process.env.REACT_APP_CLIENT_SECRET_API_GATEWAY,
    };
    let data = qs.stringify(params);
    let config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
    return authAxiosClient.post(url, data, config);
  }, register(params: object): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = 'auth/register';
    return axiosClient.post(url, params);
  }, active(params: object): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = 'auth/active';
    return axiosClient.post(url, params);
  }, changePassword(params: ChangePasswordForm): Promise<AxiosResponse<GenericResponse<UserDetailDto>>> {
    const url = 'users/current-user/change-password';
    return axiosClient.post(url, params);
  },
  //  logout(): Promise<AxiosResponse<GenericResponse<any>>> {
  //   const url = '/users/logout';
  //   return axiosClient.post(url);
  // },
   resetPassword(email: string): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = '/users/reset-password';
    const config = {
      headers: {
        'Content-Type': 'text/plain',
      },
    };
    return axiosClient.post(url, email, config);
  }, confirmResetPassword(params: ConfirmResetPasswordForm): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = 'users/reset-password/confirm';
    return axiosClient.post(url, params);
  }, introspectToken(): Promise<AxiosResponse<IntrospectTokenResponse>> {
    const url = '/protocol/openid-connect/token/introspect';
    const params: IntrospectTokenRequest = {
      client_id: process.env.REACT_APP_CLIENT_ID_API_GATEWAY || '',
      client_secret: process.env.REACT_APP_CLIENT_SECRET_API_GATEWAY || '',
      token: window.localStorage.getItem(ACCESS_TOKEN) || '',
    };
    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
    return authAxiosClient.post(url, qs.stringify(params), config);
  },
};

export default authApi;