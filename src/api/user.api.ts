import axiosClient from './axiosClient';
import { GenericResponse, PageResponse } from 'types/commonResponse.type';
import { GetUsersQueryParam, UpsertUserForm, UserDetailDto } from '../types/user.type';
import { AxiosResponse } from 'axios';
import FormData from 'form-data';
import { PageableRequest } from '../types/commonRequest.type';
import qs from 'qs';
import { createFormData, localDateStringToIsoString } from '../utils/globalFunc.util';

const userApi = {
  currentLoggedInUserDetail(): Promise<AxiosResponse<GenericResponse<UserDetailDto>>> {
    const url = 'users/current-user';
    return axiosClient.get(url);
  }, updateProfile(params: UpsertUserForm, image: any): Promise<AxiosResponse<GenericResponse<UserDetailDto>>> {
    const url = 'users/current-user';
    params.birthday = localDateStringToIsoString(params?.birthday);
    let data = new FormData();
    data.append('user', new Blob([JSON.stringify(params)], { type: 'application/json' }));
    data.append('image', image);
    const config = {
      maxBodyLength: Infinity, headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    return axiosClient.post(url, data, config);
  }, getUsers(queryParams: GetUsersQueryParam, pageable: PageableRequest): Promise<AxiosResponse<GenericResponse<PageResponse<UserDetailDto>>>> {
    let params = qs.stringify(queryParams) + '&' + qs.stringify(pageable);
    const url = `users?${params}`;
    return axiosClient.get(url);
  }, getUserById(id: number): Promise<AxiosResponse<GenericResponse<UserDetailDto>>> {
    const url = `users/${id}`;
    return axiosClient.get(url);
  }, createUser(params: UpsertUserForm, image: any): Promise<AxiosResponse<GenericResponse<UserDetailDto>>> {
    let formData = createFormData('user', params, 'image', [image]);
    const url = 'users/create-user';
    return axiosClient.post(url, formData.form, formData.config);
  }, updateUser(userId: number, params: UpsertUserForm, image: any): Promise<AxiosResponse<GenericResponse<UserDetailDto>>> {
    let formData = createFormData('user', params, 'image', [image]);
    const url = `users/${userId}`;
    return axiosClient.put(url, formData.form, formData.config);
  }, deleteUser(userId: number): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = `users/${userId}`;
    return axiosClient.delete(url);
  },
};

export default userApi;