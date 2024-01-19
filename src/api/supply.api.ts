import axiosClient from './axiosClient';
import { GenericResponse, PageResponse } from 'types/commonResponse.type';
import { AxiosResponse } from 'axios';
import { GetSupplyQueryParam, SupplyFullInfoDto, UpsertSupplyForm } from '../types/supply.type';
import { PageableRequest } from '../types/commonRequest.type';
import { createUrlWithQueryString } from '../utils/globalFunc.util';

const supplyApi = {
  getSupplies(queryParams: GetSupplyQueryParam,
                 pageable: PageableRequest): Promise<AxiosResponse<GenericResponse<PageResponse<SupplyFullInfoDto>>>> {
    const url = createUrlWithQueryString('supplies', queryParams, pageable);
    return axiosClient.get(url);
  },
  getSupplyById(id: number): Promise<AxiosResponse<GenericResponse<SupplyFullInfoDto>>> {
    const url = `supplies/${id}`;
    return axiosClient.get(url);
  },
  createSupply(params: UpsertSupplyForm): Promise<AxiosResponse<GenericResponse<SupplyFullInfoDto>>> {
    const url = `supplies`;
    return axiosClient.post(url, params);
  },
  updateSupply(supplyId: number, params: UpsertSupplyForm): Promise<AxiosResponse<GenericResponse<SupplyFullInfoDto>>> {
    const url = `supplies/${supplyId}`;
    return axiosClient.put(url, params);
  },
  deleteSupply(supplyId: number): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = `supplies/${supplyId}`;
    return axiosClient.delete(url);
  },
}

export default supplyApi;