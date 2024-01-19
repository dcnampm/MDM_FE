import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import LayoutSystem from 'containers/Layout';
import { ACCESS_TOKEN } from 'constants/auth.constant';
import NotFoundPage from 'containers/NotFoundPage';
// import { has } from 'lodash';
import { hasAuthority } from '../utils/globalFunc.util';
import { Authority } from '../constants/authority';

interface PrivateRouteProps {
  children: React.ReactNode;
  requiredAuthority: Authority;//user must have at least one of these authorities
}

const PrivateRoute = ({ children, requiredAuthority }: PrivateRouteProps) => {
  const navigate = useNavigate();
  const isLogin: boolean = Boolean(localStorage.getItem(ACCESS_TOKEN));
  if (!isLogin) {
    navigate('/signin');
    window.location.href = '/signin';
    return (<Navigate to="/signin" />);
  }
  if (hasAuthority(requiredAuthority)) {
    return (<LayoutSystem>{children}</LayoutSystem>);
  } else {
    return (<NotFoundPage />);
  }
};

export default PrivateRoute;
