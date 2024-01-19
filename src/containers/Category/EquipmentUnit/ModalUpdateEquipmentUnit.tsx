import { Button, Form, Input, Modal } from 'antd';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { EquipmentUnitDto, UpsertEquipmentUnitForm } from '../../../types/equipmentUnit.type';
import { mapEquipmentUnitDtoToUpsertEquipmentUnitForm } from '../../../utils/mapper.util';
import { equipmentUnitApi } from '../../../api/equipmentUnit.api';

export interface ModalUpdateEquipmentUnitProps {
  showUpdateEquipmentUnitModal: boolean;
  hideUpdateEquipmentUnitModal: () => void;
  callback: () => void;
  updateEquipmentUnitModalData?: EquipmentUnitDto;
}

export const ModalUpdateEquipmentUnit = (props: ModalUpdateEquipmentUnitProps) => {
  const { showUpdateEquipmentUnitModal, hideUpdateEquipmentUnitModal, callback, updateEquipmentUnitModalData } = props;
  const [form] = Form.useForm<UpsertEquipmentUnitForm>();
  const [loading, setLoading] = useState<boolean>(false);
  const updateEquipmentUnit = (values: UpsertEquipmentUnitForm) => {
    setLoading(true);
    equipmentUnitApi.updateEquipmentUnit(updateEquipmentUnitModalData?.id as number, values).then(() => {
      toast.success('Cập nhật đơn vị tính thiết bị thành công');
    }).finally(() => {
      setLoading(false);
      hideUpdateEquipmentUnitModal();
      form.resetFields();
      callback();
    });
  };
  useEffect(() => {
    form.resetFields();
    form.setFieldsValue(mapEquipmentUnitDtoToUpsertEquipmentUnitForm(updateEquipmentUnitModalData as EquipmentUnitDto));
  }, [updateEquipmentUnitModalData]);
  return (<Modal
    title='Cập nhật đơn vị tính thiết bị'
  open={showUpdateEquipmentUnitModal}
  onCancel={() => {
    hideUpdateEquipmentUnitModal();
  }}
  footer={null}
  >
  <Form form={form} layout='vertical' size='large' onFinish={updateEquipmentUnit}>
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
  <Button onClick={() => hideUpdateEquipmentUnitModal()} className='button'>Đóng</Button>
    </Form.Item>
    </div>
    </Form>
    </Modal>);
};
export default ModalUpdateEquipmentUnit;