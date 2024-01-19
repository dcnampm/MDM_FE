import { CURRENT_USER } from 'constants/auth.constant';
import { DepartmentDto, DepartmentFullInfoDto } from '../types/department.type';
import { PageableRequest } from '../types/commonRequest.type';
import qs from 'qs';
import { toast } from 'react-toastify';
import { RcFile } from 'antd/es/upload';
import { UserDetailDto } from '../types/user.type';
import { Authority } from '../constants/authority';
import { fileApi } from '../api/file.api';
import moment, { isMoment } from 'moment';
import { DATE_TIME_FORMAT } from '../constants/dateFormat.constants';
import { FileStorageDto } from '../types/fileStorage.type';
import { EquipmentCategoryListDto } from '../types/equipmentCategory.type';
import { InspectionEvaluationStatus } from '../types/equipmentInspection.type';
import i18next from 'i18next';
import { AxiosError } from 'axios';
import { GenericResponse } from '../types/commonResponse.type';
import { EquipmentStatus } from '../types/equipment.type';
import { TicketStatus } from '../types/reportBroken.type';
import { HasTicketStatus } from '../types/trait.type';
import { RoleDto } from 'types/role.type';

const convertBase64 = (file: File) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};

export const getAuthorityPrefix = (authority: Authority | string): string => {
  return authority.toString().split('\\.')[0];
};
const options = (array: any): { value: any, label: any }[] => {
  return array?.length > 0 && array?.map((item: any) => {
    let o: any = {};
    o.value = item?.id;
    o.label = item?.name;
    return o;
  });
};

export const getRolesOptions = (array : RoleDto[]) => {
  if (array?.length > 0) {
    return array?.map((item: RoleDto) => {
      let o: any = {};
      o.value = item?.id;
      o.label = `${item?.name} - ${item?.description}`;
      return o;
    });
  }
  return [];
}
/**
 * In the create transfer ticket flow, we need to exclude the current department of equipment
 * @param listOfDepartments
 * @param departmentTransferFrom
 */
export const getDepartmentOptionsForCreateTransferTicket = (listOfDepartments: (DepartmentFullInfoDto | DepartmentDto)[],
                                                            departmentTransferFrom: DepartmentFullInfoDto | DepartmentDto) => {
  if (listOfDepartments == undefined || listOfDepartments.length === 0) {
    return [];
  }
  if (departmentTransferFrom == undefined) {
    return options(listOfDepartments);
  }
  let listOfDepartmentsExceptDepartmentTransferFrom = listOfDepartments.filter(department => department.id !== departmentTransferFrom.id);
  return options(listOfDepartmentsExceptDepartmentTransferFrom);
};
const getDepartmentOptions = (array: DepartmentFullInfoDto[]) => {
  if (array?.length > 0) {
    return array?.map((item: DepartmentFullInfoDto) => {
      let o: any = {};
      o.value = item?.id;
      o.label = item?.name;
      return o;
    });
  }
  return [];
};
export const getEquipmentCategoryOptions = (array: EquipmentCategoryListDto[], equipmentGroupId: number) => {
  if (array?.length > 0) {
    return array?.filter(item => {
      if (equipmentGroupId == null) {
        return true;
      } else {
        return item?.group?.id === equipmentGroupId;
      }
    }).map((item: EquipmentCategoryListDto) => {
      let o: any = {};
      o.value = item?.id;
      o.label = item?.name;
      return o;
    });
  }
};

export function formatCurrencyVn(value: number): string {
  if (value == null || value == 0 || isNaN(value)) {
    return '';
  }
  const currencyString = value.toLocaleString('vi-VN', {
    style: 'currency', currency: 'VND',
  });
  return currencyString;
}

/**
 * for request java backend, page number start from 0, but for frontend, page number start from 1
 * @param pageable
 */
