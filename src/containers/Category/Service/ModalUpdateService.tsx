import { Button, Form, Input, Modal } from 'antd';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { ServiceDto, UpsertServiceForm } from '../../../types/service.type';
import { mapServiceDtoToUpsertServiceForm } from '../../../utils/mapper.util';
import serviceApi from '../../../api/service.api';

export interface ModalUpdateServiceProps {
  showUpdateServiceModal: boolean;
  hideUpdateServiceModal: () => void;
  callback: () => void;
  updateServiceModalData?: ServiceDto;
}

export const ModalUpdateService = (props: ModalUpdateServiceProps) => {
  const { showUpdateServiceModal, hideUpdateServiceModal, callback, updateServiceModalData } = props;
  const [form] = Form.useForm<UpsertServiceForm>();
  const [loading, setLoading] = useState<boolean>(false);
  const updateService = (values: UpsertServiceForm) => {
    setLoading(true);
    serviceApi.updateService(updateServiceModalData?.id as number, values).then(() => {
      toast.success('Cập nhật dịch vụ thành công');
    }).finally(() => {
      setLoading(false);
      hideUpdateServiceModal();
      form.resetFields();
      callback();
    });
  };
  useEffect(() => {
    form.resetFields();
    form.setFieldsValue(mapServiceDtoToUpsertServiceForm(updateServiceModalData as ServiceDto));
  }, [updateServiceModalData]);
  return (<Modal
    title='Cập nhật dịch vụ'
    open={showUpdateServiceModal}
    onCancel={() => {
      hideUpdateServiceModal();
    }}
    footer={null}
  >
    <Form form={form} layout='vertical' size='large' onFinish={updateService}>
      <div className='grid grid-cols-1 gap-5'>

        <Form.Item
          label='Tên dịch vụ' name='name' required={true} rules={[
          { required: true, message: 'Vui lòng nhập tên dịch vụ' },
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
          <Button onClick={() => hideUpdateServiceModal()} className='button'>Đóng</Button>
        </Form.Item>
      </div>
    </Form>
  </Modal>);
};
