import { EquipmentFullInfoDto, UpsertEquipmentForm } from '../types/equipment.type';
import { DepartmentFullInfoDto, UpsertDepartmentForm } from '../types/department.type';
import { UpsertUserForm, UserDetailDto } from '../types/user.type';
import moment from 'moment';
import { SupplyFullInfoDto, UpsertSupplyForm } from '../types/supply.type';
import { EquipmentGroupFullInfoDto, UpsertEquipmentGroupForm } from '../types/equipmentGroup.type';
import { EquipmentCategoryFullInfoDto, UpsertEquipmentCategoryForm } from '../types/equipmentCategory.type';
import { EquipmentUnitDto, UpsertEquipmentUnitForm } from '../types/equipmentUnit.type';
import { ServiceDto, UpsertServiceForm } from '../types/service.type';
import { SupplierFullInfoDto, UpsertSupplierForm } from '../types/supplier.type';

export const mapFromEquipmentFullInfoDtoToUpsertEquipmentForm = (equipmentFullInfoDto: EquipmentFullInfoDto): UpsertEquipmentForm => {
  return {
    name: equipmentFullInfoDto.name,
    model: equipmentFullInfoDto.model,
    serial: equipmentFullInfoDto.serial,
    annualDepreciation: equipmentFullInfoDto.annualDepreciation,
    categoryId: equipmentFullInfoDto.category?.id,
    code: equipmentFullInfoDto.code,
    configuration: equipmentFullInfoDto.configuration,
    deleted: equipmentFullInfoDto.deleted,
    departmentId: equipmentFullInfoDto.department?.id,
    hashCode: equipmentFullInfoDto.hashCode,
    importPrice: equipmentFullInfoDto.importPrice,
    initialValue: equipmentFullInfoDto.initialValue,
    jointVentureContractExpirationDate: equipmentFullInfoDto.jointVentureContractExpirationDate ?
      moment(equipmentFullInfoDto.jointVentureContractExpirationDate) : undefined,
    manufacturer: equipmentFullInfoDto.manufacturer,
    note: equipmentFullInfoDto.note,
    manufacturingCountry: equipmentFullInfoDto.manufacturingCountry,
    projectId: equipmentFullInfoDto.project?.id,
    regularInspection: equipmentFullInfoDto.regularInspection,
    regularMaintenance: equipmentFullInfoDto.regularMaintenance,
    riskLevel: equipmentFullInfoDto.riskLevel,
    status: equipmentFullInfoDto.status,
    supplierId: equipmentFullInfoDto.supplier?.id,
    unitId: equipmentFullInfoDto.unit?.id,
    technicalParameter: equipmentFullInfoDto.technicalParameter,
    usageProcedure: equipmentFullInfoDto.usageProcedure,
    warehouseImportDate: equipmentFullInfoDto.warehouseImportDate ? moment(equipmentFullInfoDto.warehouseImportDate) : undefined,
    warrantyExpirationDate: equipmentFullInfoDto.warrantyExpirationDate ? moment(equipmentFullInfoDto.warrantyExpirationDate) : undefined,
    yearInUse: equipmentFullInfoDto.yearInUse,
    yearOfManufacture: equipmentFullInfoDto.yearOfManufacture,
  };
};
export const mapDepartmentFullInfoDtoToUpsertDepartmentForm = (departmentFullInfoDto: DepartmentFullInfoDto): UpsertDepartmentForm => {
  return {
    name: departmentFullInfoDto.name,
    address: departmentFullInfoDto.address,
    alias: departmentFullInfoDto.alias,
    chiefNurseId: departmentFullInfoDto.chiefNurse?.id,
    headOfDepartmentId: departmentFullInfoDto.headOfDepartment?.id,
    email: departmentFullInfoDto.email,
    contactPersonId: departmentFullInfoDto.contactPerson?.id,
    managerId: departmentFullInfoDto.manager?.id,
    phone: departmentFullInfoDto.phone,
  };
};
export const mapUserDetailDtoToUpsertUserForm = (userDetailDto: UserDetailDto): UpsertUserForm => {
  return {
    name: userDetailDto.name || '',
    username: userDetailDto.username || '',
    email: userDetailDto.email || '',
    phone: userDetailDto.phone || '',
    address: userDetailDto.address || '',
    birthday: moment(userDetailDto.birthday),
    departmentId: userDetailDto.department?.id,
    enabled: userDetailDto.enabled || false,
    gender: userDetailDto.gender,
    roleId: userDetailDto.role?.id,
    departmentResponsibilityIds: userDetailDto.departmentResponsibilities?.map(department => department.id) || '',
    password: '' || '',
    workingStatus: userDetailDto.workingStatus || '',
  };
};
export const mapSupplyFullInfoDtoToUpsertSupplyForm = (supplyFullInfoDto: SupplyFullInfoDto): UpsertSupplyForm => {
  return {
    name: supplyFullInfoDto.name,
    code: supplyFullInfoDto.code,
    unitId: supplyFullInfoDto.unit?.id,
    categoryId: supplyFullInfoDto.category?.id,
    serial: supplyFullInfoDto.serial,
    amount: supplyFullInfoDto.amount,
    yearOfManufacture: supplyFullInfoDto.yearOfManufacture,
    yearInUse: supplyFullInfoDto.yearInUse,
    importPrice: supplyFullInfoDto.importPrice,
    status: supplyFullInfoDto.status,
    supplierId: supplyFullInfoDto.supplier?.id,
    hashCode: supplyFullInfoDto.hashCode,
    amountUsed: supplyFullInfoDto.amountUsed,
    warehouseImportDate: supplyFullInfoDto.warehouseImportDate,
    configuration: supplyFullInfoDto.configuration,
    note: supplyFullInfoDto.note,
    manufacturingCountry: supplyFullInfoDto.manufacturingCountry,
    projectId: supplyFullInfoDto.project?.id,
    model: supplyFullInfoDto.model,
    riskLevel: supplyFullInfoDto.riskLevel,
    manufacturer: supplyFullInfoDto.manufacturer,
    usageProcedure: supplyFullInfoDto.usageProcedure,
    technicalParameter: supplyFullInfoDto.technicalParameter,
    expiryDate: supplyFullInfoDto.expiryDate,
  };
};
export const mapEquipmentGroupFullInfoDtoToUpsertEquipmentGroupForm = (equipmentGroupFullInfoDto: EquipmentGroupFullInfoDto): UpsertEquipmentGroupForm => {
  return {
    name: equipmentGroupFullInfoDto.name, note: equipmentGroupFullInfoDto.note, alias: equipmentGroupFullInfoDto.alias,
  };
};
export const mapEquipmentCategoryFullInfoDtoToUpsertEquipmentCategoryForm = (equipmentCategoryFullInfoDto: EquipmentCategoryFullInfoDto): UpsertEquipmentCategoryForm => {
  return {
    name: equipmentCategoryFullInfoDto.name,
    note: equipmentCategoryFullInfoDto.note,
    alias: equipmentCategoryFullInfoDto.alias,
    groupId: equipmentCategoryFullInfoDto.group?.id,
  };
};
export const mapEquipmentUnitDtoToUpsertEquipmentUnitForm = (equipmentUnitDto: EquipmentUnitDto): UpsertEquipmentUnitForm => {
  return {
    name: equipmentUnitDto.name, note: equipmentUnitDto.note,
  };
};
export const mapServiceDtoToUpsertServiceForm = (serviceDto: ServiceDto): UpsertServiceForm => {
  return {
    name: serviceDto.name, note: serviceDto.note,
  };
};
export const mapSupplierFullInfoDtoToUpsertSupplierForm = (supplierFullInfoDto: SupplierFullInfoDto): UpsertSupplierForm => {
  return {
    name: supplierFullInfoDto.name,
    address: supplierFullInfoDto.address,
    hotline: supplierFullInfoDto.hotline,
    email: supplierFullInfoDto.email,
    fax: supplierFullInfoDto.fax,
    website: supplierFullInfoDto.website,
    taxCode: supplierFullInfoDto.taxCode,
    contactPersonId: supplierFullInfoDto.contactPerson?.id,
    note: supplierFullInfoDto.note,
    serviceIds: supplierFullInfoDto.services?.map(service => service.id as number) || [],
  };
};