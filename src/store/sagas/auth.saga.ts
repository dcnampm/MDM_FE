import { call, put, takeEvery } from '@redux-saga/core/effects';
import authApi from 'api/auth.api';
import { ACCESS_TOKEN, CURRENT_USER, REFRESH_TOKEN } from 'constants/auth.constant';
import { push } from 'connected-react-router';
import { LoginPayLoad, authActions } from '../slices/auth.slice';
import { TokenResponse } from '../../types/tokenResponse.type';
import { AxiosResponse } from 'axios';
import userApi from 'api/user.api';
import { GenericResponse } from 'types/commonResponse.type';
import { UserDetailDto } from '../../types/user.type';

export interface ProcessResponseType {
  code: any;
  data: any;
  message: string;
  success: Boolean;
  status: any;
}

//TODO: handle register
function* handleRegister(action: any) {
  const payload = action.payload;
  try {
    const response: ProcessResponseType = yield call(authApi.register, payload);
    const { message, success } = response?.data;
    if (success) yield put(authActions.registerRequestFinish('Đã gửi link kích hoạt vào email. Bạn vui lòng kiểm tra email')); else yield put(authActions.registerRequestFinish(
      message));
  } catch (error: any) {
    console.log(`error`, error?.response);
    yield put(authActions.registerRequestFinish(''));
  }
}

function* handleLogin(action: any) {
  const payload : LoginPayLoad = action.payload;
  try {
    const response: ProcessResponseType = yield call(authApi.login, payload);
    const tokenResponse: TokenResponse = response.data.data;
    localStorage.setItem(ACCESS_TOKEN, tokenResponse.access_token);
    localStorage.setItem(REFRESH_TOKEN, tokenResponse.refresh_token);
    const { data }: AxiosResponse<GenericResponse<UserDetailDto>> = yield call(userApi.currentLoggedInUserDetail);
    const userDetail = data.data;
    localStorage.setItem(CURRENT_USER, JSON.stringify(userDetail));
    yield put(authActions.loginSuccess(userDetail));
    yield put(push('/'));
    window.location.reload();
  } catch (error: any) {
    yield put(authActions.loginFailed('Tên đăng nhập hoặc mật khẩu không đúng!'));
  }
}
function* handleLogout() {
  // yield call(authApi.logout);
  localStorage.removeItem(ACCESS_TOKEN);
  localStorage.removeItem(REFRESH_TOKEN);
  localStorage.removeItem(CURRENT_USER);
  yield put(push('/signin'));
  window.location.reload();
}

const authSaga = [
  takeEvery(authActions.registerRequest.type, handleRegister), takeEvery(authActions.login.type, handleLogin), takeEvery(authActions.logout.type, handleLogout),
];

export default authSaga;
