import { GenericResponse, PageResponse } from 'types/commonResponse.type';
import { AxiosResponse } from 'axios';
import {
  AcceptMaintenanceTicketForm, CreateMaintenanceTicketForm, GetEquipmentsForMaintenanceQueryParam, MaintenanceTicketFullInfoDto, UpdateMaintenanceTicketForm,
} from '../types/maintenance.type';
import { PageableRequest } from '../types/commonRequest.type';
import { createFormData, createUrlWithQueryString } from '../utils/globalFunc.util';
import axiosClient from './axiosClient';
import { EquipmentListMaintenanceDto } from '../types/equipment.type';

const equipmentMaintenance = {
  getAllEquipmentForMaintenance(queryParams: GetEquipmentsForMaintenanceQueryParam,
                                pageable: PageableRequest): Promise<AxiosResponse<GenericResponse<PageResponse<EquipmentListMaintenanceDto>>>> {
    const url = createUrlWithQueryString('equipments/maintenances', queryParams, pageable);
    return axiosClient.get(url);
  },
  createMaintenanceTicket(createMaintenanceTicketForm: CreateMaintenanceTicketForm, equipmentId: number,
                          attachments: any[]): Promise<AxiosResponse<GenericResponse<MaintenanceTicketFullInfoDto>>> {
    const url = `equipments/${equipmentId}/maintenances`;
    const { form, config } = createFormData('createMaintenanceTicketForm', createMaintenanceTicketForm, 'attachments', attachments);
    return axiosClient.post(url, form, config);
  },
  acceptMaintenanceTicket(acceptMaintenanceTicketForm: AcceptMaintenanceTicketForm, equipmentId: number,
                          maintenanceTicketId: number): Promise<AxiosResponse<GenericResponse<MaintenanceTicketFullInfoDto>>> {
    const url = `equipments/${equipmentId}/maintenances/${maintenanceTicketId}/accept`;
    return axiosClient.put(url, acceptMaintenanceTicketForm);
  },
  getMaintenanceTicketDetail(equipmentId: number, maintenanceTicketId: number): Promise<AxiosResponse<GenericResponse<MaintenanceTicketFullInfoDto>>> {
    const url = `equipments/${equipmentId}/maintenances/${maintenanceTicketId}`;
    return axiosClient.get(url);
  },
  updateMaintenanceTicket(equipmentId: number, maintenanceTicketId: number, updateMaintenanceTicketForm: UpdateMaintenanceTicketForm,
                          attachments: any[]): Promise<AxiosResponse<GenericResponse<MaintenanceTicketFullInfoDto>>> {
    const url = `equipments/${equipmentId}/maintenances/${maintenanceTicketId}`;
    const { form, config } = createFormData('updateMaintenanceTicketForm', updateMaintenanceTicketForm, 'attachments', attachments);
    return axiosClient.put(url, form, config);
  },
};

export default equipmentMaintenance;