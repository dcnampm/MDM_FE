import { CheckboxOptionType } from 'antd';
import { Authority } from '../constants/authority';

export interface RoleDto {
  id: number;
  name?: string;
  description?: string;
  scopes?: string[];
}

export interface GetRolesQueryParam {
  keyword?: string;
}

export interface UpsertRoleForm {
  name?: string;
  description?: string;
  permissions?: string[];
}

export interface RoleFullInfoDto {
  id: number;
  name: string;
  description: string;
  permissions: PermissionDto[];
}

export interface PermissionDto {
  id: number;
  name: string;
  description: string;
}

export const PERMISSIONS: (string | CheckboxOptionType[])[][] = [
  //key, title, authority prefix (permission group), options
  ['Dashboard', 'DASHBOARD', [{ label: 'Xem', value: Authority.DASHBOARD_READ }]], [
    'Quản lý thiết bị', 'EQUIPMENT', [
      { label: 'Xem', value: Authority.EQUIPMENT_READ },
      { label: 'Thêm', value: Authority.EQUIPMENT_CREATE },
      { label: 'Sửa', value: Authority.EQUIPMENT_UPDATE },
      { label: 'Xóa', value: Authority.EQUIPMENT_DELETE },
    ],
  ], [
    'Bàn giao', 'HANDOVER', [
      { label: 'Xem', value: Authority.HANDOVER_READ },
      { label: 'Tạo phiếu', value: Authority.HANDOVER_CREATE },
      { label: 'Phê duyệt phiếu', value: Authority.HANDOVER_ACCEPT },
    ],
  ], [
    'Bảo trì, bảo dưỡng', 'MAINTENANCE', [
      { label: 'Xem', value: Authority.MAINTENANCE_READ },
      { label: 'Tạo phiếu', value: Authority.MAINTENANCE_CREATE },
      { label: 'Phê duyệt phiếu', value: Authority.MAINTENANCE_ACCEPT },
      { label: 'Cập nhật phiếu', value: Authority.MAINTENANCE_UPDATE },
    ],
  ], [
    'Kiểm định', 'INSPECTION', [
      { label: 'Xem', value: Authority.INSPECTION_READ },
      { label: 'Tạo phiếu', value: Authority.INSPECTION_CREATE },
      { label: 'Phê duyệt phiếu', value: Authority.INSPECTION_ACCEPT },
      { label: 'Cập nhật phiếu', value: Authority.INSPECTION_UPDATE },
    ],
  ], [
    'Điều chuyển', 'TRANSFER', [
      { label: 'Xem', value: Authority.TRANSFER_READ },
      { label: 'Tạo phiếu', value: Authority.TRANSFER_CREATE },
      { label: 'Phê duyệt phiếu', value: Authority.TRANSFER_ACCEPT },
    ],
  ], [
    'Báo hỏng', 'REPORT_BROKEN', [
      { label: 'Xem', value: Authority.REPORT_BROKEN_READ },
      { label: 'Tạo phiếu', value: Authority.REPORT_BROKEN_CREATE },
      { label: 'Phê duyệt phiếu', value: Authority.REPORT_BROKEN_ACCEPT },
    ],
  ], [
    'Sửa chữa', 'REPAIR', [
      { label: 'Xem', value: Authority.REPAIR_READ },
      { label: 'Tạo phiếu', value: Authority.REPAIR_CREATE },
      { label: 'Phê duyệt phiếu', value: Authority.REPAIR_ACCEPT },
      { label: 'Cập nhật phiếu', value: Authority.REPAIR_UPDATE },
      { label: 'Nghiệm thu', value: Authority.REPAIR_ACCEPTANCE_TESTING },
    ],
  ], [
    'Thanh lý', 'LIQUIDATION', [
      { label: 'Xem', value: Authority.LIQUIDATION_READ },
      { label: 'Tạo phiếu', value: Authority.LIQUIDATION_CREATE },
      { label: 'Phê duyệt phiếu', value: Authority.LIQUIDATION_ACCEPT },
    ],
  ], [
    'Quản lý vật tư theo kèm thiết bị', 'SUPPLY', [
      { label: 'Xem', value: Authority.SUPPLY_READ },
      { label: 'Thêm', value: Authority.SUPPLY_CREATE },
      { label: 'Sửa', value: Authority.SUPPLY_UPDATE },
      { label: 'Xóa', value: Authority.SUPPLY_DELETE },
    ],
  ], [
    'Quản lý loại thiết bị', 'EQUIPMENT_CATEGORY', [
      { label: 'Xem', value: Authority.EQUIPMENT_CATEGORY_READ },
      { label: 'Thêm', value: Authority.EQUIPMENT_CATEGORY_CREATE },
      { label: 'Sửa', value: Authority.EQUIPMENT_CATEGORY_UPDATE },
      { label: 'Xóa', value: Authority.EQUIPMENT_CATEGORY_DELETE },
    ],
  ], [
    'Quản lý loại vật tư', 'SUPPLY_UNIT', [
      { label: 'Xem', value: Authority.SUPPLY_UNIT_READ },
      { label: 'Thêm', value: Authority.SUPPLY_UNIT_CREATE },
      { label: 'Sửa', value: Authority.SUPPLY_UNIT_UPDATE },
      { label: 'Xóa', value: Authority.SUPPLY_UNIT_DELETE },
    ],
  ], [
    'Quản lý nhóm thiết bị', 'EQUIPMENT_GROUP', [
      { label: 'Xem', value: Authority.EQUIPMENT_GROUP_READ },
      { label: 'Thêm', value: Authority.EQUIPMENT_GROUP_CREATE },
      { label: 'Sửa', value: Authority.EQUIPMENT_GROUP_UPDATE },
      { label: 'Xóa', value: Authority.EQUIPMENT_GROUP_DELETE },
    ],
  ], [
    'Quản lý khoa phòng', 'DEPARTMENT', [
      { label: 'Xem', value: Authority.DEPARTMENT_READ },
      { label: 'Thêm', value: Authority.DEPARTMENT_CREATE },
      { label: 'Sửa', value: Authority.DEPARTMENT_UPDATE },
      { label: 'Xóa', value: Authority.DEPARTMENT_DELETE },
    ],
  ], [
    'Quản lý người dùng', 'USER', [
      { label: 'Xem', value: Authority.USER_READ },
      { label: 'Thêm', value: Authority.USER_CREATE },
      { label: 'Sửa', value: Authority.USER_UPDATE },
      { label: 'Xóa', value: Authority.USER_DELETE },
    ],
  ], [
    'Quản lý chức vụ', 'ROLE', [
      { label: 'Xem', value: Authority.ROLE_READ },
      { label: 'Thêm', value: Authority.ROLE_CREATE },
      { label: 'Sửa', value: Authority.ROLE_UPDATE },
      { label: 'Xóa', value: Authority.ROLE_DELETE },
    ],
  ], [
    'Quản lý đơn vị tính', 'EQUIPMENT_UNIT', [
      { label: 'Xem', value: Authority.EQUIPMENT_UNIT_READ },
      { label: 'Thêm', value: Authority.EQUIPMENT_UNIT_CREATE },
      { label: 'Sửa', value: Authority.EQUIPMENT_UNIT_UPDATE },
      { label: 'Xóa', value: Authority.EQUIPMENT_UNIT_DELETE },
    ],
  ], [
    'Quản lý dự án', 'PROJECT', [
      { label: 'Xem', value: Authority.PROJECT_READ },
      { label: 'Thêm', value: Authority.PROJECT_CREATE },
      { label: 'Sửa', value: Authority.PROJECT_UPDATE },
      { label: 'Xóa', value: Authority.PROJECT_DELETE },
    ],
  ], [
    'Quản lý nhà cung cấp', 'SUPPLIER', [
      { label: 'Xem', value: Authority.SUPPLIER_READ },
      { label: 'Thêm', value: Authority.SUPPLIER_CREATE },
      { label: 'Sửa', value: Authority.SUPPLIER_UPDATE },
      { label: 'Xóa', value: Authority.SUPPLIER_DELETE },
    ],
  ], [
    'Quản lý dịch vụ', 'SERVICE', [
      { label: 'Xem', value: Authority.SERVICE_READ },
      { label: 'Thêm', value: Authority.SERVICE_CREATE },
      { label: 'Sửa', value: Authority.SERVICE_UPDATE },
      { label: 'Xóa', value: Authority.SERVICE_DELETE },
    ],
  ],
];

export interface TotalOptionAndOptionLeft {
  totalOptions: number;
  optionLeft: number;
}

export const getOptionCountForEachPermissionGroup = (): Map<string, TotalOptionAndOptionLeft> => {
  let optionCount = new Map<string, TotalOptionAndOptionLeft>();
  PERMISSIONS.forEach(permission => {
    return optionCount.set(permission[1] as string, {
      totalOptions: permission[2].length, optionLeft: permission[2].length,
    });
  });
  return optionCount;
};

