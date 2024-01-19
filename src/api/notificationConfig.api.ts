import { GenericResponse } from '../types/commonResponse.type';
import { AxiosResponse } from 'axios';
import axiosClient from './axiosClient';
import { NotificationConfigFullInfoDto, UpdateNotificationConfigForm } from '../types/notificationConfig.type';

export const notificationConfigApi = {
  getNotificationConfigs(): Promise<AxiosResponse<GenericResponse<NotificationConfigFullInfoDto[]>>> {
    const url = 'notification-configs';
    return axiosClient.get(url);
  }, updateNotificationConfig(params: UpdateNotificationConfigForm[]): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = 'notification-configs';
    return axiosClient.post(url, params);
  },
};