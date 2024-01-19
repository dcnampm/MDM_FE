import equipmentApi from 'api/equipment.api';

const searchByStatus = async (name: string, param: string, page: number) => {
  return await equipmentApi.search({
    name,
    status_id: param,
    page
  });
}

const searchByDepartment = async (name: string, param: string, page: number) => {
  return await equipmentApi.search({
    name,
    department_id: param,
    page
  });
}

const searchByRiskLevel = async (name: string, param: string, page: number) => {
  return await equipmentApi.search({
    name,
    risk_level: param,
    page
  });
}

const searchByEquipmentType = async (name: string, param: string, page: number) => {
  return await equipmentApi.search({
    name,
    type_id: param,
    page
  });
}

const searchByYearInUse = async (name: string, param: string, page: number) => {
  return await equipmentApi.search({
    name,
    year_in_use: param,
    page
  });
}

const searchByYearOfManufacture = async (name: string, param: string, page: number) => {
  return await equipmentApi.search({
    name,
    year_of_manufacture: param,
    page
  });
}

const searchByQueryObject: any = {
  status_id: searchByStatus,
  department_id: searchByDepartment,
  risk_level: searchByRiskLevel,
  type_id: searchByEquipmentType,
  year_in_use: searchByYearInUse,
  year_of_manufacture: searchByYearOfManufacture
}

export const searchByQuery = (name: string, param: any, page: number, param_string: string) => {
  return searchByQueryObject[param_string](name, param, page);
}