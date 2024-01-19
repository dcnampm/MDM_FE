import React, { useState } from 'react';
import bg from 'assets/bg.jpg';
import authApi from '../../api/auth.api';
import { useLocation, useNavigate } from 'react-router-dom';
import { ConfirmResetPasswordForm } from '../../types/auth.type';
import { toast } from 'react-toastify';
import FormInputPassword from '../../components/FormInput/Password';

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean>(false);
  const location = useLocation();
  const [newPasswordError, setNewPasswordError] = useState<string>();
  const searchParams = new URLSearchParams(location.search);
  const uuid = searchParams.get('uuid');
  const confirmResetPassword = () => {
    const params: ConfirmResetPasswordForm = {
      uuid: uuid || '', newPassword: newPassword, confirmPassword: confirmPassword,
    };
    authApi.confirmResetPassword(params).then(res => {
      toast.success(res.data.message);
      navigate('/signin');
    }).catch(reason => {
      toast.error(reason);
      console.log('reason', reason);
    });
  };
  const validateIfConfirmPasswordIsMatch = (confirmPassword: string) => {
    if (!(newPassword === confirmPassword)) {
      setConfirmPasswordError('Mật khẩu xác nhận sai!');
      setIsValid(false);
      return;
    }
    setNewPasswordError('');
    setConfirmPasswordError('');
    setIsValid(true);
  };
  const validateNewPassword = (value: string) => {
    if (value === '') {
      setIsValid(false);
      setNewPasswordError('Bạn chưa nhập mật khẩu!');
      return;
    }

  };
  return (<>
    <div className='grid grid-cols-2 w-screen h-screen'>
      <div className='flex flex-col justify-between bg-amber-50'>
        <div className='flex justify-center items-center flex-col pt-24'>
          <div className='bg-white p-10 rounded-3xl w-96 shadow-2xl'>
            <div className='text-center font-medium text-2xl mb-12'>HỆ THỐNG QUẢN LÝ THIẾT BỊ VÀ VẬT TƯ Y TẾ</div>
            <FormInputPassword
              title='Mật khẩu mới'
              placeHoder='Nhập mật khẩu mới'
              value={newPassword}
              error={newPasswordError}
              onChange={(e: any) => {
                setNewPassword(e.target.value);
                setTimeout(() => {
                  validateNewPassword(e.target.value);
                  validateIfConfirmPasswordIsMatch(confirmPassword);
                }, 100);
              }}
              type='password'
            />
            <FormInputPassword
              title='Xác nhận mật khẩu'
              placeHoder='Xác nhận mật khẩu'
              value={confirmPassword}
              error={confirmPasswordError}
              onChange={(e: any) => {
                setConfirmPassword(e.target.value);
                setTimeout(() => {
                  validateIfConfirmPasswordIsMatch(e.target.value);
                }, 100);
              }}
              type='password'
            />
            <div className='flex flex-col gap-4 mt-12'>
              <div
                onClick={() => {
                  confirmResetPassword();
                }}
                className={`rounded-lg h-10 flex items-center justify-center  ${isValid ? 'bg-blue-400 cursor-pointer' : 'bg-zinc-300 cursor-not-allowed'}`}
              >
                <div>Xác nhận</div>
              </div>
            </div>
          </div>
        </div>
        <div className='mb-4 ml-4'>© 2022 All rights reserved.</div>
      </div>
      <div className='p-12 bg-center bg-no-repeat bg-cover'
           style={{
             backgroundImage: `url(${bg})`,
           }}>
      </div>
    </div>
  </>);
};

export default ResetPassword;
