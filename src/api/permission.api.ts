import axiosClient from './axiosClient';
import { GenericResponse } from 'types/commonResponse.type';
import { AxiosResponse } from 'axios';

const permissionApi = {
  create(params: object): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = 'permission/create';
    return axiosClient.post(url, params);
  },
  createGroup(params: object): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = 'permission/create_group';
    return axiosClient.post(url, params);
  },
  list(): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = 'permission/list';
    return axiosClient.get(url);
  },
  updatePermissionForRole(params: object): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = 'permission/update_permisison_for_role';
    return axiosClient.put(url, params);
  }
}

export default permissionApi;