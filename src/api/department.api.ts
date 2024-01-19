import axiosClient from './axiosClient';
import { GenericResponse, PageResponse } from 'types/commonResponse.type';
import { AxiosResponse } from 'axios';
import { DepartmentFullInfoDto, GetDepartmentsQueryParam, UpsertDepartmentForm } from '../types/department.type';
import { PageableRequest } from '../types/commonRequest.type';
import { createUrlWithQueryString } from '../utils/globalFunc.util';

const departmentApi = {
  create(params: object): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = 'department/create';
    return axiosClient.post(url, params);
  },
  detail(id: number): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = `department/detail?id=${id}`;
    return axiosClient.get(url);
  },
  update(params: object): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = 'department/update';
    return axiosClient.put(url, params);
  },
  search(params: any): Promise<AxiosResponse<GenericResponse<any>>> {
    for (let i in params) {
      if (!params[i]) {
        delete params[i];
      }
    }
    const paramString = new URLSearchParams(params).toString();
    const url = `department/search?${paramString}`;
    return axiosClient.get(url);
  },
  getDepartments(queryParams: GetDepartmentsQueryParam,
                 pageable: PageableRequest): Promise<AxiosResponse<GenericResponse<PageResponse<DepartmentFullInfoDto>>>> {
    const url = createUrlWithQueryString('departments', queryParams, pageable);
    return axiosClient.get(url);
  },
  getDepartmentById(id: number): Promise<AxiosResponse<GenericResponse<DepartmentFullInfoDto>>> {
    const url = `departments/${id}`;
    return axiosClient.get(url);
  },
  createDepartment(params: UpsertDepartmentForm): Promise<AxiosResponse<GenericResponse<DepartmentFullInfoDto>>> {
    const url = `departments`;
    return axiosClient.post(url, params);
  },
  updateDepartment(departmentId: number, params: UpsertDepartmentForm): Promise<AxiosResponse<GenericResponse<DepartmentFullInfoDto>>> {
    const url = `departments/${departmentId}`;
    return axiosClient.put(url, params);
  },
  deleteDepartment(departmentId: number): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = `departments/${departmentId}`;
    return axiosClient.delete(url);
  },
};

export default departmentApi;