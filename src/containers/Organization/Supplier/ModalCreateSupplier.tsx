import { Button, Form, Input, Modal, Select } from 'antd';
import { toast } from 'react-toastify';
import { useContext, useState } from 'react';
import { UpsertSupplierForm } from '../../../types/supplier.type';
import supplierApi from '../../../api/supplierApi';
import { options } from '../../../utils/globalFunc.util';
import { FilterContext } from '../../../contexts/filter.context';
import TextArea from 'antd/lib/input/TextArea';

export interface ModalCreateSupplierProps {
  showCreateSupplierModal: boolean;
  hideCreateSupplierModal: () => void;
  callback: () => void;
}

export const ModalCreateSupplier = (props: ModalCreateSupplierProps) => {
  const { showCreateSupplierModal, hideCreateSupplierModal, callback } = props;
  const [form] = Form.useForm<UpsertSupplierForm>();
  const [loading, setLoading] = useState<boolean>(false);
  const { services } = useContext(FilterContext);
  const createSupplier = (values: UpsertSupplierForm) => {
    setLoading(true);
    supplierApi.createSupplier(values).then(() => {
      toast.success('Tạo nhà cung cấp thành công');
    }).finally(() => {
      setLoading(false);
      hideCreateSupplierModal();
      form.resetFields();
      callback();
    });
  };

  return (<Modal
    title='Tạo mới nhà cung cấp'
    open={showCreateSupplierModal}
    onCancel={() => {
      hideCreateSupplierModal();
    }}
    footer={null}
    width={1000}
  >
    <Form form={form} layout='vertical' size='large' onFinish={createSupplier}>
      <div className='grid grid-cols-2 gap-5'>

        <Form.Item
          label='Tên nhà cung cấp' name='name' required={true} rules={[
          { required: true, message: 'Vui lòng nhập tên nhà cung cấp' },
        ]}>
          <Input className='input' />
        </Form.Item>
        <Form.Item
          label=' Địa chỉ' name='address'
          required={true} rules={[
          { required: true, message: 'Vui lòng nhập địa chỉ' },
        ]}
        >
          <Input className='input' />
        </Form.Item>

        <Form.Item
          label=' Hotline' name='hotline'
          required={true} rules={[
          { required: true, message: 'Vui lòng nhập hotline' },
        ]}
        >
          <Input className='input' />
        </Form.Item>
        <Form.Item
          label=' Email' name='email'
          required={true} rules={[
          { required: true, message: 'Vui lòng nhập email' },
        ]}
        >
          <Input className='input' />
        </Form.Item>
        <Form.Item
          label='Fax' name='fax'
        >
          <Input className='input' />
        </Form.Item>
        <Form.Item
          label=' Website' name='website'

        >
          <Input className='input' />
        </Form.Item>
        <Form.Item
          label=' Mã số thuế' name='taxCode'

        >
          <Input className='input' />
        </Form.Item>

        <Form.Item
          label=' Loại dịch vụ công ty cung cấp' name='serviceIds' required={true} rules={[
          { required: true, message: ' Vui lòng chọn ít nhất 1 loại dịch vụ' },

        ]}
        >
          <Select
            showSearch
            placeholder=' Chọn loại dịch vụ'
            optionFilterProp='children'
            allowClear
            filterOption={(input, option) => (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())}
            options={options(services)}
            mode={'multiple'}
          />
        </Form.Item>


      </div>
      <Form.Item
        label=' Ghi chú' name='note'>
        <TextArea rows={2} className='input' />
      </Form.Item>
      <div className='flex flex-row justify-end gap-4'>
        <Form.Item>
          <Button htmlType='submit' className='button' loading={loading}>Xác nhận</Button>
        </Form.Item>
        <Form.Item>
          <Button onClick={() => hideCreateSupplierModal()} className='button'>Đóng</Button>
        </Form.Item>
      </div>
    </Form>
  </Modal>);
};
