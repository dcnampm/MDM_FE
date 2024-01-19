import { Button, DatePicker, Divider, Form, Input, Select, Space } from 'antd';
import React, { useContext, useState } from 'react';
import { UpsertUserForm } from '../../../types/user.type';
import ava from 'assets/image.png';
import { convertBase64, getDepartmentOptions, getRolesOptions, options } from '../../../utils/globalFunc.util';
import { ISO_DATE_FORMAT } from 'constants/dateFormat.constants';
import { FilterContext } from '../../../contexts/filter.context';
import { Authority } from '../../../constants/authority';
import userApi from '../../../api/user.api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const CreateUser = () => {

  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm<UpsertUserForm>();
  const { roles, departments } = useContext(FilterContext);
  const roleBGD = roles?.find((item: any) => item?.name === Authority.BGD);
  const [imageToBeUploaded, setImageToBeUploaded] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [image, setImage] = useState<any>('');
  const [isHiddenDepartmentResponsibilities, setIsHiddenDepartmentResponsibilities] = useState<boolean>(true);
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
  const createUser = (values: UpsertUserForm) => {
    setLoading(true);
    console.log(values);
    userApi.createUser(values, imageToBeUploaded).then((res: any) => {
      toast.success('Tạo người dùng thành công');
      navigate('/organization/users');
    }).finally(() => {
      setLoading(false);
    });
  };

  
  return <div>
    <div className='flex-between-center'>
      <div className='title'> THÊM NGƯỜI DÙNG</div>
    </div>
    <Divider />
    <div className='flex-between mt-10'>
      <Form
        form={form}
        className='basis-2/3'
        layout='vertical'
        size='large'
        onFinish={createUser}
        // initialValues={{ departmentResponsibilityIds: initialDepartmentResponsibilityIds }}
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
            required={true}
            rules={[{ required: true, message: 'Hãy chọn ngày sinh!' }]}
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
            required={true}
            rules={[{ required: true, message: 'Hãy nhập mật khẩu!' }]}
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
            // options={options(roles)} 
            options={getRolesOptions(roles)}
            />
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
                required: !isHiddenDepartmentResponsibilities, message: 'Hãy chọn khoa phòng phụ trách!'
              }
            ]}
          >
              <Select
                placeholder='Chọn Khoa Phòng phụ trách'
                mode='multiple'
                options={getDepartmentOptions(departments)}
                style={{ width: '100%' }}
              />
            
          </Form.Item>
          
          
        </div> */}
        <Form.Item>
          <Button htmlType='submit' loading={loading} className='button'> Thêm</Button>
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
            {image === '' ?

              
              
                
                // style={{ backgroundImage: `url(${ava})` }}
          
                <img src={ava} alt='ava' className='w-52 h-52 bg-center bg-no-repeat bg-cover' />
              
              /*<img
              src={image == null ? ava : image}
              alt='ava'
              className='w-52 h-52'
            /> */ : <div
                className='w-52 h-52 bg-center bg-no-repeat bg-cover'
                style={{ backgroundImage: `url(${selectedImage})` }}
              ></div>}
          </label>
        </div>
      </div>
    </div>
  </div>;
};

export default CreateUser;
