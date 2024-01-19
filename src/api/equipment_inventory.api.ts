import axiosClient from './axiosClient';
import { GenericResponse } from 'types/commonResponse.type';
import { AxiosResponse } from 'axios';

const equipmentInventoryApi = {
  getListEquipmentsOfDepartment(params: any): Promise<AxiosResponse<GenericResponse<any>>> {
    for (let i in params) {
      if (!params[i]) {
        delete params[i];
      }
    }
    const paramString = new URLSearchParams(params).toString();
    const url = `equipment_inventory/list_equipments_of_department?${paramString}`;
    return axiosClient.get(url);
  },
  createInventoryNotes(params: any): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = 'equipment_inventory/create_inventory_notes';
    return axiosClient.post(url, params);
  },
  updateInventoryNote(params: any): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = 'equipment_inventory/update_inventory_note';
    return axiosClient.patch(url, params);
  },
  getInventoryInfo(equipment_id: any): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = `equipment_inventory/get_inventory_info?equipment_id=${equipment_id}`;
    return axiosClient.get(url);
  },
  approveInventoryNotes(params: any): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = 'equipment_inventory/approve_inventory_notes';
    return axiosClient.patch(url, params);
  },
  getHistoryInventoryOfDepartment(params: any): Promise<AxiosResponse<GenericResponse<any>>> {
    for (let i in params) {
      if (!params[i]) {
        delete params[i];
      }
    }
    const paramString = new URLSearchParams(params).toString();
    const url = `equipment_inventory/history_inventory_of_department?${paramString}`;
    return axiosClient.get(url);
  },
  getHistoryInventoryOfEquipment(params: any): Promise<AxiosResponse<GenericResponse<any>>> {
    for (let i in params) {
      if (!params[i]) {
        delete params[i];
      }
    }
    const paramString = new URLSearchParams(params).toString();
    const url = `equipment_inventory/history_inventory_of_equipment?${paramString}`;
    return axiosClient.get(url);
  },
}

export default equipmentInventoryApi;