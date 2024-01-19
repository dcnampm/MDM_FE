import { Button, Form, Input, Modal } from 'antd';
import authApi from 'api/auth.api';
import { CURRENT_USER } from 'constants/auth.constant';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { ChangePasswordForm } from '../../types/user.type';
import { useNavigate } from 'react-router-dom';
import { GenericResponse } from '../../types/commonResponse.type';

const ModalChangePassword = (props: any) => {

  const navigate = useNavigate();
  const user: any = JSON.parse(localStorage.getItem(CURRENT_USER) || '');
  const {
    showChangePasswordModal, setShowChangePasswordModal,
  } = props;

  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);

  const handleChangePassword = async (values: ChangePasswordForm) => {
    setLoading(true);
    try {
      const response = await authApi.changePassword(values);
      const { success } = response.data;
      if (success) {
        toast.success('Đổi mật khẩu thành công! Vui lòng đăng nhập lại!');
        form.resetFields();
        setShowChangePasswordModal();
        // await authApi.logout();
        navigate('/signin');
      } else {
        toast.error('Đổi mật khẩu thất bại!');
      }
    } catch (error: any) {
      const response: GenericResponse<any> = error?.response?.data;
      const errors: string[] | undefined = response.errors;
      toast.error('Đổi mật khẩu thất bại! ' + errors);
    } finally {
      setLoading(false);
    }
  };

  return (<Modal
    title='Thay đổi mật khẩu'
    open={showChangePasswordModal}
    onCancel={setShowChangePasswordModal}
    footer={null}
  >
    <Form form={form} layout='vertical' size='large' onFinish={handleChangePassword}>
      <Form.Item
        label='Nhập mật khẩu cũ'
        name='oldPassword'
        required
        rules={[{ required: true, message: 'Hãy nhập mật khẩu!' }]}
      >
        <Input.Password className='input' />
      </Form.Item>
      <Form.Item
        label='Nhập mật khẩu mới'
        name='newPassword'
        required
        rules={[{ required: true, message: 'Hãy nhập mật khẩu mới!' }]}
      >
        <Input.Password className='input' />
      </Form.Item>
      <Form.Item
        label='Xác nhận mật khẩu mới'
        name='confirmPassword'
        required
        rules={[{ required: true, message: 'Hãy nhập lại mật khẩu mới!' }]}
      >
        <Input.Password className='input' />
      </Form.Item>

      <div className='flex flex-row justify-end gap-4'>
        <Form.Item>
          <Button htmlType='submit' className='button' loading={loading}>Xác nhận</Button>
        </Form.Item>
        <Form.Item>
          <Button onClick={setShowChangePasswordModal} className='button'>Đóng</Button>
        </Form.Item>
      </div>
    </Form>
  </Modal>);
};

export default ModalChangePassword;