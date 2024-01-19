import { InfoCircleFilled } from '@ant-design/icons';
import { Button, Checkbox, Divider, Modal, Table } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { notificationConfigApi } from '../../../api/notificationConfig.api';
import { NotificationType, UpdateNotificationConfigForm } from '../../../types/notificationConfig.type';
import { RoleFullInfoDto } from '../../../types/role.type';
import { toast } from 'react-toastify';
import { FilterContext } from '../../../contexts/filter.context';

const EmailConfig = () => {

  const [showEmailConfigModal, setShowEmailConfigModal] = useState<boolean>(false);
  const { roles } = useContext(FilterContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [checkedButton, setCheckedButton] = useState<UpdateNotificationConfigForm[]>([]);
  const [shouldUpdate, setShouldUpdate] = useState<boolean>(false);
  const onCheckButton = (roleId: number, notificationType: NotificationType) => {
    if (checkedButton.filter((x) => x.roleId === roleId && x.notificationType === notificationType).length > 0) {
      setCheckedButton(checkedButton.filter((x) => x.roleId !== roleId || x.notificationType !== notificationType));
      return;
    }
    setCheckedButton([...checkedButton, { roleId, notificationType }]);
  };
  const columnHandovers: any = [
    {
      title: 'Vai trò', render: (item: RoleFullInfoDto) => (<>{item.name}</>),
    }, {
      title: ' Mô tả', render: (item: RoleFullInfoDto) => (<>{item.description}</>),
    }, {
      title: 'Trạng thái', render: (item: RoleFullInfoDto) => (<Checkbox
        onClick={() => {onCheckButton(item.id, NotificationType.HANDOVER);}}
        checked={checkedButton.filter((x) => x.roleId === item.id && x.notificationType === NotificationType.HANDOVER).length > 0}
      />),
    },
  ];
  const columnTransfers: any = [
   {
      title: 'Vai trò', render: (item: RoleFullInfoDto) => (<>{item.name}</>),
    }, {
      title: ' Mô tả', render: (item: RoleFullInfoDto) => (<>{item.description}</>),
    }, {
      title: 'Trạng thái', render: (item: RoleFullInfoDto) => (<Checkbox
        onClick={() => {onCheckButton(item.id, NotificationType.TRANSFER);}}
        checked={checkedButton.some((x) => x.roleId === item.id && x.notificationType === NotificationType.TRANSFER)}
      />),
    },
  ];
  const columnReportBrokens: any = [
   {
      title: 'Vai trò', render: (item: RoleFullInfoDto) => (<>{item.name}</>),
    }, {
      title: ' Mô tả', render: (item: RoleFullInfoDto) => (<>{item.description}</>),
    }, {
      title: 'Trạng thái', render: (item: RoleFullInfoDto) => (<Checkbox
        onClick={() => {onCheckButton(item.id, NotificationType.REPORT_BROKEN);}}
        checked={checkedButton.some((x) => x.roleId === item.id && x.notificationType === NotificationType.REPORT_BROKEN)}
      />),
    },
  ];
  const columnRepairs: any = [
   {
      title: 'Vai trò', render: (item: RoleFullInfoDto) => (<>{item.name}</>),
    }, {
      title: ' Mô tả', render: (item: RoleFullInfoDto) => (<>{item.description}</>),
    }, {
      title: 'Trạng thái', render: (item: RoleFullInfoDto) => (<Checkbox
        onClick={() => {onCheckButton(item.id, NotificationType.REPAIR);}}
        checked={checkedButton.some((x) => x.roleId === item.id && x.notificationType === NotificationType.REPAIR)}
      />),
    },
  ];
  const columnMaintenances: any = [
   {
      title: 'Vai trò', render: (item: RoleFullInfoDto) => (<>{item.name}</>),
    }, {
      title: ' Mô tả', render: (item: RoleFullInfoDto) => (<>{item.description}</>),
    }, {
      title: 'Trạng thái', render: (item: RoleFullInfoDto) => (<Checkbox
        onClick={() => {onCheckButton(item.id, NotificationType.MAINTENANCE);}}
        checked={checkedButton.some((x) => x.roleId === item.id && x.notificationType === NotificationType.MAINTENANCE)}
      />),
    },
  ];
  const columnInspections: any = [
   {
      title: 'Vai trò', render: (item: RoleFullInfoDto) => (<>{item.name}</>),
    }, {
      title: ' Mô tả', render: (item: RoleFullInfoDto) => (<>{item.description}</>),
    }, {
      title: 'Trạng thái', render: (item: RoleFullInfoDto) => (<Checkbox
        onClick={() => {onCheckButton(item.id, NotificationType.INSPECTION);}}
        checked={checkedButton.some((x) => x.roleId === item.id && x.notificationType === NotificationType.INSPECTION)}
      />),
    },
  ];
  const columnLiquidations: any = [
   {
      title: 'Vai trò', render: (item: RoleFullInfoDto) => (<>{item.name}</>),
    }, {
      title: ' Mô tả', render: (item: RoleFullInfoDto) => (<>{item.description}</>),
    }, {
      title: 'Trạng thái', render: (item: RoleFullInfoDto) => (<Checkbox
        onClick={() => {onCheckButton(item.id, NotificationType.LIQUIDATION);}}
        checked={checkedButton.some((x) => x.roleId === item.id && x.notificationType === NotificationType.LIQUIDATION)}
      />),
    },
  ];
  useEffect(() => {
    setLoading(true);
    setShouldUpdate(false);
    notificationConfigApi.getNotificationConfigs().then((res) => {
      let _checkedButton: UpdateNotificationConfigForm[] = [];
      res.data.data.forEach((item) => {
        _checkedButton.push({
          notificationType: item.notificationType, roleId: item.role.id,
        });
      });
      setCheckedButton(_checkedButton);
    }).finally(() => setLoading(false));
  }, [shouldUpdate]);

  const updateNotificationConfig = () => {
    notificationConfigApi.updateNotificationConfig(checkedButton).then((res) => {
      toast.success('Cập nhật cấu hình thành công');
      setShouldUpdate(true);
    });
  };

  return (<div>
    <div className='title'>CẤU HÌNH NHẬN THÔNG BÁO QUA EMAIL</div>
    <Divider />
    <div
      className='text-red-600 flex items-center cursor-pointer text-lg gap-2 mb-6'
      onClick={() => setShowEmailConfigModal(true)}
    >
      <InfoCircleFilled />
      <div>Chi tiết cấu hình</div>
    </div>
    <div className='grid grid-cols-2 gap-20 mb-20'>
      <div>
        <div className='font-medium text-base'>Tác vụ bàn giao thiết bị</div>
        <Table
          columns={columnHandovers}
          dataSource={roles}
          className='mt-6 shadow-md'
          pagination={false}
        />
      </div>
      <div>
        <div className='font-medium text-base'>Tác vụ điều chuyển thiết bị</div>
        <Table
          columns={columnTransfers}
          dataSource={roles}
          className='mt-6 shadow-md'
          pagination={false}
        />
      </div>
    </div>
    <div className='grid grid-cols-2 gap-20 mb-20'>
      <div>
        <div className='font-medium text-base'>Tác vụ báo hỏng thiết bị</div>
        <Table
          columns={columnReportBrokens}
          dataSource={roles}
          className='mt-6 shadow-md'
          pagination={false}
        />
      </div>
      <div>
        <div className='font-medium text-base'> Tác vụ sửa chữa thiết bị</div>
        <Table
          columns={columnRepairs}
          dataSource={roles}
          className='mt-6 shadow-md'
          pagination={false}
        />
      </div>
    </div>
    <div className='grid grid-cols-2 gap-20 mb-10'>
      <div>
        <div className='font-medium text-base'>Tác vụ thanh lý thiết bị</div>
        <Table
          columns={columnLiquidations}
          dataSource={roles}
          className='mt-6 shadow-md'
          pagination={false}
        />
      </div>
      <div>
        <div className='font-medium text-base'>Tác vụ kiểm định thiết bị</div>
        <Table
          columns={columnInspections}
          dataSource={roles}
          className='mt-6 shadow-md'
          pagination={false}
        />
      </div>
    </div>
    <div className='grid grid-cols-2 gap-20 mb-10'>
      <div>
        <div className='font-medium text-base'>Tác vụ bảo dưỡng thiết bị</div>
        <Table
          columns={columnMaintenances}
          dataSource={roles}
          className='mt-6 shadow-md'
          pagination={false}
        />
      </div>
    </div>
    <div className='flex justify-center'>
      <Button className='button mt-8' onClick={updateNotificationConfig}>Cập nhật</Button>
    </div>
    <Modal
      title='Cấu hình gửi tác vụ gửi mail'
      open={showEmailConfigModal}
      onCancel={() => setShowEmailConfigModal(false)}
      footer={null}
    >
      <div className='text-lg'>
        - Bạn vui lòng tích vào check box những đối tượng người dùng mà bạn muốn gửi mail
      </div>
      <div className='text-lg'>
        - Đối với mỗi tác vụ như bàn giao, điều chuyển, ... hệ thống sẽ gửi mail thông báo tới những đối tượng người dùng trong danh sách mà bạn đã cấu hình
      </div>
    </Modal>
  </div>);
};

export default EmailConfig;