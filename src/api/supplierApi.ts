import { SupplierFullInfoDto, GetSuppliersQueryParam, UpsertSupplierForm } from '../types/supplier.type';
import { PageableRequest } from '../types/commonRequest.type';
import { createUrlWithQueryString } from '../utils/globalFunc.util';
import axiosClient from './axiosClient';
import { AxiosResponse } from 'axios';
import { GenericResponse, PageResponse } from '../types/commonResponse.type';
import { SupplierDto } from '../types/supplier.type';

const supplierApi = {
  getSuppliers(getSuppliersQueryParam: GetSuppliersQueryParam,
                     pageable: PageableRequest): Promise<AxiosResponse<GenericResponse<PageResponse<SupplierFullInfoDto>>>> {
    const url = createUrlWithQueryString('/suppliers', getSuppliersQueryParam, pageable);
    return axiosClient.get(url);
  },getSupplierById(id: number): Promise<AxiosResponse<GenericResponse<SupplierDto>>> {
    const url = `suppliers/${id}`;
    return axiosClient.get(url);
  },
  createSupplier(params: UpsertSupplierForm): Promise<AxiosResponse<GenericResponse<SupplierDto>>> {
    const url = `suppliers`;
    return axiosClient.post(url, params);
  },
  updateSupplier(supplierId: number, params: UpsertSupplierForm): Promise<AxiosResponse<GenericResponse<SupplierDto>>> {
    const url = `suppliers/${supplierId}`;
    return axiosClient.put(url, params);
  },
  deleteSupplier(supplierId: number): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = `suppliers/${supplierId}`;
    return axiosClient.delete(url);
  },
};
export default supplierApi;
