import {
  AcceptInspectionTicketForm, CreateInspectionTicketForm, GetEquipmentsForInspectionQueryParam, InspectionTicketFullInfoDto, UpdateInspectionTicketForm,
} from '../types/equipmentInspection.type';
import { EquipmentListInspectionDto } from '../types/equipment.type';
import { GenericResponse, PageResponse } from '../types/commonResponse.type';
import { AxiosResponse } from 'axios';
import axiosClient from './axiosClient';
import { createFormData, createUrlWithQueryString } from '../utils/globalFunc.util';
import { PageableRequest } from '../types/commonRequest.type';

const equipmentInspectionApi = {
  getAllEquipmentForInspection(queryParams: GetEquipmentsForInspectionQueryParam,
                               pageable: PageableRequest): Promise<AxiosResponse<GenericResponse<PageResponse<EquipmentListInspectionDto>>>> {
    const url = createUrlWithQueryString('equipments/inspections', queryParams, pageable);
    return axiosClient.get(url);
  },
  createInspectionTicket(createInspectionTicketForm: CreateInspectionTicketForm,
                         equipmentId: number,
                         attachments: any[]): Promise<AxiosResponse<GenericResponse<InspectionTicketFullInfoDto>>> {
    const url = `equipments/${equipmentId}/inspections`;
    const { form, config } = createFormData('createInspectionTicketForm', createInspectionTicketForm, 'attachments', attachments);
    return axiosClient.post(url, form, config);
  },
  getInspectionTicketDetail(equipmentId: number, inspectionTicketId: number): Promise<AxiosResponse<GenericResponse<InspectionTicketFullInfoDto>>> {
    const url = `equipments/${equipmentId}/inspections/${inspectionTicketId}`;
    return axiosClient.get(url);
  },
  updateInspectionTicket(equipmentId: number,
                         inspectionTicketId: number,
                         updateInspectionTicketForm: UpdateInspectionTicketForm,
                         attachments: any[]): Promise<AxiosResponse<GenericResponse<InspectionTicketFullInfoDto>>> {
    const url = `equipments/${equipmentId}/inspections/${inspectionTicketId}`;
    const { form, config } = createFormData('updateInspectionTicketForm', updateInspectionTicketForm, 'attachments', attachments);
    return axiosClient.put(url, form, config);
  },
  acceptInspectionTicket(acceptInspectionTicketForm: AcceptInspectionTicketForm,
                         equipmentId: number,
                         inspectionTicketId: number): Promise<AxiosResponse<GenericResponse<InspectionTicketFullInfoDto>>> {
    const url = `equipments/${equipmentId}/inspections/${inspectionTicketId}/accept`;
    return axiosClient.put(url, acceptInspectionTicketForm);
  },
};
export default equipmentInspectionApi;