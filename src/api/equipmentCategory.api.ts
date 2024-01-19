import {
  EquipmentCategoryDto, EquipmentCategoryFullInfoDto, GetEquipmentCategoriesQueryParam, UpsertEquipmentCategoryForm,
} from '../types/equipmentCategory.type';
import { PageableRequest } from '../types/commonRequest.type';
import { AxiosResponse } from 'axios';
import { GenericResponse, PageResponse } from '../types/commonResponse.type';
import axiosClient from './axiosClient';
import { createUrlWithQueryString } from '../utils/globalFunc.util';

export const equipmentCategoryApi = {
  getEquipmentCategories(getEquipmentCategoriesQueryParam: GetEquipmentCategoriesQueryParam,
                         pageable: PageableRequest): Promise<AxiosResponse<GenericResponse<PageResponse<EquipmentCategoryFullInfoDto>>>> {
    const url = createUrlWithQueryString('/equipment-categories', getEquipmentCategoriesQueryParam, pageable);
    return axiosClient.get(url);
  }, getEquipmentCategoryById(id: number): Promise<AxiosResponse<GenericResponse<EquipmentCategoryDto>>> {
    const url = `equipment-categories/${id}`;
    return axiosClient.get(url);
  }, createEquipmentCategory(params: UpsertEquipmentCategoryForm): Promise<AxiosResponse<GenericResponse<EquipmentCategoryDto>>> {
    const url = `equipment-categories`;
    return axiosClient.post(url, params);
  }, updateEquipmentCategory(equipmentCategoryId: number, params: UpsertEquipmentCategoryForm): Promise<AxiosResponse<GenericResponse<EquipmentCategoryDto>>> {
    const url = `equipment-categories/${equipmentCategoryId}`;
    return axiosClient.put(url, params);
  }, deleteEquipmentCategory(equipmentCategoryId: number): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = `equipment-categories/${equipmentCategoryId}`;
    return axiosClient.delete(url);
  },
};