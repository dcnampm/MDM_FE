import { Button, Form, Input, Modal } from 'antd';
import serviceApi from '../../../api/service.api';
import { toast } from 'react-toastify';
import { useState } from 'react';
import {  UpsertServiceForm } from '../../../types/service.type';

export interface ModalCreateServiceProps {
  showCreateServiceModal: boolean;
  hideCreateServiceModal: () => void;
  callback: () => void;
}

export const ModalCreateService = (props: ModalCreateServiceProps) => {
  const { showCreateServiceModal, hideCreateServiceModal, callback } = props;
  const [form] = Form.useForm<UpsertServiceForm>();
  const [loading, setLoading] = useState<boolean>(false);
  const createService = (values: UpsertServiceForm) => {
    setLoading(true);
    serviceApi.createService(values).then(() => {
      toast.success('Tạo dịch vụ thành công');
    }).finally(() => {
      setLoading(false);
      hideCreateServiceModal();
      form.resetFields();
      callback();
    });
  };

  return (<Modal
    title='Tạo mới dịch vụ'
    open={showCreateServiceModal}
    onCancel={() => {
      hideCreateServiceModal();
    }}
    footer={null}
  >
    <Form form={form} layout='vertical' size='large' onFinish={createService}>
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
          <Button onClick={() => hideCreateServiceModal()} className='button'>Đóng</Button>
        </Form.Item>
      </div>
    </Form>
  </Modal>);
};
