import { EquipmentGroupFullInfoDto, GetEquipmentGroupsQueryParam, UpsertEquipmentGroupForm } from '../types/equipmentGroup.type';
import { PageableRequest } from '../types/commonRequest.type';
import { createUrlWithQueryString } from '../utils/globalFunc.util';
import axiosClient from './axiosClient';
import { AxiosResponse } from 'axios';
import { GenericResponse, PageResponse } from '../types/commonResponse.type';
import { EquipmentGroupDto } from '../types/equipmentGroup.type';

const equipmentGroupApi = {
  getEquipmentGroups(getEquipmentGroupsQueryParam: GetEquipmentGroupsQueryParam,
                     pageable: PageableRequest): Promise<AxiosResponse<GenericResponse<PageResponse<EquipmentGroupFullInfoDto>>>> {
    const url = createUrlWithQueryString('/equipment-groups', getEquipmentGroupsQueryParam, pageable);
    return axiosClient.get(url);
  },getEquipmentGroupById(id: number): Promise<AxiosResponse<GenericResponse<EquipmentGroupDto>>> {
    const url = `equipment-groups/${id}`;
    return axiosClient.get(url);
  },
  createEquipmentGroup(params: UpsertEquipmentGroupForm): Promise<AxiosResponse<GenericResponse<EquipmentGroupDto>>> {
    const url = `equipment-groups`;
    return axiosClient.post(url, params);
  },
  updateEquipmentGroup(equipmentGroupId: number, params: UpsertEquipmentGroupForm): Promise<AxiosResponse<GenericResponse<EquipmentGroupDto>>> {
    const url = `equipment-groups/${equipmentGroupId}`;
    return axiosClient.put(url, params);
  },
  deleteEquipmentGroup(equipmentGroupId: number): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = `equipment-groups/${equipmentGroupId}`;
    return axiosClient.delete(url);
  },
};
export default equipmentGroupApi;