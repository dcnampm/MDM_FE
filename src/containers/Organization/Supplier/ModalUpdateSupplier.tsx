import { Button, Form,  Input, Modal, Select } from 'antd';
import { toast } from 'react-toastify';
import { useContext, useEffect, useState } from 'react';
import { SupplierFullInfoDto, UpsertSupplierForm } from '../../../types/supplier.type';
import { mapSupplierFullInfoDtoToUpsertSupplierForm } from '../../../utils/mapper.util';
import supplierApi from '../../../api/supplierApi';
import TextArea from 'antd/lib/input/TextArea';
import { options } from '../../../utils/globalFunc.util';
import { FilterContext } from '../../../contexts/filter.context';

export interface ModalUpdateSupplierProps {
  showUpdateSupplierModal: boolean;
  hideUpdateSupplierModal: () => void;
  callback: () => void;
  updateSupplierModalData?: SupplierFullInfoDto;
}

export const ModalUpdateSupplier = (props: ModalUpdateSupplierProps) => {
  const { showUpdateSupplierModal, hideUpdateSupplierModal, callback, updateSupplierModalData } = props;
  const [form] = Form.useForm<UpsertSupplierForm>();
  const [loading, setLoading] = useState<boolean>(false);
  const { services } = useContext(FilterContext);
  const updateSupplier = (values: UpsertSupplierForm) => {
    setLoading(true);
    supplierApi.updateSupplier(updateSupplierModalData?.id as number, values).then(() => {
      toast.success('Cập nhật nhà cung cấp thành công');
    }).finally(() => {
      setLoading(false);
      hideUpdateSupplierModal();
      form.resetFields();
      callback();
    });
  };
  useEffect(() => {
    form.resetFields();
    form.setFieldsValue(mapSupplierFullInfoDtoToUpsertSupplierForm(updateSupplierModalData as SupplierFullInfoDto));
  }, [updateSupplierModalData]);
  return (<Modal
    width={1000}
    title='Cập nhật nhà cung cấp'
    open={showUpdateSupplierModal}
    onCancel={() => {
      hideUpdateSupplierModal();
    }}
    footer={null}
  >
    <Form form={form} layout='vertical' size='large' onFinish={updateSupplier}>
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
          { required: true, message: 'Vui lòng nhập kí hiệu thiết bị' },
        ]}
        >
          <Input className='input' />
        </Form.Item>

        <Form.Item
          label=' Hotline' name='hotline'
          required={true} rules={[
          { required: true, message: 'Vui lòng nhập kí hiệu thiết bị' },
        ]}
        >
          <Input className='input' />
        </Form.Item>
        <Form.Item
          label=' Email' name='email'
          required={true} rules={[
          { required: true, message: 'Vui lòng nhập kí hiệu thiết bị' },
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
          { required: true, message: ' Vui lòng chọn ít nhật 1 loại dịch vụ' },
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
          <Button onClick={() => hideUpdateSupplierModal()} className='button'>Đóng</Button>
        </Form.Item>
      </div>
    </Form>
  </Modal>);
};