export const reducePageNumberByOne = (pageable: PageableRequest) => {
  if (pageable.page !== undefined) {
    pageable.page = pageable.page - 1;
  }
};
export const getStatusesOption = () => {
  let statusesOption: { value: string, label: string }[] = [];
  for (let status in EquipmentStatus) {
    statusesOption.push({ value: status, label: i18next.t(status) });
  }
  return statusesOption;
};
export const getStatusOptionForExcelImport = () => {
  return getStatusesOption()
    .filter(item => item.value === EquipmentStatus.LIQUIDATED || item.value === EquipmentStatus.NEW || item.value ===
      EquipmentStatus.INACTIVE || item.value === EquipmentStatus.BROKEN || item.value === EquipmentStatus.IN_USE || item.value === EquipmentStatus.REPAIRING || item.value === EquipmentStatus.UNDER_MAINTENANCE || item.value === EquipmentStatus.UNDER_INSPECTION);
};
export const getStatusOptionForLiquidation = () => {
  return getStatusesOption()
    .filter(item => item.value === EquipmentStatus.LIQUIDATED || item.value === EquipmentStatus.PENDING_ACCEPT_LIQUIDATION || item.value ===
      EquipmentStatus.INACTIVE);
};
export const getStatusOptionForTransfer = () => {
  return getStatusesOption()
    .filter(item => item.value === EquipmentStatus.PENDING_TRANSFER || item.value === EquipmentStatus.IN_USE);
};
export const getStatusOptionForMaintenance = () => {
  return getStatusesOption()
    .filter(item => item.value === EquipmentStatus.UNDER_MAINTENANCE || item.value === EquipmentStatus.PENDING_ACCEPT_MAINTENANCE || item.value ===
      EquipmentStatus.IN_USE);
};
export const getStatusOptionForRepair = () => {
  return getStatusesOption()
    .filter(item => item.value === EquipmentStatus.REPAIRING || item.value === EquipmentStatus.PENDING_ACCEPT_REPAIR || item.value === EquipmentStatus.BROKEN);
};
export const getStatusOptionForHandover = () => {
  return getStatusesOption()
    .filter(item => item.value === EquipmentStatus.PENDING_HANDOVER || item.value === EquipmentStatus.NEW);
};
export const getStatusOptionForInspection = () => {
  return getStatusesOption()
    .filter(item => item.value === EquipmentStatus.PENDING_ACCEPT_INSPECTION || item.value === EquipmentStatus.IN_USE || item.value ===
      EquipmentStatus.UNDER_INSPECTION);
};
export const getStatusOptionForReportBroken = () => {
  return getStatusesOption()
    .filter(item => item.value === EquipmentStatus.IN_USE || item.value === EquipmentStatus.PENDING_REPORT_BROKEN);
};
export const getInspectionEvaluationStatusesOption = () => {
  let inspectionEvaluationStatusesOption: { value: string, label: string }[] = [];
  for (let inspectionEvaluationStatus in InspectionEvaluationStatus) {
    inspectionEvaluationStatusesOption.push({ value: inspectionEvaluationStatus, label: i18next.t(inspectionEvaluationStatus) });
  }
  return inspectionEvaluationStatusesOption;
};
export const getCycleOption = () => {
  return [
    { value: 0, label: 'Không bắt buộc' },
    { value: 1, label: '1 tháng' },
    { value: 3, label: '3 tháng' },
    { value: 6, label: '6 tháng' },
    { value: 12, label: '12 tháng' },
    { value: 18, label: '18 tháng' },
    { value: 24, label: '24 tháng' },
    { value: 36, label: '36 tháng' },
  ];
};
export const getRiskLevelOptions = () => {

  return [
    { value: 'A', label: 'A' }, { value: 'B', label: 'B' }, { value: 'C', label: 'C' }, { value: 'D', label: 'D' }
  ];
};
const getDataExcel = (data: any, objectKey: any, fields: any) => {
  return data
    ?.map((item: any) => {
      let newItem: any = {};
      objectKey?.forEach((x: any) => {
        fields?.forEach((y: any) => {
          if (x === y.key) {
            newItem[x] = item[x];
          }
        });
      });
      return newItem;
    })
    ?.map((z: any) => {
      return fields?.map((item: any) => {
        return z[item.key];
      });
    });
};
export const getIfNull = (value: any, defaultValue: any) => {
  if (value == null) {
    return defaultValue;
  }
  return value;
};
export const getIfNotNull_ortherwiseReturnDefault = (value: any, valueIfNotNull: any, defaultValueIfNull: any) => {
  if (value == null) {
    return defaultValueIfNull;
  }
  return valueIfNotNull;
};
const getFields = (columnTable: any) => {
  return columnTable
    ?.filter((x: any) => x?.show && x?.key !== 'action')
    ?.map((y: any) => ({ key: y.key, title: y.title, width: y.widthExcel }));
};

