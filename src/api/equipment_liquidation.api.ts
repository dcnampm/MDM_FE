import axiosClient from './axiosClient';
import { GenericResponse, PageResponse } from 'types/commonResponse.type';
import { AxiosResponse } from 'axios';
import { PageableRequest } from '../types/commonRequest.type';
import { EquipmentListLiquidationDto } from '../types/equipment.type';
import { createFormData, createUrlWithQueryString } from '../utils/globalFunc.util';
import {
  AcceptLiquidationTicketForm, CreateLiquidationTicketForm, GetEquipmentsForLiquidationQueryParam, LiquidationTicketFullInfoDto,
} from '../types/equipmentLiquidation.type';

const equipmentLiquidationApi = {
  getListUnusedEquipment(params: any): Promise<AxiosResponse<GenericResponse<any>>> {
    for (let i in params) {
      if (!params[i]) {
        delete params[i];
      }
    }
    const paramString = new URLSearchParams(params).toString();
    const url = `equipment_liquidation/list_unused_equipment?${paramString}`;
    return axiosClient.get(url);
  },
  createLiquidationNote(params: object): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = 'equipment_liquidation/create_liquidation_note';
    return axiosClient.post(url, params);
  },
  getLiquidationDetail(id: number): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = `equipment_liquidation/get_liquidation_detail?id=${id}`;
    return axiosClient.get(url);
  },
  approveLiquidationNote(params: object): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = 'equipment_liquidation/approve_liquidation_note';
    return axiosClient.post(url, params);
  },getAllEquipmentForLiquidation(queryParams: GetEquipmentsForLiquidationQueryParam,
                                 pageable: PageableRequest): Promise<AxiosResponse<GenericResponse<PageResponse<EquipmentListLiquidationDto>>>> {
    const url = createUrlWithQueryString('equipments/liquidations', queryParams, pageable);
    return axiosClient.get(url);
  },
  createLiquidationTicket(createLiquidationTicketForm: CreateLiquidationTicketForm,
                         equipmentId: number,
                         attachments: any[]): Promise<AxiosResponse<GenericResponse<LiquidationTicketFullInfoDto>>> {
    const url = `equipments/${equipmentId}/liquidations`;
    const { form, config } = createFormData('createLiquidationTicketForm', createLiquidationTicketForm, 'attachments', attachments);
    return axiosClient.post(url, form, config);
  },
  getLiquidationTicketDetail(equipmentId: number, liquidationTicketId: number): Promise<AxiosResponse<GenericResponse<LiquidationTicketFullInfoDto>>> {
    const url = `equipments/${equipmentId}/liquidations/${liquidationTicketId}`;
    return axiosClient.get(url);
  },
  acceptLiquidationTicket(acceptLiquidationTicketForm: AcceptLiquidationTicketForm,
                         equipmentId: number,
                         liquidationTicketId: number): Promise<AxiosResponse<GenericResponse<LiquidationTicketFullInfoDto>>> {
    const url = `equipments/${equipmentId}/liquidations/${liquidationTicketId}/accept`;
    return axiosClient.put(url, acceptLiquidationTicketForm);
  },
}

export default equipmentLiquidationApi;