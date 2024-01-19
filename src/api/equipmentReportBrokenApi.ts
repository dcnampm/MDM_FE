import {
  AcceptReportBrokenTicketForm, CreateReportBrokenTicketForm, GetEquipmentsForReportBrokenQueryParam, ReportBrokenTicketFullInfoDto,
} from '../types/reportBroken.type';
import { AxiosResponse } from 'axios';
import { GenericResponse, PageResponse } from '../types/commonResponse.type';
import { createFormData, createUrlWithQueryString } from '../utils/globalFunc.util';
import axiosClient from './axiosClient';
import { toast } from 'react-toastify';
import { fileApi } from './file.api';
import { FileStorageDto } from '../types/fileStorage.type';
import { EquipmentListReportBrokenDto } from '../types/equipment.type';
import { PageableRequest } from '../types/commonRequest.type';

export const equipmentReportBrokenApi = {
  getDetail(equipmentId: number): Promise<AxiosResponse<GenericResponse<ReportBrokenTicketFullInfoDto>>> {
    const url = `equipments/${equipmentId}/report-broken`;
    return axiosClient.get(url);
  },
  downloadLatestReportBrokenDocuments(equipmentId: number) {
    equipmentReportBrokenApi.getDetail(equipmentId).then((res) => {
      if (res.data.data.attachments?.length === 0) {
        toast.warning(`Không có tài liệu báo hỏng nào cho thiết bị [${res.data.data.equipment?.name}]`);
        return;
      }
      fileApi.downloadDocumentByListOfFileStorageDto(res.data.data.attachments as FileStorageDto[] | undefined);
    }).catch((err) => {
      toast.error('Lấy dữ liệu phiếu báo hỏng thất bại');
      console.log('error when fetching report broken data: ', err);
    });
  },
  getAllEquipmentForReportBroken(queryParams: GetEquipmentsForReportBrokenQueryParam,
                                 pageable: PageableRequest): Promise<AxiosResponse<GenericResponse<PageResponse<EquipmentListReportBrokenDto>>>> {
    const url = createUrlWithQueryString('equipments/report-broken', queryParams, pageable);
    return axiosClient.get(url);
  },
  createReportBrokenTicket(createReportBrokenTicketForm: CreateReportBrokenTicketForm,
                       equipmentId: number,
                       attachments: any[]): Promise<AxiosResponse<GenericResponse<ReportBrokenTicketFullInfoDto>>> {
    const url = `equipments/${equipmentId}/report-broken`;
    const { form, config } = createFormData('createReportBrokenTicketForm', createReportBrokenTicketForm, 'attachments', attachments);
    return axiosClient.post(url, form, config);
  },
  acceptReportBrokenTicket(acceptReportBrokenTicketForm: AcceptReportBrokenTicketForm,
                       equipmentId: number,
                       reportBrokenTicketId: number): Promise<AxiosResponse<GenericResponse<ReportBrokenTicketFullInfoDto>>> {
    const url = `equipments/${equipmentId}/report-broken/${reportBrokenTicketId}/accept`;
    return axiosClient.put(url, acceptReportBrokenTicketForm);
  },
  getReportBrokenTicketDetail(equipmentId: number, reportBrokenTicketId: number): Promise<AxiosResponse<GenericResponse<ReportBrokenTicketFullInfoDto>>> {
    const url = `equipments/${equipmentId}/report-broken/${reportBrokenTicketId}`;
    return axiosClient.get(url);
  },
};