import { Button, DatePicker, Divider, Form, Input, Select, Space } from 'antd';
import userApi from 'api/user.api';
import { FilterContext } from 'contexts/filter.context';
import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { convertBase64, createImageSourceFromBase64, getDepartmentOptions } from 'utils/globalFunc.util';
import ava from 'assets/image.png';
import { CURRENT_USER } from 'constants/auth.constant';
import { GenericResponse } from '../../types/commonResponse.type';
import { UserDetailDto } from '../../types/user.type';
import { ISO_DATE_FORMAT } from '../../constants/dateFormat.constants';
import moment from 'moment';
import { DepartmentDto } from '../../types/department.type';
import { fileApi } from '../../api/file.api';

const Profile = () => {
  const user: UserDetailDto = JSON.parse(localStorage.getItem(CURRENT_USER) || '');
  const { id } = user;
  const [form] = Form.useForm();
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [image, setImage] = useState<any>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { roles, departments } = useContext(FilterContext);
  const [error, setError] = useState<any>();
  const [imageId, setImageId] = useState<number>(0);
  const [imageToBeUploaded, setImageToBeUploaded] = useState<any>(null);
  const [imageUrl, setImageUrl] = useState<string | null>('');
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

  const getDetail = () => {
    userApi.currentLoggedInUserDetail().then((res) => {
      const response: GenericResponse<UserDetailDto> = res.data;
      if (response.success) {
        const userDetailDto = response.data;
        setFormData(userDetailDto);
        setImageId(userDetailDto.imageId);
        fileApi.getImage(userDetailDto.imageId).then((res) => {
          setImageUrl(createImageSourceFromBase64(res.data.data.data));
        });
      }
    });
  };
  const setFormData = (userDetailDto: UserDetailDto) => {
    form.setFieldsValue({
      id: userDetailDto.id,
      name: userDetailDto.name,
      phone: userDetailDto.phone,
      email: userDetailDto.email,
      address: userDetailDto.address,
      roleName: userDetailDto.role?.name,
      username: userDetailDto.username,
      gender: userDetailDto.gender,
      birthday: moment(userDetailDto.birthday),
    });
  };
  const onFinish = (values: any) => {
    setLoading(true);
    userApi
      .updateProfile(values, imageToBeUploaded)
      .then((response) => {
        setFormData(response.data.data);
        toast.success('Cập nhật thông tin thành công!');
      })
      .catch(() => toast.error('Cập nhật thông tin thất bại!'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getDetail();
  }, []);

  return error == null ? (<div>
    <div className='flex-between-center'>
      <div className='title'>Thông tin tài khoản</div>
    </div>
    <Divider />
    <div className='flex-between mt-10'>
      <Form
        form={form}
        className='basis-2/3'
        layout='vertical'
        size='large'
        onFinish={onFinish}
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
            rules={[{ required: true, message: 'Hãy nhập tên đăng nhập!' }]}
            required={true}
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
        <div className='grid grid-cols-1 gap-5'>
          <Form.Item label='Địa chỉ' name='address' className='mb-5'>
            <Input
              placeholder='Nhập địa chỉ'
              allowClear
              className='rounded-lg h-9 border-[#A3ABEB] border-2'
            />
          </Form.Item>
        </div>
        <div className='grid grid-cols-2 gap-5'>
          <Form.Item label='Khoa Phòng' name='department' className='mb-5'>
            <Select defaultValue={user.department.name} disabled />
          </Form.Item>
          <Form.Item label='Chức vụ' name='roleName' className='mb-5'>
            <Select style={{ width: '100%' }} disabled />
          </Form.Item>
        </div>
        <div className='grid grid-cols-1 gap-5'>
          <Form.Item
            label='Khoa phòng phụ trách'
            name='departmentResponsibilities'
            className='mb-5 h-auto'
          >
            <Space style={{ width: '100%' }} direction='vertical'>
              <Select
                placeholder='Chọn Khoa Phòng phụ trách'
                options={getDepartmentOptions(departments)}
                mode={'multiple'}
                defaultValue={user.departmentResponsibilities.map((item: DepartmentDto) => item.name)}
                disabled
                style={{ width: '100%' }}
              />
            </Space>
          </Form.Item>
        </div>
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
            {image === '' || imageId === 0 ? (<img
              src={image == null ? ava : imageUrl as string | undefined}
              alt='ava'
              className='w-52 h-52'
            />) : (<div
              className='w-52 h-52 bg-center bg-no-repeat bg-cover'
              style={{ backgroundImage: `url(${selectedImage})` }}
            ></div>)}
          </label>
        </div>
      </div>
    </div>
  </div>) : (<div className='flex-between-center'>
    <div className='title'>{error}</div>
  </div>);
};

export default Profile;
