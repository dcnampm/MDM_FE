import { Button, Form, Input, Modal } from 'antd';
import equipmentGroupApi from '../../../api/equipmentGroup.api';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { EquipmentGroupFullInfoDto, UpsertEquipmentGroupForm } from '../../../types/equipmentGroup.type';
import { mapEquipmentGroupFullInfoDtoToUpsertEquipmentGroupForm } from '../../../utils/mapper.util';

export interface ModalUpdateEquipmentGroupProps {
  showUpdateEquipmentGroupModal: boolean;
  hideUpdateEquipmentGroupModal: () => void;
  callback: () => void;
  updateEquipmentGroupModalData?: EquipmentGroupFullInfoDto;
}

export const ModalUpdateEquipmentGroup = (props: ModalUpdateEquipmentGroupProps) => {
  const { showUpdateEquipmentGroupModal, hideUpdateEquipmentGroupModal, callback, updateEquipmentGroupModalData } = props;
  const [form] = Form.useForm<UpsertEquipmentGroupForm>();
  const [loading, setLoading] = useState<boolean>(false);
  const updateEquipmentGroup = (values: UpsertEquipmentGroupForm) => {
    setLoading(true);
    equipmentGroupApi.updateEquipmentGroup(updateEquipmentGroupModalData?.id as number, values).then(() => {
      toast.success('Cập nhật nhóm thiết bị thành công');
    }).finally(() => {
      setLoading(false);
      hideUpdateEquipmentGroupModal();
      form.resetFields();
      callback();
    });
  };
  useEffect(() => {
    form.resetFields();
    form.setFieldsValue(mapEquipmentGroupFullInfoDtoToUpsertEquipmentGroupForm(updateEquipmentGroupModalData as EquipmentGroupFullInfoDto));
  }, [updateEquipmentGroupModalData]);
  return (<Modal
    title='Cập nhật nhóm thiết bị'
    open={showUpdateEquipmentGroupModal}
    onCancel={() => {
      hideUpdateEquipmentGroupModal();
    }}
    footer={null}
  >
    <Form form={form} layout='vertical' size='large' onFinish={updateEquipmentGroup}>
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
          { required: true, message: 'Vui lòng nhập kí hiệu thiết bị' },
        ]}
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
          <Button onClick={() => hideUpdateEquipmentGroupModal()} className='button'>Đóng</Button>
        </Form.Item>
      </div>
    </Form>
  </Modal>);
};
