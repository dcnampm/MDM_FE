import axiosClient from './axiosClient';
import { GenericResponse, PageResponse } from 'types/commonResponse.type';
import { AxiosResponse } from 'axios';
import { PageableRequest } from '../types/commonRequest.type';
import {
  AcceptRepairTicketForm, CreateRepairTicketForm, GetEquipmentsForRepairQueryParam, RepairTicketFullInfoDto, UpdateRepairTicketForm,
} from '../types/repair.type';
import { createFormData, createUrlWithQueryString, listLocalDateStringToIsoString } from '../utils/globalFunc.util';
import FormData from 'form-data';
import { toast } from 'react-toastify';
import { fileApi } from './file.api';
import { EquipmentListRepairDto } from '../types/equipment.type';

const equipmentRepairApi = {
  getHistoryRepair(id: number): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = `equipment_repair/history_repair?id=${id}`;
    return axiosClient.get(url);
  },
  getRepairTicketDetailByEquipmentId(equipmentId: number): Promise<AxiosResponse<GenericResponse<RepairTicketFullInfoDto>>> {
    const url = `equipments/${equipmentId}/repairs`;
    return axiosClient.get(url);
  },
  downloadLatestRepairDocuments(equipmentId: number) {
    equipmentRepairApi.getRepairTicketDetailByEquipmentId(equipmentId).then((res) => {
      if (res.data.data.attachments?.length === 0) {
        toast.warning(`Không có tài liệu sửa chữa nào cho thiết bị [${res.data.data.equipment?.name}]`);
        return;
      }
      fileApi.downloadDocumentByListOfFileStorageDto(res.data.data.attachments as any[]);
    }).catch((err) => {
      toast.error('Lấy dữ liệu phiếu sửa chữa thất bại');
      console.log('error when fetching repair attachments data: ', err);
    });
  },
  updateRepairTicket(repairTicketId: number,
                     equipmentId: number,
                     params: UpdateRepairTicketForm,
                     attachments: any[]): Promise<AxiosResponse<GenericResponse<RepairTicketFullInfoDto>>> {
    [params.repairEndDate] = listLocalDateStringToIsoString([params.repairEndDate]);
    const url = `/equipments/${equipmentId}/repairs/${repairTicketId}/update`;
    let data = new FormData();
    data.append('updateRepairTicketForm', new Blob([JSON.stringify(params)], { type: 'application/json' }));
    attachments.forEach(attachment => {
      data.append('attachments', attachment);
    });
    const config = {
      maxBodyLength: Infinity, headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    return axiosClient.put(url, data, config);
  },
  acceptanceTesting(equipmentId: number, repairTicketId: number, attachments: any[]): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = `/equipments/${equipmentId}/repairs/${repairTicketId}/acceptance-testing`;
    let data = new FormData();
    attachments.forEach(attachment => {
      data.append('attachments', attachment);
    });
    const config = {
      maxBodyLength: Infinity, headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    return axiosClient.put(url, data, config);
  },
  getAllEquipmentForRepair(queryParams: GetEquipmentsForRepairQueryParam,
                           pageable: PageableRequest): Promise<AxiosResponse<GenericResponse<PageResponse<EquipmentListRepairDto>>>> {
    const url = createUrlWithQueryString('equipments/repairs', queryParams, pageable);
    return axiosClient.get(url);
  },
  createRepairTicket(createRepairTicketForm: CreateRepairTicketForm,
                     equipmentId: number,
                     attachments: any[]): Promise<AxiosResponse<GenericResponse<RepairTicketFullInfoDto>>> {
    const url = `equipments/${equipmentId}/repairs`;
    const { form, config } = createFormData('createRepairTicketForm', createRepairTicketForm, 'attachments', attachments);
    return axiosClient.post(url, form, config);
  },
  acceptRepairTicket(acceptRepairTicketForm: AcceptRepairTicketForm,
                     equipmentId: number,
                     repairTicketId: number): Promise<AxiosResponse<GenericResponse<RepairTicketFullInfoDto>>> {
    const url = `equipments/${equipmentId}/repairs/${repairTicketId}/accept`;
    return axiosClient.put(url, acceptRepairTicketForm);
  },
  getRepairTicketDetail(equipmentId: number, repairTicketId: number): Promise<AxiosResponse<GenericResponse<RepairTicketFullInfoDto>>> {
    const url = `equipments/${equipmentId}/repairs/${repairTicketId}`;
    return axiosClient.get(url);
  },
};

export default equipmentRepairApi;