import React, { useContext, useState } from 'react';
import type { MenuProps } from 'antd';
import { Avatar, Badge, Divider, Dropdown, Layout, Menu, Row } from 'antd';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  BarChartOutlined,
  BarsOutlined,
  BellFilled,
  ClusterOutlined,
  DesktopOutlined,
  DownOutlined,
  MessageOutlined,
  SettingOutlined,
  SisternodeOutlined,
  UnorderedListOutlined,
  UsergroupAddOutlined,
  UserOutlined,
} from '@ant-design/icons';
import logo from 'assets/logo.png';
import { useDispatch } from 'react-redux';
import { authActions } from 'store/slices/auth.slice';
import { NotificationContext } from 'contexts/notification.context';
import ModalChangePassword from 'components/ModalChangePassword';
import { CURRENT_USER } from 'constants/auth.constant';
import { Authority } from 'constants/authority';
import moment from 'moment';
import { UserDetailDto } from '../../types/user.type';
import { hasAuthority } from '../../utils/globalFunc.util';
import { Notification } from '../../types/notification.type';

const { Header, Sider, Content, Footer } = Layout;

interface LayoutProps {
  children: React.ReactNode;
}

type MenuItem = Required<MenuProps>['items'][number];

const LayoutSystem = (props: LayoutProps) => {
  const { count, notification, resetCount } = useContext(NotificationContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const pathName: any = location.pathname.split('/');
  const [collapsed, setCollapsed] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState<boolean>(false);
  const user: UserDetailDto = JSON.parse(localStorage.getItem(CURRENT_USER) || '');

  function getItem(label: React.ReactNode,
                   key: React.Key,
                   authority?: Authority | Boolean,
                   icon?: React.ReactNode,
                   children?: MenuItem[],
                   type?: 'group'): any {
    if (hasAuthority(authority as Authority)) {
      return {
        key, icon, children, label, type,
      } as MenuItem;
    } else {
      return;
    }
  }

  const items: MenuProps['items'] = [
    /*TODO: sua lai authority cho nay nua*/
    getItem(
      'Quản lý thiết bị',
      '/equipments',
      Authority.EQUIPMENT_READ,
      <ClusterOutlined />,
      [
        getItem(<NavLink to={'/equipments'} >Danh sách thiết bị</NavLink>, '', Authority.EQUIPMENT_READ),
        // getItem('Danh sách thiết bị', '', Authority.EQUIPMENT_READ),
        getItem(<NavLink to={'/equipments/create'} >Nhập thiết bị mới</NavLink>, '/create', Authority.EQUIPMENT_CREATE),
        // getItem('Nhập thiết bị mới', '/create', Authority.EQUIPMENT_CREATE),
        // getItem('Nhập thiết bị bằng Excel', '/import_excel_eq', Authority.EQUIPMENT_CREATE),
        getItem(<NavLink to={'/equipments/handovers'} >Bàn giao</NavLink>, '/handovers', Authority.HANDOVER_READ),
        getItem(<NavLink to={'/equipments/report-broken'} >Báo hỏng</NavLink>, '/report-broken', Authority.REPORT_BROKEN_READ),
        getItem(<NavLink to={'/equipments/repairs'} >Sửa chữa</NavLink>, '/repairs', Authority.REPAIR_READ),
        getItem(
          <NavLink to={'/equipments/maintenances'} >Bảo dưỡng định kỳ</NavLink>,
          '/maintenances',
          Authority.MAINTENANCE_READ
        ),
        // getItem(<NavLink to={'/equipments/inspections'} >Kiểm định</NavLink>, '/inspections', Authority.INSPECTION_READ),
        // getItem('Bảo hành', '14', Authority.INSURANCE_EQUIPMENT_READ),
        getItem(<NavLink to={'/equipments/transfers'} >Điều chuyển</NavLink>, '/transfers', Authority.TRANSFER_READ),
        getItem(
          <NavLink to={'/equipments/liquidations'} >Thanh lý</NavLink>,
          '/liquidations',
          Authority.LIQUIDATION_READ
        ),
      ]
    ),

    // getItem(
    //   'Quản lý vật tư',
    //   '/supplies',
    //   Authority.SUPPLY_READ,
    //   <SisternodeOutlined />,
    //   [
    //     getItem(<NavLink to={'/supplies'} >Danh sách vật tư</NavLink>, '', Authority.SUPPLY_READ),
    //     getItem(<NavLink to={'/supplies/create'} >Thêm mới vật tư</NavLink>, '/create', Authority.SUPPLY_CREATE),
    //   ]
    // ),
    // getItem(
    //   'Quản lý cơ sở vật chất',
    //   '/facilities',
    //   Authority.EQUIPMENT_READ,
    //   <DesktopOutlined />,
    //   [
    //     getItem(<NavLink to={'/facilities'} >Danh sách cơ sở vật chất</NavLink>, '', Authority.EQUIPMENT_READ),
    //     // getItem('Danh sách thiết bị', '', Authority.EQUIPMENT_READ),
    //     getItem(<NavLink to={'/facilities/create'} >Nhập cơ sở vật chất mới</NavLink>, '/create', Authority.EQUIPMENT_CREATE),
    //     // getItem('Nhập thiết bị mới', '/create', Authority.EQUIPMENT_CREATE),
    //     // getItem('Nhập thiết bị bằng Excel', '/import_excel_eq', Authority.EQUIPMENT_CREATE),
    //     getItem(<NavLink to={'/facilities/handovers'} >Bàn giao</NavLink>, '/handovers', Authority.HANDOVER_READ),
    //     getItem(<NavLink to={'/facilities/report-broken'} >Báo hỏng</NavLink>, '/report-broken', Authority.REPORT_BROKEN_READ),
    //     getItem(<NavLink to={'/facilities/repairs'} >Sửa chữa</NavLink>, '/repairs', Authority.REPAIR_READ),
    //     getItem(
    //       <NavLink to={'/facilities/maintenances'} >Bảo dưỡng định kỳ</NavLink>,
    //       '/maintenances',
    //       Authority.MAINTENANCE_READ
    //     ),
    //     getItem(<NavLink to={'/facilities/transfers'} >Điều chuyển</NavLink>, '/transfers', Authority.TRANSFER_READ),
    //     getItem(
    //       <NavLink to={'/facilities/liquidations'} >Thanh lý</NavLink>,
    //       '/liquidations',
    //       Authority.LIQUIDATION_READ
    //     ),
    //   ]
    // ),

    getItem(
      'Trò chuyện',
      '/chat',
      Authority.TEST_CHAT,
      <a href="http://localhost:3000" target="_blank" ><MessageOutlined/></a>,
    ),  

    getItem(
      'Quản lý tổ chức',
      '/organization',
      Authority.DEPARTMENT_READ,
      <UsergroupAddOutlined />,
      [
        getItem(<NavLink to={'/organization/departments'} >Khoa phòng</NavLink>, '/departments', Authority.DEPARTMENT_READ),
        getItem(<NavLink to={'/organization/suppliers'} >Nhà cung cấp dịch vụ</NavLink>, '/suppliers', Authority.SUPPLIER_READ),
        getItem(<NavLink to={'/organization/users'} >Quản lý thành viên</NavLink>, '/users', Authority.USER_READ),
      ]
    ),
    getItem(
      'Quản lý danh mục',
      '/category',
      Authority.EQUIPMENT_GROUP_READ,
      <UnorderedListOutlined />,
      [
        getItem(
          <NavLink to={'/category/equipment-groups'} >Nhóm thiết bị</NavLink>,
          '/equipment-groups',
          Authority.EQUIPMENT_GROUP_READ
        ),
        getItem(
          <NavLink to={'/category/equipment-categories'} >Loại thiết bị</NavLink>,
          '/equipment-categories',
          Authority.EQUIPMENT_CATEGORY_READ
        ),
        getItem(
          <NavLink to={'/category/equipment-units'} >Đơn vị tính</NavLink>,
          '/equipment-units',
          Authority.EQUIPMENT_UNIT_READ
        ),
        getItem(<NavLink to={'/category/services'} >Loại dịch vụ</NavLink>, '/services', Authority.SERVICE_READ),
      ]
    ),

    getItem(
      'Thống kê',
      '/statistic',
      Authority.STATISTIC_EQUIPMENT,
      <BarChartOutlined />,
      [
        getItem(
          <NavLink to={'/statistic/equipments'} >Thống kê thiết bị</NavLink>,
          '/equipments',
          Authority.STATISTIC_EQUIPMENT,
        ),
        // getItem(<NavLink to={'/statistic/supplies'} >Thống kê vật tư</NavLink>,
        // '/supplies', Authority.STATISTIC_EQUIPMENT),
        // ,
        getItem('Thống kê theo khoa',
        '/statistic/equipments/departments', Authority.STATISTIC_EQUIPMENT, 
        null,
      [
        getItem(
          <NavLink to={'/statistic/equipments/departments/statuses'} >Theo trạng thái</NavLink>,
          '/statuses',
          Authority.STATISTIC_EQUIPMENT)
      ]
        ),
        ,
        getItem(<NavLink to={'/statistic/equipments/groups'} >Thống kê theo nhóm - loại</NavLink>,
        '/equipments/groups', Authority.STATISTIC_EQUIPMENT),
        ,
      ]
    ),

    getItem(<NavLink to={'/setting'} >Cài đặt</NavLink>, '/setting', Authority.TPVT, <SettingOutlined />, [
      getItem(<NavLink to={'/email-config'} >Cấu hình hệ thống</NavLink>, '/email-config', Authority.TPVT),
      getItem(<NavLink to={'/roles'} >Phân quyền</NavLink>, '/roles', Authority.TPVT),
    ]),
  ];


  const menu = (<>
    <Menu
      onAnimationEnd={() => {
        console.log("endlist");
      }}
      items={notification.map((item: Notification<any>) => {
        return {
          key: item.id, label: (<div
            className={`text-base`}
          >
            <Row onClick={() => navigate('/setting/notifications')}>{item.content}</Row>
            <div className='font-medium'>
              {moment(item.createdAt).format('hh:mm:ss, DD-MM-YYYY')}
            </div>
            <Divider className='my-2.5' />
          </div>),
        };
      })}
      style={{ width: 500, height: 500, overflowY: 'scroll' }}
    />
    <div
      className='bg-red-100 p-4 cursor-pointer rounded-b-md'
      onClick={() => navigate('/setting/notifications')}
    >
      <div className='text-center text-base'>Xem tất cả thông báo</div>
    </div>
  </>);

  const onClick: MenuProps['onClick'] = (e) => {
    navigate(`${e.keyPath[1]}${e.keyPath[0]}`);
  };

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = () => {
    dispatch(authActions.logout());
  };

  return (<Layout>
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={toggle}
      width='250px'
      className='bg-white min-h-screen'
      style={{
        // overflowY: 'scroll',
        overflowX: 'hidden', height: '100vh', position: 'fixed',
      }}
      trigger={null}
    >
      <div
        className='flex flex-row items-center p-4 gap-2 cursor-pointer'
        onClick={() => navigate('/')}
      >
        <img
          src={logo}
          alt='logo'
          style={{
            width: '30px', height: '30px', borderRadius: '50%',
          }}
        />
        {!collapsed && (<div className='font-medium text-base'>Hệ thống quản lý <br />tài sản công bện viện</div>)}
      </div>
      <Divider className='m-1' />
      <Menu
        onClick={onClick}
        style={{ width: 250 }}
        defaultSelectedKeys={[`/${pathName[2]}`]}
        defaultOpenKeys={[`/${pathName[1]}`]}
        items={items}
        mode='inline'
      />
    </Sider>
    <Layout
      className='min-h-screen'
      style={collapsed ? {
        marginLeft: '4.6rem',
      } : {
        marginLeft: '250px',
      }}
    >
      <Header className='bg-white p-0 h-[66px]'>
        <Row className='flex justify-between items-center gap-4 px-6'>
          <BarsOutlined onClick={toggle} />
          <div className='flex flex-row items-center gap-6 cursor-pointer'>
            {/* <SettingFilled /> */}
            <div  onClick={event => resetCount}>
              <Dropdown
                overlay={menu}
                placement='bottomRight'
                arrow
                overlayClassName='rounded-3xl'
                trigger={['click']}
              >
                <Badge count={count}>
                  <BellFilled onClick={resetCount} className='h-5 w-5' />
                </Badge>
              </Dropdown>
            </div>
            <Avatar icon={<UserOutlined />} />
            <div>{user?.name}</div>
            <Dropdown
              overlay={<Menu>
                <Menu.Item key='profile'>
                  <Link to='/profile'>Tài khoản</Link>
                </Menu.Item>
                <Menu.Item key='change_password'>
                  <Row onClick={() => setShowChangePasswordModal(true)}>
                    Thay đổi mật khẩu
                  </Row>
                </Menu.Item>
                <Menu.Item key='signout' onClick={handleLogout}>
                  Đăng xuất
                </Menu.Item>
              </Menu>}
              placement='bottomRight'
            >
              <DownOutlined />
            </Dropdown>
          </div>
        </Row>
      </Header>
      <Divider className='m-0' />
      <Content
        style={{
          margin: '24px 16px',
        }}
      >
        <div
          className='site-layout-background'
          style={{
            maxWidth: '1600px', margin: '0 auto', padding: 20,
          }}
        >
          {props.children}
        </div>
      </Content>
      <Footer>
        <div className='text-base font-medium'>
          Copyright © 2023 iBME HUST
        </div>
      </Footer>
    </Layout>
    <ModalChangePassword
      showChangePasswordModal={showChangePasswordModal}
      setShowChangePasswordModal={() => setShowChangePasswordModal(false)}
    />
  </Layout>);
};

export default LayoutSystem;
