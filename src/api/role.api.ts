import axiosClient from './axiosClient';
import { GenericResponse, PageResponse } from 'types/commonResponse.type';
import { AxiosResponse } from 'axios';
import { GetRolesQueryParam, RoleFullInfoDto, UpsertRoleForm } from '../types/role.type';
import { createUrlWithQueryString } from '../utils/globalFunc.util';
import { PageableRequest } from '../types/commonRequest.type';

const roleApi = {
  getRoles(params: GetRolesQueryParam, pageable: PageableRequest): Promise<AxiosResponse<GenericResponse<PageResponse<RoleFullInfoDto>>>> {
    const url = createUrlWithQueryString('roles', params, pageable);
    return axiosClient.get(url);
  }, deleteRoleById(id: number): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = `roles/${id}`;
    return axiosClient.delete(url);
  }, createRole(form: UpsertRoleForm): Promise<AxiosResponse<GenericResponse<RoleFullInfoDto>>> {
    const url = `roles`;
    return axiosClient.post(url, form);
  }, getRoleById(id: number): Promise<AxiosResponse<GenericResponse<RoleFullInfoDto>>> {
    const url = `roles/${id}`;
    return axiosClient.get(url);
  },updateRole(id: number, form: UpsertRoleForm): Promise<AxiosResponse<GenericResponse<RoleFullInfoDto>>> {
    const url = `roles/${id}`;
    return axiosClient.put(url, form);
  }
};

export default roleApi;