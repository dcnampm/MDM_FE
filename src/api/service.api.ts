import { ServiceDto, GetServicesQueryParam, UpsertServiceForm } from '../types/service.type';
import { PageableRequest } from '../types/commonRequest.type';
import { createUrlWithQueryString } from '../utils/globalFunc.util';
import axiosClient from './axiosClient';
import { AxiosResponse } from 'axios';
import { GenericResponse, PageResponse } from '../types/commonResponse.type';

const serviceApi = {
  getServices(getServicesQueryParam: GetServicesQueryParam,
                     pageable: PageableRequest): Promise<AxiosResponse<GenericResponse<PageResponse<ServiceDto>>>> {
    const url = createUrlWithQueryString('/services', getServicesQueryParam, pageable);
    return axiosClient.get(url);
  },getServiceById(id: number): Promise<AxiosResponse<GenericResponse<ServiceDto>>> {
    const url = `services/${id}`;
    return axiosClient.get(url);
  },
  createService(params: UpsertServiceForm): Promise<AxiosResponse<GenericResponse<ServiceDto>>> {
    const url = `services`;
    return axiosClient.post(url, params);
  },
  updateService(serviceId: number, params: UpsertServiceForm): Promise<AxiosResponse<GenericResponse<ServiceDto>>> {
    const url = `services/${serviceId}`;
    return axiosClient.put(url, params);
  },
  deleteService(serviceId: number): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = `services/${serviceId}`;
    return axiosClient.delete(url);
  },
};
export default serviceApi;
