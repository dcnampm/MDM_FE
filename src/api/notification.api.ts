import axiosClient from './axiosClient';
import { GenericResponse, PageResponse } from 'types/commonResponse.type';
import { AxiosResponse } from 'axios';
import { PageableRequest } from '../types/commonRequest.type';
import qs from 'qs';
import { GetNotificationsQueryParams, Notification } from '../types/notification.type';
import { GetEquipmentsQueryParam } from 'types/equipment.type';
import { reducePageNumberByOne } from 'utils/globalFunc.util';

const notificationApi = {
  getNotifications(pageable: PageableRequest): Promise<AxiosResponse<GenericResponse<PageResponse<Notification<any>>>>> {
    const queryString = qs.stringify(pageable, { encode: false, arrayFormat: 'repeat' });
    const url = `notifications` + `?isDeleted=false` + `&${queryString}`;
    return axiosClient.get(url);
  }, 
  getNotificationsByEquipmentId(queryParams: GetNotificationsQueryParams,pageable: PageableRequest): Promise<AxiosResponse<GenericResponse<PageResponse<Notification<any>>>>> {
    reducePageNumberByOne(pageable);
    const queryString = qs.stringify(queryParams) + '&' + qs.stringify(pageable);
    const url = `notifications?${queryString}`;
    return axiosClient.get(url);
  }, 
  deleteNotificationById(id: number): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = `notifications/${id}`;
    return axiosClient.delete(url);
  },
};

export default notificationApi;