const addRow = (ws: any, data: any, section: any) => {
  const borderStyles = {
    top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' },
  };
  const row = ws.addRow(data);
  row.eachCell({ includeEmpty: true }, (cell: any, colNumber: any) => {
    if (section?.border) {
      cell.border = borderStyles;
    }
    if (section?.alignment) {
      cell.alignment = section.alignment;
    } else {
      cell.alignment = { vertical: 'middle' };
    }
    if (section?.font) {
      cell.font = section.font;
    }
    if (section?.fill) {
      cell.fill = section.fill;
    }
  });
  if (section?.height > 0) {
    row.height = section.height;
  }
  return row;
};

const mergeCells = (ws: any, row: any, from: any, to: any) => {
  ws.mergeCells(`${row.getCell(from)._address}:${row.getCell(to)._address}`);
};

const onChangeCheckbox = (item: any, e: any, columnTable: any, setColumnTable: any) => {
  let newColumns: any = columnTable.map((column: any) => {
    if (item.title === column.title) {
      column.show = e.target.checked;
    }
    ;
    return column;
  });
  setColumnTable(newColumns);
};

const getCurrentUser = (): UserDetailDto => {
  return JSON.parse(localStorage.getItem(CURRENT_USER) || '');
};
export const buildQueryParamsWithPageable = (params: any, pageable: PageableRequest) => {
  let queryParams = '?';
  if (qs.stringify(queryParams) !== '') {
    queryParams = qs.stringify(params) + '&';
  }
};
export const validateFileSize = (file: RcFile) => {
  if (file.size > 1024 * 1024 * 5) {
    toast.warning('Dung lượng file không được vượt quá 5MB!');
    return false;
  }
  return true;
};

