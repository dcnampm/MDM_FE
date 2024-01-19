import { Button, Form, Input, Modal } from 'antd';
import equipmentGroupApi from '../../../api/equipmentGroup.api';
import { toast } from 'react-toastify';
import { useState } from 'react';
import {  UpsertEquipmentGroupForm } from '../../../types/equipmentGroup.type';

export interface ModalCreateEquipmentGroupProps {
  showCreateEquipmentGroupModal: boolean;
  hideCreateEquipmentGroupModal: () => void;
  callback: () => void;
}

export const ModalCreateEquipmentGroup = (props: ModalCreateEquipmentGroupProps) => {
  const { showCreateEquipmentGroupModal, hideCreateEquipmentGroupModal, callback } = props;
  const [form] = Form.useForm<UpsertEquipmentGroupForm>();
  const [loading, setLoading] = useState<boolean>(false);
  const createEquipmentGroup = (values: UpsertEquipmentGroupForm) => {
    setLoading(true);
    equipmentGroupApi.createEquipmentGroup(values).then(() => {
      toast.success('Tạo nhóm thiết bị thành công');
    }).finally(() => {
      setLoading(false);
      hideCreateEquipmentGroupModal();
      form.resetFields();
      callback();
    });
  };

  return (<Modal
    title='Tạo mới nhóm thiết bị'
    open={showCreateEquipmentGroupModal}
    onCancel={() => {
      hideCreateEquipmentGroupModal();
    }}
    footer={null}
  >
    <Form form={form} layout='vertical' size='large' onFinish={createEquipmentGroup}>
      <div className='grid grid-cols-1 gap-5'>

        <Form.Item
          label='Tên nhóm thiết bị' name='name' required={true} rules={[
          { required: true, message: 'Vui lòng nhập tên nhóm thiết bị' },
        ]}>
          <Input className='input' />
        </Form.Item>
        <Form.Item
          label=' Kí hiệu' name='alias'
          required={true} rules={[
            { required: true, message: 'Vui lòng nhập kí hiệu thiết bị' },]}
        >
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
          <Button onClick={() => hideCreateEquipmentGroupModal()} className='button'>Đóng</Button>
        </Form.Item>
      </div>
    </Form>
  </Modal>);
};
