import axiosClient from './axiosClient';
import { GenericResponse } from 'types/commonResponse.type';
import { AxiosResponse } from 'axios';

const categoryApi = {
  //EquipmentGroup Api
  listGroup(page: number): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = `category/group/list?page=${page}`;
    return axiosClient.get(url);
  },
  createGroup(params: object): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = 'category/group/create';
    return axiosClient.post(url, params);
  },
  detailGroup(id: number): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = `category/group/detail?id=${id}`;
    return axiosClient.get(url);
  },
  updateGroup(params: object): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = 'category/group/update';
    return axiosClient.put(url, params);
  },
  deleteGroup(id: number): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = 'category/group/delete';
    return axiosClient.delete(url, {
      data: { id }
    });
  },
  searchGroup(name: string): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = `category/group/search?name=${name}`;
    return axiosClient.get(url);
  },

  //EquipmentCategory
  listType(page: number): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = `category/type/list?page=${page}`;
    return axiosClient.get(url);
  },
  listTypeBaseGroup(group_id: number): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = `category/type/list_base_group?group_id=${group_id}`;
    return axiosClient.get(url);
  },
  createType(params: object): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = 'category/type/create';
    return axiosClient.post(url, params);
  },
  detailType(id: number): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = `category/type/detail?id=${id}`;
    return axiosClient.get(url);
  },
  updateType(params: object): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = 'category/type/update';
    return axiosClient.put(url, params);
  },
  deleteType(id: number): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = 'category/type/delete';
    return axiosClient.delete(url, {
      data: { id }
    });
  },
  searchType(name: string): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = `category/type/search?name=${name}`;
    return axiosClient.get(url);
  },

  //EquipmentUnit
  listUnit(): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = 'category/unit/list';
    return axiosClient.get(url);
  },
  createUnit(params: object): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = 'category/unit/create';
    return axiosClient.post(url, params);
  },
  detailUnit(id: number): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = `category/unit/detail?id=${id}`;
    return axiosClient.get(url);
  },
  updateUnit(params: object): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = 'category/unit/update';
    return axiosClient.put(url, params);
  },
  deleteUnit(id: number): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = 'category/unit/delete';
    return axiosClient.delete(url, {
      data: { id }
    });
  },
  searchUnit(name: string): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = `category/unit/search?name=${name}`;
    return axiosClient.get(url);
  },

  //Equipment_Status
  listStatus(): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = 'category/status/list';
    return axiosClient.get(url);
  },
  createStatus(params: object): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = 'category/status/create';
    return axiosClient.post(url, params);
  },
  detailStatus(id: number): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = `category/status/detail?id=${id}`;
    return axiosClient.get(url);
  },
  updateStatus(params: object): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = 'category/status/update';
    return axiosClient.put(url, params);
  },
  deleteStatus(id: number): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = 'category/status/delete';
    return axiosClient.delete(url, {
      data: { id }
    });
  },
  searchStatus(name: string): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = `category/status/search?name=${name}`;
    return axiosClient.get(url);
  },

  //Repair_Status
  listRepairStatus(): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = 'category/repair_status/list';
    return axiosClient.get(url);
  },
  createRepairStatus(params: object): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = 'category/repair_status/create';
    return axiosClient.post(url, params);
  },

  //Suplly_Type API
  listSypplyType(): Promise<AxiosResponse<GenericResponse<any>>> {
    const url = 'category/supplies_type/list';
    return axiosClient.get(url);
  },
}

export default categoryApi;