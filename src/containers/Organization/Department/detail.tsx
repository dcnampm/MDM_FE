import { Button, Divider, Form, Input, Select, Table, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { EyeFilled } from '@ant-design/icons';
import { UpsertDepartmentForm } from '../../../types/department.type';
import userApi from '../../../api/user.api';
import { Authority } from '../../../constants/authority';
import { UserDetailDto } from '../../../types/user.type';
import departmentApi from '../../../api/department.api';
import { mapDepartmentFullInfoDtoToUpsertDepartmentForm } from '../../../utils/mapper.util';
import { toast } from 'react-toastify';

const DetailDepartment = () => {

  const params: any = useParams<{ departmentId: string }>();
  const { departmentId } = params;
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm<UpsertDepartmentForm>();
  const [headOfDepartmentOptions, setHeadOfDepartmentOptions] = useState<UserDetailDto[]>([]);
  const [managerOptions, setManagerOptions] = useState<UserDetailDto[]>([]);
  const [chiefNurseOptions, setChiefNurseOptions] = useState<UserDetailDto[]>([]);
  const [contactPerson, setContactPerson] = useState<UserDetailDto[]>([]);
  const [userInThisDepartment, setUserInThisDepartment] = useState<UserDetailDto[]>([]);

  const options = (array: any) => {
    return array?.length > 0 && array?.map((item: UserDetailDto) => {
      let o: any = {};
      o.value = item?.id;
      o.label = item?.name;
      return o;
    });
  };

  const columns: any = [
    {
      title: 'Tên hiển thị', dataIndex: 'name', key: 'name',
    }, {
      title: 'Email', key: 'email', dataIndex: 'email',
    }, {
      title: 'Số điện thoại', key: 'phone', dataIndex: 'phone',
    }, {
      title: 'Địa chỉ', key: 'address', dataIndex: 'address',
    }, {
      title: 'Chức vụ', key: 'role_id', render: (item: UserDetailDto) => (<>{item.role?.name}</>),
    }, {
      title: 'Tác vụ', key: 'action', render: (item: UserDetailDto) => (<div>
        <Tooltip title='Chi tiết người dùng' className='mr-4'>
          <Link to={`/organization/users/${item.id}`}><EyeFilled /></Link>
        </Tooltip>
      </div>),
    },
  ];


  const updateDepartment = (values: UpsertDepartmentForm) => {
    setLoading(true);
    departmentApi.updateDepartment(departmentId, values).then((res) => {
      toast.success('Cập nhật khoa phòng thành công');
    }).finally(() => {
      setLoading(false);
    })
  };

  useEffect(() => {
    setLoading(true);
    getUserOptions();
    departmentApi.getDepartmentById(departmentId).then(value => {
      form.setFieldsValue(mapDepartmentFullInfoDtoToUpsertDepartmentForm(value.data.data));
      setUserInThisDepartment(value.data.data.users);
    }).finally(() => {
      setLoading(false);
    });
  }, [departmentId]);

  const getUserOptions = () => {
    if (headOfDepartmentOptions.length > 0 || managerOptions.length > 0 || chiefNurseOptions.length > 0 || contactPerson.length > 0) {
      return;
    }
    userApi.getUsers({
      roleNames: [
        Authority.TK.toString(), Authority.TPVT.toString(), Authority.DDT.toString(), Authority.BGD.toString(),
      ],
    }, { page: 0, size: 1000 }).then((res) => {
      setHeadOfDepartmentOptions(res.data.data.content.filter((user) => user.role?.name === Authority.TK.toString() || user.role?.name ===
        Authority.TPVT.toString() || user.role?.name === Authority.DDT.toString() || user.role?.name === Authority.BGD.toString()));
      setChiefNurseOptions(res.data.data.content.filter((user) => user.role?.name === Authority.DDT.toString() || user.role?.name === Authority.TPVT.toString()));
      setManagerOptions(res.data.data.content.filter((user) => user.role?.name === Authority.BGD.toString() || user.role?.name === Authority.TPVT.toString()));
      setContactPerson(res.data.data.content);
    });
  };

  const [selectedValue, setSelectedValue] = useState(undefined);

  const handleSelectChange = (value : any) => {
    setSelectedValue(value);
  };

  const handleClear = () => {
    // When the clear button is clicked, set the selected value to null
    setSelectedValue(undefined);
  };


  return (<div>
    <div className='flex-between-center'>
      <div className='title'>CHI TIẾT KHOA PHÒNG</div>
    </div>
    <Divider />
    <div>
      <div className='title text-center'>THÔNG TIN CHUNG</div>
      <Form
        form={form}
        className=''
        layout='vertical'
        size='large'
        onFinish={updateDepartment}
      >
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
          <Form.Item
            label=' Địa chỉ' name='address'>
            <Input className='input' />
          </Form.Item>
          <Form.Item
            label=' Trưởng khoa' name='headOfDepartmentId'
          >
            <Select
              showSearch
              placeholder=' Chọn trưởng khoa'
              optionFilterProp='children'
              allowClear
              onClick={() => {
                // getUserOptions();
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
                // getUserOptions();
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
              // onClear={options(null)}
              allowClear
              onClick={() => {
                // getUserOptions();
              }}
              filterOption={(input, option) => (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())}
              options={options(managerOptions)}
              onChange={handleSelectChange}
              onClear={handleClear}
              value={selectedValue}
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

                // getUserOptions();
              }}
              filterOption={(input, option) => (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())}
              options={options(contactPerson)}
            />
          </Form.Item>
        </div>

        <Form.Item>
          <Button
            htmlType='submit'
            loading={loading}
            className='button'
          >
            Cập nhật
          </Button>
        </Form.Item>
      </Form>
    </div>

    <div>
      <div className='title text-center'>DANH SÁCH NHÂN VIÊN</div>
      <Table
        columns={columns}
        dataSource={userInThisDepartment}
        className='mt-6 shadow-md'
        loading={loading}
      />
    </div>
  </div>);
};

export default DetailDepartment;