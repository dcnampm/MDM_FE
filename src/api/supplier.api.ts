import { GetSuppliersQueryParam, SupplierFullInfoDto } from '../types/supplier.type';
import axiosClient from './axiosClient';
import qs from 'qs';
import { PageableRequest } from '../types/commonRequest.type';
import { AxiosResponse } from 'axios';
import { GenericResponse, PageResponse } from '../types/commonResponse.type';

export const supplierApi = {
  getSuppliers(params: GetSuppliersQueryParam, pageable: PageableRequest): Promise<AxiosResponse<GenericResponse<PageResponse<SupplierFullInfoDto>>>> {
    const queryString = qs.stringify(params) + '&' + qs.stringify(pageable);
    const url = `suppliers?${queryString}`;
    return axiosClient.get(url);
  },
};