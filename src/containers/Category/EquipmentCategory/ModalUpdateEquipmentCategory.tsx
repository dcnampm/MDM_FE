import { Button, Form, Input, Modal, Select } from 'antd';
import { toast } from 'react-toastify';
import { useContext, useEffect, useState } from 'react';
import { EquipmentCategoryFullInfoDto, UpsertEquipmentCategoryForm } from '../../../types/equipmentCategory.type';
import { mapEquipmentCategoryFullInfoDtoToUpsertEquipmentCategoryForm } from '../../../utils/mapper.util';
import { equipmentCategoryApi } from '../../../api/equipmentCategory.api';
import { options } from '../../../utils/globalFunc.util';
import { FilterContext } from '../../../contexts/filter.context';

export interface ModalUpdateEquipmentCategoryProps {
  showUpdateEquipmentCategoryModal: boolean;
  hideUpdateEquipmentCategoryModal: () => void;
  callback: () => void;
  updateEquipmentCategoryModalData?: EquipmentCategoryFullInfoDto;
}

export const ModalUpdateEquipmentCategory = (props: ModalUpdateEquipmentCategoryProps) => {
  const { showUpdateEquipmentCategoryModal, hideUpdateEquipmentCategoryModal, callback, updateEquipmentCategoryModalData } = props;
  const [form] = Form.useForm<UpsertEquipmentCategoryForm>();
  const [loading, setLoading] = useState<boolean>(false);
  const { equipmentGroups } = useContext(FilterContext);
  const updateEquipmentCategory = (values: UpsertEquipmentCategoryForm) => {
    setLoading(true);
    equipmentCategoryApi.updateEquipmentCategory(updateEquipmentCategoryModalData?.id as number, values).then(() => {
      toast.success('Cập nhật loại thiết bị thành công');
    }).finally(() => {
      setLoading(false);
      hideUpdateEquipmentCategoryModal();
      form.resetFields();
      callback();
    });
  };
  useEffect(() => {
    form.resetFields();
    form.setFieldsValue(mapEquipmentCategoryFullInfoDtoToUpsertEquipmentCategoryForm(updateEquipmentCategoryModalData as EquipmentCategoryFullInfoDto));
  }, [updateEquipmentCategoryModalData]);
  return (<Modal
    title='Cập nhật loại thiết bị'
    open={showUpdateEquipmentCategoryModal}
    onCancel={() => {
      hideUpdateEquipmentCategoryModal();
    }}
    footer={null}
  >
    <Form form={form} layout='vertical' size='large' onFinish={updateEquipmentCategory}>
      <div className='grid grid-cols-1 gap-5'>

        <Form.Item
          label='Tên loại thiết bị' name='name' required={true} rules={[
          { required: true, message: 'Vui lòng nhập tên loại thiết bị' },
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


        <Form.Item
          name='groupId'
          required={true}
          label='Nhóm thiết bị'
          rules={[
            { required: true, message: 'Vui lòng chọn nhóm thiết bị' },
          ]}
        >
          <Select
            showSearch
            placeholder=' Chọn nhóm thiết bị'
            optionFilterProp='children'
            allowClear
            filterOption={(input, option) => (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())}
            options={options(equipmentGroups)}
          />
        </Form.Item>

      </div>
      <div className='flex flex-row justify-end gap-4'>
        <Form.Item>
          <Button htmlType='submit' className='button' loading={loading}>Xác nhận</Button>
        </Form.Item>
        <Form.Item>
          <Button onClick={() => hideUpdateEquipmentCategoryModal()} className='button'>Đóng</Button>
        </Form.Item>
      </div>
    </Form>
  </Modal>);
};
