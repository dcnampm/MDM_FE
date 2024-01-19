import { Button, Form, Input, Modal } from 'antd';
import { toast } from 'react-toastify';
import { useState } from 'react';
import {  UpsertEquipmentUnitForm } from '../../../types/equipmentUnit.type';
import { equipmentUnitApi } from '../../../api/equipmentUnit.api';

export interface ModalCreateEquipmentUnitProps {
  showCreateEquipmentUnitModal: boolean;
  hideCreateEquipmentUnitModal: () => void;
  callback: () => void;
}

export const ModalCreateEquipmentUnit = (props: ModalCreateEquipmentUnitProps) => {
  const { showCreateEquipmentUnitModal, hideCreateEquipmentUnitModal, callback } = props;
  const [form] = Form.useForm<UpsertEquipmentUnitForm>();
  const [loading, setLoading] = useState<boolean>(false);
  const createEquipmentUnit = (values: UpsertEquipmentUnitForm) => {
    setLoading(true);
    equipmentUnitApi.createEquipmentUnit(values).then(() => {
      toast.success('Tạo đơn vị tính thiết bị thành công');
    }).finally(() => {
      setLoading(false);
      hideCreateEquipmentUnitModal();
      form.resetFields();
      callback();
    });
  };

  return (<Modal
    title='Tạo mới đơn vị tính thiết bị'
    open={showCreateEquipmentUnitModal}
    onCancel={() => {
      hideCreateEquipmentUnitModal();
    }}
    footer={null}
  >
    <Form form={form} layout='vertical' size='large' onFinish={createEquipmentUnit}>
      <div className='grid grid-cols-1 gap-5'>

        <Form.Item
          label='Tên đơn vị tính thiết bị' name='name' required={true} rules={[
          { required: true, message: 'Vui lòng nhập tên đơn vị tính thiết bị' },
        ]}>
          <Input className='input' />
        </Form.Item>
        <Form.Item
          label=' Ghi chú' name='note'>
          <Input className='input' />
        </Form.Item>


      </div>
      <div className='flex flex-row justify-end gap-4'>
        <Form.Item>
          <Button htmlType='submit' className='button' loading={loading}>Xác nhận</Button>
        </Form.Item>
        <Form.Item>
          <Button onClick={() => hideCreateEquipmentUnitModal()} className='button'>Đóng</Button>
        </Form.Item>
      </div>
    </Form>
  </Modal>);
};
