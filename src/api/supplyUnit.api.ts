import { AxiosResponse } from 'axios';
import { GenericResponse, PageResponse } from '../types/commonResponse.type';
import axiosClient from './axiosClient';
import { PageableRequest } from '../types/commonRequest.type';
import { createUrlWithQueryString } from '../utils/globalFunc.util';
import { GetSupplyUnitsQueryParam, SupplyUnitDto } from 'types/supplyUnit.type';
export const supplyUnitApi = {
  getSupplyUnits(queryParams: GetSupplyUnitsQueryParam,
                      pageable: PageableRequest): Promise<AxiosResponse<GenericResponse<PageResponse<SupplyUnitDto>>>> {
    const url = createUrlWithQueryString('supply-units', queryParams, pageable);
    return axiosClient.get(url);
  },
  getSupplyUnitById(id: number): Promise<AxiosResponse<GenericResponse<SupplyUnitDto>>> {
    const url = `supply-units/${id}`;
    return axiosClient.get(url);
  },
  createSupplyUnit(params: SupplyUnitDto): Promise<AxiosResponse<GenericResponse<SupplyUnitDto>>> {
    const url = `supply-units`;
    return axiosClient.post(url, params);
  },
  updateSupplyUnit(supplyUnitId: number, params: SupplyUnitDto): Promise<AxiosResponse<GenericResponse<SupplyUnitDto>>> {
    const url = `supply-units/${supplyUnitId}`;
    return axiosClient.put(url, params);
  },
  deleteSupplyUnit(supplyUnitId: number): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = `supply-units/${supplyUnitId}`;
    return axiosClient.delete(url);
  },
};
