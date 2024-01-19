import { EquipmentUnitDto, GetEquipmentUnitsQueryParam, UpsertEquipmentUnitForm } from '../types/equipmentUnit.type';
import { AxiosResponse } from 'axios';
import { GenericResponse, PageResponse } from '../types/commonResponse.type';
import axiosClient from './axiosClient';
import { createUrlWithQueryString } from '../utils/globalFunc.util';
import { PageableRequest } from '../types/commonRequest.type';

export const equipmentUnitApi = {
  createEquipmentUnit(form: UpsertEquipmentUnitForm): Promise<AxiosResponse<GenericResponse<EquipmentUnitDto>>> {
    return axiosClient.post('equipment-units', form);
  },
  updateEquipmentUnit(unitId: number, form: UpsertEquipmentUnitForm): Promise<AxiosResponse<GenericResponse<EquipmentUnitDto>>> {
    return axiosClient.put(`equipment-units/${unitId}`, form);
  },
  getEquipmentUnits(params: GetEquipmentUnitsQueryParam, pageable: PageableRequest): Promise<AxiosResponse<GenericResponse<PageResponse<EquipmentUnitDto>>>> {
    const url = createUrlWithQueryString('equipment-units', params, pageable);
    return axiosClient.get(url);
  },
  deleteEquipmentUnit(unitId: number) {
    return axiosClient.delete(`equipment-units/${unitId}`);
  },
};