import axiosClient from './axiosClient';
import { GenericResponse, PageResponse } from 'types/commonResponse.type';
import {  CountEquipmentByDepartment, CountEquipmentByDepartmentAndStatus, CountEquipmentByDepartmentAndStatusDto, CountEquipmentByGroupAndCategory, StatisticDashboard } from '../types/statistics.type';
import { AxiosResponse } from 'axios';
import { AttachSupplyForm, EquipmentDto, EquipmentFullInfoDto, EquipmentImportExcelForm, EquipmentListDto, GetEquipmentsQueryParam, UpsertEquipmentForm } from '../types/equipment.type';
import { PageableRequest } from '../types/commonRequest.type';
import qs from 'qs';
import { createFormData, reducePageNumberByOne } from '../utils/globalFunc.util';
import { EquipmentSupplyUsageDto } from '../types/equipmentSupplyUsage.type';
import { blob } from 'stream/consumers';

const equipmentApi = {
  detail(id: number): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = `equipment/detail?id=${id}`;
    return axiosClient.get(url);
  },
  update(params: object): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = 'equipment/update';
    return axiosClient.patch(url, params);
  },
  delete(id: number): Promise<AxiosResponse<GenericResponse<any>>> { //OK
    const url = `equipments/${id}`;
    return axiosClient.delete(url);
  },
  search(params: any): Promise<AxiosResponse<GenericResponse<any>>> {
    for (let i in params) {
      if (!params[i]) {
        delete params[i];
      }
    }
    const paramString = new URLSearchParams(params).toString();
    const url = `equipment/search?${paramString}`;
    return axiosClient.get(url);
  },
  uploadExcel(params: any): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = 'equipment/create_by_excel';
    return axiosClient.post(url, params);
  },
  statisticDashboard(): Promise<AxiosResponse<GenericResponse<StatisticDashboard>>> {
    const url = 'statistics/dashboard';
    return axiosClient.get<GenericResponse<StatisticDashboard>, AxiosResponse<GenericResponse<StatisticDashboard>>>(url);
  },
  getEquipments(queryParams: GetEquipmentsQueryParam, pageable: PageableRequest): Promise<AxiosResponse<GenericResponse<PageResponse<EquipmentListDto>>>> {
    reducePageNumberByOne(pageable);
    const queryString = qs.stringify(queryParams) + '&' + qs.stringify(pageable, { encode: false, arrayFormat: 'repeat' });
    const url = `equipments?${queryString}`;
    return axiosClient.get(url);
  },
  importExcel(params: EquipmentImportExcelForm, file : any) {
    const url = 'equipments/excel/import';
    let formData = createFormData('equipment', params, 'file', [file]);
    return axiosClient.post(url, formData.form, formData.config);
  },
  exportExcel() {
    const url = 'equipments/excel/export';
    return axiosClient.get(url);
  },
  getEquipmentById(id: number): Promise<AxiosResponse<GenericResponse<EquipmentFullInfoDto>>> {
    const url = `equipments/${id}`;
    return axiosClient.get(url);
  },
  createEquipment(params: UpsertEquipmentForm, image: any): Promise<AxiosResponse<GenericResponse<EquipmentDto>>> {
    let formData = createFormData('equipment', params, 'image', [image]);
    const url = 'equipments';
    return axiosClient.post(url, formData.form, formData.config);
  },
  updateEquipment(equipmentId: number, params: UpsertEquipmentForm, image: any): Promise<AxiosResponse<GenericResponse<EquipmentDto>>> {
    let formData = createFormData('equipment', params, 'image', [image]);
    const url = `equipments/${equipmentId}`;
    return axiosClient.put(url, formData.form, formData.config);
  },
  statisticEquipments(queryParams: GetEquipmentsQueryParam,
                      pageable: PageableRequest): Promise<AxiosResponse<GenericResponse<PageResponse<EquipmentFullInfoDto>>>> {
    const queryString = qs.stringify(queryParams) + '&' + qs.stringify(pageable);
    const url = `equipments/statistics?${queryString}`;
    return axiosClient.get(url);
  }, attachSupply(form:AttachSupplyForm) :Promise<AxiosResponse<GenericResponse<EquipmentSupplyUsageDto>>>{
    const url = `equipments/attach-supplies`;
    return axiosClient.post(url, form);
  }


  ,statisticEquipmentByGroup(): Promise<AxiosResponse<GenericResponse<CountEquipmentByGroupAndCategory[]>>> {
    const url = "statistics/equipments/groups"
    return axiosClient.get(url);
  }
  ,statisticEquipmentByDepartmentAndStatus(): Promise<AxiosResponse<GenericResponse<CountEquipmentByDepartmentAndStatus[]>>> {
    const url = "statistics/equipments/departments/statuses"
    return axiosClient.get(url);
  }
  };

  export
  default equipmentApi;