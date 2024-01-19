import axiosClient from './axiosClient';
import { GenericResponse, PageResponse } from 'types/commonResponse.type';
import { AxiosResponse } from 'axios';
import { DepartmentFullInfoDto } from '../types/department.type';

const filterApi = {
  getStatusEquipmentApi(): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = 'category/status/list';
    return axiosClient.get(url);
  },
  getGroupEquipmentApi(): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = 'category/group/list';
    return axiosClient.get(url);
  },
  getTypeEquipmentApi(): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = 'category/type/list';
    return axiosClient.get(url);
  },
  getDepartmentApi(): Promise<AxiosResponse<GenericResponse<PageResponse<DepartmentFullInfoDto>>>> {
    const url = 'departments?size=10000';
    return axiosClient.get(url);
  },
  getCycleProceduceApi (): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = '/get_all_cycle_procedure';
    return axiosClient.get(url);
  },
  getServiceApi (): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = 'service/list';
    return axiosClient.get(url);
  },
  getAllRoleApi (): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = 'role/list';
    return axiosClient.get(url);
  },
  getAllUnitApi (): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = 'category/unit/list';
    return axiosClient.get(url);
  },
  getAllRiskLevelApi (): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = 'category/risk_level/list';
    return axiosClient.get(url);
  },
  getProviderApi(): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = 'provider/list';
    return axiosClient.get(url);
  },
}    

export default filterApi;