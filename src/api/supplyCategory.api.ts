import { AxiosResponse } from 'axios';
import { GenericResponse, PageResponse } from '../types/commonResponse.type';
import axiosClient from './axiosClient';
import { PageableRequest } from '../types/commonRequest.type';
import { createUrlWithQueryString } from '../utils/globalFunc.util';
import { GetSupplyCategoriesQueryParam, SupplyCategoryDto, UpsertSupplyCategoryForm } from '../types/supply.type';
export const supplyCategoryApi = {
  getSupplyCategories(queryParams: GetSupplyCategoriesQueryParam,
                 pageable: PageableRequest): Promise<AxiosResponse<GenericResponse<PageResponse<SupplyCategoryDto>>>> {
    const url = createUrlWithQueryString('supply-categories', queryParams, pageable);
    return axiosClient.get(url);
  },
  getSupplyCategoryById(id: number): Promise<AxiosResponse<GenericResponse<SupplyCategoryDto>>> {
    const url = `supply-categories/${id}`;
    return axiosClient.get(url);
  },
  createSupplyCategory(params: UpsertSupplyCategoryForm): Promise<AxiosResponse<GenericResponse<SupplyCategoryDto>>> {
    const url = `supply-categories`;
    return axiosClient.post(url, params);
  },
  updateSupplyCategory(supplyCategoryId: number, params: UpsertSupplyCategoryForm): Promise<AxiosResponse<GenericResponse<SupplyCategoryDto>>> {
    const url = `supply-categories/${supplyCategoryId}`;
    return axiosClient.put(url, params);
  },
  deleteSupplyCategory(supplyCategoryId: number): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = `supply-categories/${supplyCategoryId}`;
    return axiosClient.delete(url);
  },
};
