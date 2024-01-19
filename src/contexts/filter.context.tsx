import React, { createContext, useEffect, useState } from 'react';
import { ACCESS_TOKEN, CURRENT_USER } from 'constants/auth.constant';
import { DepartmentFullInfoDto } from '../types/department.type';
import { AxiosResponse } from 'axios';
import { GenericResponse, PageResponse } from '../types/commonResponse.type';
import { EquipmentCategoryListDto } from '../types/equipmentCategory.type';
import departmentApi from '../api/department.api';
import { equipmentCategoryApi } from '../api/equipmentCategory.api';
import { supplierApi } from '../api/supplier.api';
import { SupplierFullInfoDto } from '../types/supplier.type';
import { EquipmentGroupFullInfoDto } from '../types/equipmentGroup.type';
import equipmentGroupApi from '../api/equipmentGroup.api';
import { equipmentUnitApi } from '../api/equipmentUnit.api';
import { EquipmentUnitDto } from '../types/equipmentUnit.type';
import { ProjectDto } from '../types/project.type';
import { projectApi } from '../api/project.api';
import { RoleFullInfoDto } from '../types/role.type';
import roleApi from '../api/role.api';
import { SupplyCategoryDto } from '../types/supply.type';
import { SupplyUnitDto } from '../types/supplyUnit.type';
import { supplyCategoryApi } from '../api/supplyCategory.api';
import { supplyUnitApi } from '../api/supplyUnit.api';
import { ServiceDto } from '../types/service.type';
import serviceApi from '../api/service.api';

interface FilterContextData {
  statuses: Array<object>[];
  departments: DepartmentFullInfoDto[];
  equipmentGroups: EquipmentGroupFullInfoDto[];
  types: Array<object>[];
  cycles: Array<object>[];
  services: ServiceDto[];
  roles: RoleFullInfoDto[];
  equipmentUnits: EquipmentUnitDto[];
  levels: Array<object>[];
  providers: SupplierFullInfoDto[];
  user: any;
  equipmentCategories: EquipmentCategoryListDto[];
  projects: ProjectDto[];
  supplyCategories: SupplyCategoryDto[];
  supplyUnits: SupplyUnitDto[];
}

export const FilterContext = createContext<FilterContextData>({
  statuses: [],
  departments: [],
  equipmentGroups: [],
  types: [],
  cycles: [],
  services: [],
  roles: [],
  equipmentUnits: [],
  levels: [],
  providers: [],
  user: {},
  equipmentCategories: [],
  projects: [],
  supplyCategories: [],
  supplyUnits: [],
});

interface FilterContextProps {
  children: React.ReactNode;
}

const FilterContextProvider: React.FC<FilterContextProps> = ({ children }) => {
  const [statuses, setStatuses] = useState([]);
  const [departments, setDepartments] = useState<DepartmentFullInfoDto[]>([]);
  const [equipmentGroups, setEquipmentGroups] = useState<EquipmentGroupFullInfoDto[]>([]);
  const [types, setTypes] = useState([]);
  const [cycles, setCycles] = useState([]);
  const [services, setServices] = useState<ServiceDto[]>([]);
  const [roles, setRoles] = useState<RoleFullInfoDto[]>([]);
  const [equipmentUnits, setEquipmentUnits] = useState<EquipmentUnitDto[]>([]);
  const [levels, setLevels] = useState([]);
  const [providers, setProviders] = useState<SupplierFullInfoDto[]>([]);
  const [equipmentCategories, setEquipmentCategories] = useState<EquipmentCategoryListDto[]>([]);
  const [projects, setProjects] = useState<ProjectDto[]>([]);
  const [supplyCategories, setSupplyCategories] = useState<SupplyCategoryDto[]>([]);
  const [supplyUnits, setSupplyUnits] = useState<SupplyUnitDto[]>([]);
  const access_token: any = localStorage.getItem(ACCESS_TOKEN);
  const user: any = JSON.parse(localStorage.getItem(CURRENT_USER) || '{}');

  const getAllFilter = async () => {
    await Promise.all([
      departmentApi.getDepartments({}, { size: 10000 }),
      equipmentCategoryApi.getEquipmentCategories({}, { size: 10000 }),
      supplierApi.getSuppliers({}, { size: 10000 }),
      equipmentGroupApi.getEquipmentGroups({}, { size: 10000 }),
      equipmentUnitApi.getEquipmentUnits({}, { size: 10000 }),
      projectApi.getProjects({}, { size: 10000 }),
      roleApi.getRoles({}, { size: 10000 }),
      supplyCategoryApi.getSupplyCategories({}, { size: 10000 }),
      supplyUnitApi.getSupplyUnits({}, { size: 10000 }),
      serviceApi.getServices({}, { size: 10000 }),
    ])
      .then((res: [
        AxiosResponse<GenericResponse<PageResponse<DepartmentFullInfoDto>>>, AxiosResponse<GenericResponse<PageResponse<EquipmentCategoryListDto>>>, AxiosResponse<GenericResponse<PageResponse<SupplierFullInfoDto>>>, AxiosResponse<GenericResponse<PageResponse<EquipmentGroupFullInfoDto>>>, AxiosResponse<GenericResponse<PageResponse<EquipmentUnitDto>>>, AxiosResponse<GenericResponse<PageResponse<ProjectDto>>>, AxiosResponse<GenericResponse<PageResponse<RoleFullInfoDto>>>, AxiosResponse<GenericResponse<PageResponse<SupplyCategoryDto>>>, AxiosResponse<GenericResponse<PageResponse<SupplyUnitDto>>>, AxiosResponse<GenericResponse<PageResponse<ServiceDto>>>
      ]) => {
        const [departments, equipmentCategories, suppliers, equipmentGroups, equipmentUnits, projects, roles, supplyCategories, supplyUnits, services] = res;
        setDepartments(departments.data.data.content);
        setEquipmentCategories(equipmentCategories.data.data.content);
        setProviders(suppliers.data.data.content);
        setEquipmentGroups(equipmentGroups.data.data.content);
        setEquipmentUnits(equipmentUnits.data.data.content);
        setProjects(projects.data.data.content);
        setRoles(roles.data.data.content);
        setSupplyCategories(supplyCategories.data.data.content);
        setSupplyUnits(supplyUnits.data.data.content);
        setServices(services.data.data.content);
      })
      .catch(error => console.log('error', error));
  };

  useEffect(() => {
    if (access_token) {
      getAllFilter();
    }
  }, [access_token]);

  const FilterContextData = {
    statuses,
    departments,
    equipmentGroups,
    types,
    cycles,
    services,
    roles,
    equipmentUnits,
    levels,
    providers,
    user,
    equipmentCategories,
    projects,
    supplyCategories,
    supplyUnits,
  };

  return (<FilterContext.Provider value={FilterContextData}>
    {children}
  </FilterContext.Provider>);
};

export default FilterContextProvider;