export function forceDownloadFromArrayBuffer(base64: string, fileName: string) {
  const arrayBuffer = base64ToBlob(base64);
  const blob = new Blob([arrayBuffer]);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function base64ToBlob(base64: string) {
  const binaryString = window.atob(base64);
  const length = binaryString.length;
  const bytes = new Uint8Array(length);

  for (let i = 0; i < length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return new Blob([bytes]);
}


export function downloadDocumentsByListOfFileStorageDtoes(fileStorageDtos: FileStorageDto[]) { //TODO: refactor code using this function
  if (fileStorageDtos == null || fileStorageDtos.length === 0) {
    toast.warning('Không có tài liệu nào!');
    return;
  }
  let idList = fileStorageDtos.map(value => value.id);
  fileApi.downloadDocumentByListOfIds(idList);
}

export function getBiggestIdTicket<T>(array: T[] | undefined): T | null {
  if (!array || array.length === 0) {
    return null;
  }
  if (array.length === 1) {
    return array[0] as T;
  }
  let biggestIdTicket = array[0];
  for (let i = 0; i < array.length; i++) {
    // @ts-ignore
    if (biggestIdTicket?.id < array[i]?.id) {
      biggestIdTicket = array[i];
    }
  }
  return biggestIdTicket as T;
}

export function getTheSecondBiggestIdTicket<T>(array: T[] | undefined | any): T | null {
  if (!array || array.length === 0) {
    return null;
  }
  if (array.length === 1) {
    return null;
  }
  let biggestIdTicket = array[0];
  let secondBiggestIdTicket = null;
  for (let i = 0; i < array.length; i++) {
    if (biggestIdTicket?.id < array[i]?.id) {
      secondBiggestIdTicket = biggestIdTicket;
      biggestIdTicket = array[i];
    }
  }
  return secondBiggestIdTicket;
}

export function getDateForRendering(date: string | undefined | moment.Moment, format?: string): string {
  return date ? moment(date).format(format ? format : DATE_TIME_FORMAT) : '';
}

export function hasAuthority(authority: Authority) {
  const user: UserDetailDto = getCurrentUser();
  if (!user) {
    return false;
  }
  if (!authority) {
    return true;
  }
  for (let i = 0; i < user.grantedAuthorities.length; i++) {
    if (user.grantedAuthorities[i].authority === authority || user.grantedAuthorities[i].authority === Authority.ROLE_ADMIN ||
      user.grantedAuthorities[i].authority === Authority.ROLE_TPVT) {
      return true;
    }
  }
  return false;
}

export function createImageUrlFromArrayBuffer(arrayBuffer: ArrayBuffer): string | null {
  return arrayBuffer ? URL.createObjectURL(new Blob([arrayBuffer])) : null;
}

export function createImageSourceFromBase64(base64: string): string | null {
  return base64 ? `data:image/jpeg;base64,${base64}` : null;
}

export function localDateStringToIsoString(date: string | undefined | moment.Moment): string {
  if (isMoment(date)) {
    return date.toISOString();
  }
  return date ? new Date(date).toISOString() : '';
}

export function listLocalDateStringToIsoString(dates: (string | undefined | moment.Moment)[]): string[] {
  return dates.map((date) => localDateStringToIsoString(date));
}

export function showListOfErrors(errorList: string[]) {
  toast.error(errorList.map(value => value).join('\n'));
}


export function getRepairStatusOption() {
  return [
    { label: 'Đã sửa xong', value: 'DONE' }, { label: 'Không thể sửa chữa', value: 'CAN_NOT_REPAIR' },
  ];
}

export function getTooltipTitleOnDownloadDocumentButton(attachments: FileStorageDto[]): string {
  if (attachments.length === 0) {
    return ' (Không có tài liệu nào)';
  } else {
    return ` (Có ${attachments.length} tài liệu)`;
  }
}

export function createFormData(formKey: string, formData: any, attachmentKey: string, attachments: any[]) {
  let form = new FormData();
  form.append(formKey, new Blob([JSON.stringify(formData)], { type: 'application/json' }));
  attachments.forEach((attachment: any) => {
    form.append(attachmentKey, attachment);
  });
  const config = {
    maxBodyLength: Infinity, headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
  return {
    form: form, config: config,
  };
}

export function createQueryString(...params: object[]): string {
  return params.map((param: object) => {
    return qs.stringify(Object.fromEntries(Object.entries(param).filter(([_, v]) => v != null && v !== '' && v !== undefined)));
  }).join('&');
}

export function createUrlWithQueryString(url: string, ...params: object[]): string {
  return `${url}?${createQueryString(...params)}`;
}

export function showErrorToast(axiosError: AxiosError<GenericResponse<any>>) {
  if (axiosError.response) {
    axiosError.response?.data.errors?.forEach((error: string) => {
      toast.error(error);
    });
  }
}

/**
 * get latest ticket whose status is not equal to TicketStatus.REJECTED, for example, I want to render a list of equipment in liquidation tab,
 * I only want to render latest equipment's ticket info whose status is not rejected
 * @param tickets
 */
export const getLatestTicket_whoseStatusIsNotRejected = (tickets: HasTicketStatus[]): HasTicketStatus | null | undefined => {
  const latestTicket = getBiggestIdTicket(tickets) as HasTicketStatus;
  return isTicketStatusNotRejected(latestTicket?.status as TicketStatus) ? latestTicket : undefined;
};
export const getLatestTicket_whoseStatusIsPending = (tickets: HasTicketStatus[]): HasTicketStatus | null | undefined => {
  const latestTicket = getBiggestIdTicket(tickets) as HasTicketStatus;
  return isTicketStatusPending(latestTicket?.status as TicketStatus) ? latestTicket : undefined;
};
export const isTicketStatusPending = (ticketStatus: TicketStatus): boolean => {
  return ticketStatus === TicketStatus.PENDING;
};
export const isTicketStatusNotRejected = (ticketStatus: TicketStatus): boolean => {
  return ticketStatus === TicketStatus.ACCEPTED || ticketStatus === TicketStatus.PENDING;
};
export {
  convertBase64, options, getDataExcel, getFields, addRow, mergeCells, onChangeCheckbox, getCurrentUser, getDepartmentOptions,
};