import axiosClient from './axiosClient';
import { GenericResponse, PageResponse } from 'types/commonResponse.type';
import { AxiosResponse } from 'axios';
import { AcceptHandoverTicketForm, CreateHandoverTicketForm, GetEquipmentsForHandoverQueryParam, HandoverTicketFullInfoDto } from '../types/handover.type';
import FormData from 'form-data';
import { createFormData, createUrlWithQueryString, localDateStringToIsoString } from '../utils/globalFunc.util';
import { toast } from 'react-toastify';
import { fileApi } from './file.api';
import { PageableRequest } from '../types/commonRequest.type';
import { EquipmentListHandoverDto } from '../types/equipment.type';
import { FileStorageDto } from '../types/fileStorage.type';

const equipmentHandoverApi = {
  handoverEquipment(params: object): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = 'equipment_handover/handover';
    return axiosClient.post(url, params);
  },
  sendEmailHandoverReport(params: object): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = 'equipment_handover/send_email_handover_report';
    return axiosClient.post(url, params);
  },
  getListHandoverEquipment(page: number, name: string, department_id: any, handover_date: any): Promise<AxiosResponse<GenericResponse<any>>> {
    let params: any = {
      name, department_id, handover_date,
    };
    for (let i in params) {
      if (!params[i]) {
        delete params[i];
      }
    }
    const paramString = new URLSearchParams(params).toString();
    const url = `equipment_handover/list/handover?page=${page}&${paramString}`;
    return axiosClient.get(url);
  },
  getHandoverInfo(id: number): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = `equipment_handover/handover_info?id=${id}`;
    return axiosClient.get(url);
  },
  createHandover(params: CreateHandoverTicketForm, handoverDocuments: any[]): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = 'equipments/handovers';
    params.handoverDate = localDateStringToIsoString(params.handoverDate);
    let data = new FormData();
    data.append('createHandoverForm', new Blob([JSON.stringify(params)], { type: 'application/json' }));
    handoverDocuments.forEach(handoverDocument => {
      data.append('documents', handoverDocument);
    });
    const config = {
      maxBodyLength: Infinity, headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    return axiosClient.post(url, data, config);
  },
  getHandoverDetail(equipmentId: number): Promise<AxiosResponse<GenericResponse<HandoverTicketFullInfoDto>>> {
    const url = `equipments/${equipmentId}/handovers`;
    return axiosClient.get(url);
  },
  acceptHandover(handoverId: number, acceptHandoverForm: AcceptHandoverTicketForm): Promise<AxiosResponse<GenericResponse<HandoverTicketFullInfoDto>>> {
    const url = `/equipments/handovers/${handoverId}/accept`;
    return axiosClient.put(url, acceptHandoverForm);
  },
  downloadLatestHandoverDocuments(equipmentId: number) {
    equipmentHandoverApi.getHandoverDetail(equipmentId).then((res) => {
      if (res.data.data.attachments?.length === 0) {
        toast.warning(`Không có tài liệu bàn giao nào cho thiết bị [${res.data.data.equipment?.name}]`);
        return;
      }
      fileApi.downloadDocumentByListOfFileStorageDto(res.data.data.attachments as FileStorageDto[]);
    }).catch((err) => {
      toast.error('Lấy dữ liệu bàn giao thất bại');
      console.log('error when fetching handover data: ', err);
    });
  },
  getAllEquipmentForHandover(queryParams: GetEquipmentsForHandoverQueryParam,
                             pageable: PageableRequest): Promise<AxiosResponse<GenericResponse<PageResponse<EquipmentListHandoverDto>>>> {
    const url = createUrlWithQueryString('equipments/handovers', queryParams, pageable);
    return axiosClient.get(url);
  },createHandoverTicket(createHandoverTicketForm: CreateHandoverTicketForm, equipmentId: number,
                            attachments: any[]): Promise<AxiosResponse<GenericResponse<HandoverTicketFullInfoDto>>> {
    const url = `equipments/${equipmentId}/handovers`;
    const { form, config } = createFormData('createHandoverTicketForm', createHandoverTicketForm, 'attachments', attachments);
    return axiosClient.post(url, form, config);
  },
  acceptHandoverTicket(acceptHandoverTicketForm: AcceptHandoverTicketForm, equipmentId: number,
                          handoverTicketId: number): Promise<AxiosResponse<GenericResponse<HandoverTicketFullInfoDto>>> {
    const url = `equipments/${equipmentId}/handovers/${handoverTicketId}/accept`;
    return axiosClient.put(url, acceptHandoverTicketForm);
  },
  getHandoverTicketDetail(equipmentId: number, handoverTicketId: number): Promise<AxiosResponse<GenericResponse<HandoverTicketFullInfoDto>>> {
    const url = `equipments/${equipmentId}/handovers/${handoverTicketId}`;
    return axiosClient.get(url);
  }
};

export default equipmentHandoverApi;