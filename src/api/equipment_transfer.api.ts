import axiosClient from './axiosClient';
import { GenericResponse, PageResponse } from 'types/commonResponse.type';
import { AxiosResponse } from 'axios';
import { AcceptTransferTicketForm, CreateTransferTicketForm, GetTransfersQueryParam, TransferListDto, TransferTicketFullInfoDto } from '../types/transfer.type';
import { createUrlWithQueryString, listLocalDateStringToIsoString } from '../utils/globalFunc.util';
import FormData from 'form-data';
import { PageableRequest } from '../types/commonRequest.type';
import qs from 'qs';
import { EquipmentListTransferDto, GetEquipmentsForTransferQueryParam } from '../types/equipment.type';

const equipmentTransferApi = {
  list(params: any): Promise<AxiosResponse<GenericResponse<any>>> {
    for (let i in params) {
      if (!params[i]) {
        delete params[i];
      }
    }
    const paramString = new URLSearchParams(params).toString();
    const url = `equipment_transfer/list?${paramString}`;
    return axiosClient.get(url);
  },
  transfer(params: object): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = 'equipment_transfer/transfer';
    return axiosClient.post(url, params);
  },
  approverTransfer(params: object): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = 'equipment_transfer/approver_transfer';
    return axiosClient.post(url, params);
  },
  detail(id: number): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = `equipment_transfer/detail?equipment_id=${id}`;
    return axiosClient.get(url);
  },
  createTransferTicket(equipmentId: number, params: CreateTransferTicketForm,
                       attachments: any[]): Promise<AxiosResponse<GenericResponse<TransferTicketFullInfoDto>>> {
    [params.createdDate, params.dateTransfer] = listLocalDateStringToIsoString([params.createdDate, params.dateTransfer]);
    const url = `/equipments/${equipmentId}/transfers`;
    let data = new FormData();
    data.append('createTransferTicketForm', new Blob([JSON.stringify(params)], { type: 'application/json' }));
    attachments.forEach(attachment => {
      data.append('attachments', attachment);
    });
    const config = {
      maxBodyLength: Infinity, headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    return axiosClient.post(url, data, config);
  },
  getTransferTicketDetail(equipmentId: number, transferId: number): Promise<AxiosResponse<GenericResponse<TransferTicketFullInfoDto>>> {
    const url = `equipments/${equipmentId}/transfers/${transferId}`;
    return axiosClient.get(url);
  },
  acceptTransferTicket(equipmentId: number, transferId: number,
                       params: AcceptTransferTicketForm): Promise<AxiosResponse<GenericResponse<TransferTicketFullInfoDto>>> {
    const url = `equipments/${equipmentId}/transfers/${transferId}/accept`;
    return axiosClient.put(url, params);
  },
  getTransferList(params: GetTransfersQueryParam, pageable: PageableRequest): Promise<AxiosResponse<GenericResponse<PageResponse<TransferListDto>>>> {
    const queryString = qs.stringify(params) + '&' + qs.stringify(pageable);
    const url = `equipments/transfers?${queryString}`;
    return axiosClient.get(url);
  },
  getAllTransferTicketsOfAnEquipment(equipmentId: number): Promise<AxiosResponse<GenericResponse<PageResponse<TransferListDto>>>> {
    const url = `equipments/${equipmentId}/transfers?size=1000`;
    return axiosClient.get(url);
  },
  //new api
  getAllEquipmentForTransfer(queryParams: GetEquipmentsForTransferQueryParam,
                                pageable: PageableRequest): Promise<AxiosResponse<GenericResponse<PageResponse<EquipmentListTransferDto>>>> {
    const url = createUrlWithQueryString('equipments/transfers', queryParams, pageable);
    return axiosClient.get(url);
  },
};

export default equipmentTransferApi;