import { Button, DatePicker, Divider, Form, Input, Select, Space, Tooltip } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { EyeFilled } from '@ant-design/icons';
import { UpsertUserForm, UserDetailDto } from '../../../types/user.type';
import { Authority } from '../../../constants/authority';
import userApi from '../../../api/user.api';
import { mapUserDetailDtoToUpsertUserForm } from '../../../utils/mapper.util';
import { ISO_DATE_FORMAT } from 'constants/dateFormat.constants';
import { convertBase64, createImageSourceFromBase64, getDepartmentOptions } from '../../../utils/globalFunc.util';
import { FilterContext } from '../../../contexts/filter.context';
import ava from '../../../assets/image.png';
import { toast } from 'react-toastify';
import { fileApi } from '../../../api/file.api';

const DetailUser = () => {

  const params: any = useParams<{ userId: string }>();
  const { userId } = params;
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm<UpsertUserForm>();
  const [headOfUserOptions, setHeadOfUserOptions] = useState<UserDetailDto[]>([]);
  const [managerOptions, setManagerOptions] = useState<UserDetailDto[]>([]);
  const [chiefNurseOptions, setChiefNurseOptions] = useState<UserDetailDto[]>([]);
  const [contactPerson, setContactPerson] = useState<UserDetailDto[]>([]);
  const [isHiddenDepartmentResponsibilities, setIsHiddenDepartmentResponsibilities] = useState<boolean>(true);

  const [imageUrl, setImageUrl] = useState<string | null>('');
  const [imageId, setImageId] = useState<number>(0);
  const [image, setImage] = useState<any>('');
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [imageToBeUploaded, setImageToBeUploaded] = useState<any>(null);
  const { roles, departments } = useContext(FilterContext);
  const roleBGD = roles?.find((item: any) => item?.name === Authority.BGD);
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
          <Link to={`/user/detail/${item.id}`}><EyeFilled /></Link>
        </Tooltip>
      </div>),
    },
  ];


  const updateUser = (values: UpsertUserForm) => {
    setLoading(true);
    userApi.updateUser(userId, values, imageToBeUploaded).then((res) => {
      toast.success('Cập nhật người dùng thành công');
    }).finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    setLoading(true);
    getUserOptions();
    userApi.getUserById(userId).then(value => {
      form.setFieldsValue(mapUserDetailDtoToUpsertUserForm(value.data.data));
      setImageId(value.data.data.imageId);
      fileApi.getImage(value.data.data.imageId).then((res) => {
        setImageUrl(createImageSourceFromBase64(res.data.data.data));
      });
    }).finally(() => {
      setLoading(false);
    });
  }, [userId]);

  const getUserOptions = () => {
    if (headOfUserOptions.length > 0 || managerOptions.length > 0 || chiefNurseOptions.length > 0 || contactPerson.length > 0) {
      return;
    }
    userApi.getUsers({
      roleNames: [
        Authority.TK.toString(), Authority.TPVT.toString(), Authority.DDT.toString(), Authority.BGD.toString(),
      ],
    }, { page: 0, size: 1000 }).then((res) => {
      setHeadOfUserOptions(res.data.data.content.filter((user) => user.role?.name === Authority.TK.toString() || user.role?.name ===
        Authority.TPVT.toString()));
      setChiefNurseOptions(res.data.data.content.filter((user) => user.role?.name === Authority.DDT.toString() || user.role?.name ===
        Authority.TPVT.toString()));
      setManagerOptions(res.data.data.content.filter((user) => user.role?.name === Authority.BGD.toString() || user.role?.name === Authority.TPVT.toString()));
      setContactPerson(res.data.data.content);
    });
  };


  const handleChangeImg = async (e: any) => {
    let file = e.target.files[0];
    setImageToBeUploaded(file);
    if (file) {
      let img = URL.createObjectURL(file);
      let fileBase64 = await convertBase64(file);
      setSelectedImage(img);
      setImage(fileBase64);
    }
  };
  return (<div>
    <div className='flex-between-center'>
      <div className='title'> CHI TIẾT NGƯỜI DÙNG</div>
    </div>
    <Divider />
    <div>
      <div className='title text-center'>THÔNG TIN CHUNG</div>
      <div className='flex-between mt-10'>
        <Form
          form={form}
          className='basis-2/3'
          layout='vertical'
          size='large'
          onFinish={updateUser}
        >
          <Form.Item name='id' required style={{ display: 'none' }}>
            <Input style={{ display: 'none' }} />
          </Form.Item>
          <div className='grid grid-cols-2 gap-5'>
            <Form.Item
              label='Họ và tên'
              name='name'
              required
              rules={[{ required: true, message: 'Hãy nhập họ và tên!' }]}
              className='mb-5'
            >
              <Input
                placeholder='Nhập tên người dùng'
                allowClear
                className='rounded-lg h-9 border-[#A3ABEB] border-2'
              />
            </Form.Item>
            <Form.Item
              label='Email'
              name='email'
              className='mb-5'
              required
              rules={[
                { required: true, message: 'Hãy nhập email!' }, { type: 'email', message: 'Nhập đúng định dạng email' },
              ]}
            >
              <Input
                placeholder='Nhập email'
                allowClear
                className='rounded-lg h-9 border-[#A3ABEB] border-2'
              />
            </Form.Item>
          </div>

          <div className='grid grid-cols-2 gap-5'>
            <Form.Item
              label='Tên đăng nhập'
              name='username'
              className='mb-5'

            >
              <Input
                disabled={true}
                placeholder='Nhập tên đăng nhập'
                allowClear
                className='rounded-lg h-9 border-[#A3ABEB] border-2'
              />
            </Form.Item>
            <Form.Item
              label='Số điện thoại'
              name='phone'
              className='mb-5'
              required
              rules={[
                {
                  required: true, message: 'Hãy nhập số điện thoại!',
                },
              ]}
            >
              <Input
                placeholder='Nhập số điện thoại'
                allowClear
                className='rounded-lg h-9 border-[#A3ABEB] border-2'
              />
            </Form.Item>
          </div>
          <div className='grid grid-cols-2 gap-5'>
            <Form.Item
              label='Giới tính'
              name='gender'
              className='mb-5'
              rules={[{ required: true, message: 'Hãy chọn giới tính!' }]}
              required={true}
            >
              <Select
                placeholder='Chọn giới tính'
                options={[
                  { label: 'Nam', value: true }, { label: 'Nữ', value: false },
                ]}
              />
            </Form.Item>

            <Form.Item
              label='Ngày sinh'
              name='birthday'
              className='mb-5'
            >
              <DatePicker
                style={{
                  width: '100%',
                }}
                allowClear={false}
                format={ISO_DATE_FORMAT}
              />
            </Form.Item>
          </div>
          <div className='grid grid-cols-2 gap-5'>
            <Form.Item label='Địa chỉ' name='address' className='mb-5'>
              <Input
                placeholder='Nhập địa chỉ'
                allowClear
                className='rounded-lg h-9 border-[#A3ABEB] border-2'
              />
            </Form.Item>
            <Form.Item
              label='Mật khẩu' name='password' className='mb-5'
            >
              <Input
                type='password'
                placeholder=' Nhập mật khẩu'
                allowClear
                className='rounded-lg h-9 border-[#A3ABEB] border-2'
              />
            </Form.Item>
          </div>
          <div className='grid grid-cols-2 gap-5'>
            <Form.Item
              label='Khoa Phòng' name='departmentId' className='mb-5'
              required={true}
              rules={[{ required: true, message: 'Hãy chọn khoa phòng!' }]}
            >
              <Select
                options={getDepartmentOptions(departments)} />
            </Form.Item>
            <Form.Item
              label='Chức vụ' name='roleId' className='mb-5'
              required={true}
              rules={[{ required: true, message: 'Hãy chọn chức vụ!' }]}
            >
              <Select
                style={{ width: '100%' }} 
              //   onChange={value => {
              //   if (roleBGD?.id === value) {
              //     setIsHiddenDepartmentResponsibilities(false);
              //   } else {
              //     setIsHiddenDepartmentResponsibilities(true);
              //   }
              // }} 
              options={options(roles)} />
            </Form.Item>
          </div>
          {/* <div className='grid grid-cols-1 gap-5'>
            <Form.Item
              label='Khoa phòng phụ trách'
              name='departmentResponsibilityIds'
              className='mb-5 h-auto'
              hidden={isHiddenDepartmentResponsibilities}
              required={!isHiddenDepartmentResponsibilities}
              rules={[
                {
                  required: !isHiddenDepartmentResponsibilities, message: 'Hãy chọn khoa phòng phụ trách!',
                },
              ]}
            >
                <Select
                  placeholder='Chọn Khoa Phòng phụ trách'
                  options={getDepartmentOptions(departments)}
                  mode={'multiple'}
                  style={{ width: '100%' }}
                />
              
            </Form.Item>
          </div> */}
          <Form.Item>
            <Button htmlType='submit' loading={loading} className='button'>
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
        <div className='basis-1/3 mt-4 flex flex-col items-center'>
          <div className='text-center mb-4'>Ảnh đại diện</div>
          <div className='preview-content'>
            <input
              type='file'
              hidden
              className='form-control'
              id='inputImage'
              onChange={(e: any) => handleChangeImg(e)}
            />
            <label className='text-center' htmlFor='inputImage'>
              {selectedImage == null ? (
                imageId === null ? (//chua chon anh va doi tuong chua co san anh
                  <img
                    // src={image as string | undefined}
                    src={image}
                    className='w-52 h-52'
                    style={{ backgroundImage: `url(${ava})`}}
                  />) : 
                  (//chua chon anh va doi tuong da co san anh
                  <div
                    className='w-52 h-52 bg-center bg-no-repeat bg-cover'
                    style={{ backgroundImage: `url(${imageUrl})`}}
                  ></div>)) 
                  : 
                  (//da chon anh
                <div
                  className='w-52 h-52 bg-center bg-no-repeat bg-cover'
                  style={{ backgroundImage: `url(${selectedImage})` }}
                ></div>)}
            </label>
          </div>
        </div>
      </div>

    </div>
  </div>);
};

export default DetailUser;
