import { Button, Form, Input, Modal, Select } from 'antd';
import { UpsertDepartmentForm } from '../../../types/department.type';
import departmentApi from '../../../api/department.api';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { options } from '../../../utils/globalFunc.util';
import { UserDetailDto } from '../../../types/user.type';
import userApi from '../../../api/user.api';
import { Authority } from '../../../constants/authority';

export interface ModalCreateDepartmentProps {
  showCreateDepartmentModal: boolean;
  hideCreateDepartmentModal: () => void;
  callback: () => void;
}

export const ModalCreateDepartment = (props: ModalCreateDepartmentProps) => {
  const { showCreateDepartmentModal, hideCreateDepartmentModal, callback } = props;
  const [form] = Form.useForm<UpsertDepartmentForm>();
  const [loading, setLoading] = useState<boolean>(false);
  const [headOfDepartmentOptions, setHeadOfDepartmentOptions] = useState<UserDetailDto[]>([]);
  const [managerOptions, setManagerOptions] = useState<UserDetailDto[]>([]);
  const [chiefNurseOptions, setChiefNurseOptions] = useState<UserDetailDto[]>([]);
  const [contactPerson, setContactPerson] = useState<UserDetailDto[]>([]);
  const createDepartment = (values: UpsertDepartmentForm) => {
    setLoading(true);
    departmentApi.createDepartment(values).then((res) => {
      toast.success('Tạo khoa phòng thành công');
    }).finally(() => {
      setLoading(false);
      hideCreateDepartmentModal();
      form.resetFields();
      callback();
    });
  };

  const getUserOptions = () => {
    if (headOfDepartmentOptions.length > 0 || managerOptions.length > 0 || chiefNurseOptions.length > 0 || contactPerson.length > 0) {
      return;
    }
    userApi.getUsers({
      roleNames: [
        Authority.TPVT.toString(), Authority.DDT.toString(), Authority.TK.toString(), Authority.NVPVT.toString(), Authority.BGD.toString(),
      ],
    }, { page: 0, size: 1000 }).then((res) => {
      setHeadOfDepartmentOptions(res.data.data.content.filter((user) => user.role?.name === Authority.TK.toString() || user.role?.name ===
        Authority.TPVT.toString()));
      setChiefNurseOptions(res.data.data.content.filter((user) => user.role?.name === Authority.DDT.toString() || user.role?.name === Authority.TPVT.toString()));
      setManagerOptions(res.data.data.content.filter((user) => user.role?.name === Authority.BGD.toString() || user.role?.name === Authority.TPVT.toString()));
      setContactPerson(res.data.data.content);
    });
  };
  return (<Modal
    width={1000}
    title='Tạo mới khoa phòng'
    open={showCreateDepartmentModal}
    onCancel={() => {
      hideCreateDepartmentModal();
    }}
    footer={null}
  >
    <Form form={form} layout='vertical' size='large' onFinish={createDepartment}>
      <div className='grid grid-cols-2 gap-5'>

        <Form.Item
          label='Tên khoa phòng' name='name' required={true} rules={[
          { required: true, message: 'Vui lòng nhập tên khoa phòng' },
        ]}>
          <Input className='input' />
        </Form.Item>
        <Form.Item
          label=' Kí hiệu' name='alias'>
          <Input className='input' />
        </Form.Item>
        <Form.Item
          label=' Số điện thoại' name='phone'>
          <Input className='input' />
        </Form.Item>
        <Form.Item
          label=' Email' name='email'>
          <Input className='input' />
        </Form.Item>
      </div>
      <Form.Item
        label=' Địa chỉ' name='address'>
        <Input className='input' />
      </Form.Item>
      <div className='grid grid-cols-2 gap-5'>
        <Form.Item
          label=' Trưởng khoa' name='headOfDepartmentId'
        >
          <Select
            showSearch
            placeholder=' Chọn trưởng khoa'
            optionFilterProp='children'
            allowClear
            onClick={() => {

              getUserOptions();
            }}
            filterOption={(input, option) => (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())}
            options={options(headOfDepartmentOptions)}
          />
        </Form.Item>
        <Form.Item
          label=' Điều dưỡng trưởng' name='chiefNurseId'
        >
          <Select
            showSearch
            placeholder=' Chọn điều dưỡng trưởng'
            optionFilterProp='children'
            allowClear
            onClick={() => {
              getUserOptions();
            }}
            filterOption={(input, option) => (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())}
            options={options(chiefNurseOptions)}
          />
        </Form.Item>
        <Form.Item
          label=' Ban giám đốc phụ trách' name='managerId'
        >
          <Select
            showSearch
            placeholder=' Chọn ban giám đốc phụ trách '
            optionFilterProp='children'
            allowClear
            onClick={() => {
              getUserOptions();
            }}
            filterOption={(input, option) => (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())}
            options={options(chiefNurseOptions)}
          />
        </Form.Item>
        <Form.Item
          label=' Đầu mối liên hệ' name='contactPersonId'
        >
          <Select
            showSearch
            placeholder=' Chọn đầu mối liên hệ'
            optionFilterProp='children'
            allowClear
            onClick={() => {

              getUserOptions();
            }}
            filterOption={(input, option) => (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())}
            options={options(chiefNurseOptions)}
          />
        </Form.Item>

      </div>
      <div className='flex flex-row justify-end gap-4'>
        <Form.Item>
          <Button htmlType='submit' className='button' loading={loading}>Xác nhận</Button>
        </Form.Item>
        <Form.Item>
          <Button onClick={() => hideCreateDepartmentModal()} className='button'>Đóng</Button>
        </Form.Item>
      </div>
    </Form>
  </Modal>);
};