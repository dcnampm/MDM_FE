import { useEffect, useState } from 'react';
import { DeleteFilled, EyeFilled, FilterFilled, PlusCircleFilled, SelectOutlined } from '@ant-design/icons';
import { Button, Checkbox, Divider, Input, Menu, Popconfirm, Table, Tooltip } from 'antd';
import useDebounce from 'hooks/useDebounce';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import userApi from 'api/user.api';
import useQuery from 'hooks/useQuery';
import { createUrlWithQueryString, getDateForRendering, hasAuthority, onChangeCheckbox } from 'utils/globalFunc.util';
import { PaginationProps } from 'antd/lib/pagination/Pagination';
import { Pageable } from '../../../types/commonResponse.type';
import moment from 'moment/moment';
import { PageableRequest } from '../../../types/commonRequest.type';
import { TableFooter } from 'components/TableFooter';
import { toast } from 'react-toastify';
import { Authority } from '../../../constants/authority';
import { GetUsersQueryParam, UserDetailDto } from '../../../types/user.type';
import { ISO_DATE_FORMAT } from '../../../constants/dateFormat.constants';

const User = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const query = useQuery();
  const [keyword, setKeyword] = useState<string>(query.keyword);
  const [users, setUsers] = useState<UserDetailDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isShowCustomTable, setIsShowCustomTable] = useState<boolean>(false);
  const [pageable, setPageable] = useState<Pageable>({ number: 0, size: 20 });
  const [componentShouldUpdate, setComponentShouldUpdate] = useState<boolean>(false);
  const [getUserQueryParam, setGetUserQueryParam] = useState<GetUsersQueryParam>({});
  const keywordSearch = useDebounce(getUserQueryParam.keyword as string, 500);
  const [pageableRequest, setPageableRequest] = useState<PageableRequest>({ size: query.size || 20, page: query.page || 0 });
  const [queryString, setQueryString] = useState<string>(location.search);
  const [showCreateUserModal, setShowCreateUserModal] = useState<boolean>(false);
  const columns: any = [
    {
      title: 'Tên hiển thị', dataIndex: 'name', key: 'name', show: true, widthExcel: 30,
    }, {
      title: 'Tên đăng nhập ', dataIndex: 'username', key: 'username', show: true, widthExcel: 30,
    }, {
      title: 'Số điện thoại', key: 'phone', dataIndex: 'phone', show: true, widthExcel: 20,
    }, {
      title: 'Email', key: 'email', dataIndex: 'email', show: true, widthExcel: 40,
    }, {
      title: 'Giới tính',
      key: 'gender',
      dataIndex: 'gender',
      show: true,
      widthExcel: 20,
      render: (item: UserDetailDto) => (<div>{item.gender ? 'Nam' : ' Nữ'}</div>),
    }, {
      title: 'Địa chỉ', key: 'address', dataIndex: 'address', show: true, widthExcel: 20,
    }, {
      title: ' Ngày sinh',
      show: true,
      widthExcel: 20,
      render: (item: UserDetailDto) => (<div>{getDateForRendering(item.birthday as string, ISO_DATE_FORMAT)}</div>),
    }, {
      title: ' Chức vụ', show: true, widthExcel: 20, render: (item: UserDetailDto) => (<div>{item.role?.name}</div>),
    }, {
      title: ' Khoa phòng - ban thuộc biên chế', show: true, widthExcel: 20, render: (item: UserDetailDto) => (<div>{item.department.name}</div>),
    }, {
      title: 'Khoa phòng ban phụ trách', show: true, widthExcel: 20, render: (item: UserDetailDto) => {
        if (item.departmentResponsibilities.length === 0) {
          return <div></div>;
        }
        let departmentResponsibilities = item.departmentResponsibilities[0].name;
        for (let i = 1; i < item.departmentResponsibilities.length; i++) {
          departmentResponsibilities += `, ${item.departmentResponsibilities[i].name}`;
        }
        return <div>{departmentResponsibilities}</div>;
      },
    }, {
      title: 'Tác vụ', key: 'action', show: true, render: (item: UserDetailDto) => (<Menu className='flex flex-row items-center'>
        {hasAuthority(Authority.DEPARTMENT_READ) && <Menu.Item>
          <Tooltip title='Chi tiết người dùng'>
            <Link to={`/organization/users/${item.id}`}><EyeFilled /></Link>
          </Tooltip>
        </Menu.Item>}
        {hasAuthority(Authority.DEPARTMENT_DELETE) && <Menu.Item>
          <Tooltip title='Xóa'>
            <Popconfirm
              title='Bạn muốn xóa Khoa - Phòng này?'
              onConfirm={() => handleDeleteUser(item.id)}
              okText='Xóa'
              cancelText='Hủy'
            >
              <DeleteFilled />
            </Popconfirm>
          </Tooltip>
        </Menu.Item>}
      </Menu>),
    },
  ];
  const [columnTable, setColumnTable] = useState<any>(columns);
  const onChangeQueryParams = (key: string, value: string | moment.Moment[] | undefined | number | PageableRequest) => {
    let pagebaleClone: PageableRequest;
    pagebaleClone = { ...pageableRequest };
    let getUserQueryParamClone: GetUsersQueryParam = getUserQueryParam;
    if (key === '') { //if key is empty, it means that the component should be updated
      setComponentShouldUpdate(true);
    }
    if (key === 'keyword') {
      getUserQueryParamClone = { ...getUserQueryParam, keyword: value as string };
    }
    if (key === 'pageable') {
      pagebaleClone = { ...pageableRequest, page: (value as PageableRequest).page, size: (value as PageableRequest).size };
    }
    setGetUserQueryParam(getUserQueryParamClone);
    setPageableRequest(pagebaleClone);
    const url = createUrlWithQueryString(location.pathname, getUserQueryParamClone, pagebaleClone);
    setQueryString(url);
    navigate(url);
  };

  const pagination: PaginationProps = {
    current: pageable.number as number + 1,
    total: pageable.totalElements,
    pageSize: pageable.size,
    showTotal: (total: number) => `Tổng cộng: ${total} người dùng`,
    onChange: (page, pageSize) => {
      onChangeQueryParams('pageable', { page: page - 1, size: pageSize });
    },
    showQuickJumper: true,
  };
  const handleDeleteUser = (id: number) => {
    userApi.deleteUser(id).then(res => {
      toast.success(' Người dùng được xoá thành công!');
      onChangeQueryParams('', '');
      setComponentShouldUpdate(true);
    });
  };


  const searchListOfUser = (queryParams: GetUsersQueryParam, pageableRequest: PageableRequest) => {
    userApi.getUsers(queryParams, pageableRequest).then((res) => {
      if (res.data.success) {
        setUsers(res.data.data.content);
        setPageable(res.data.data.page);
        setLoading(false);
      }
    });
  };
  useEffect(() => {
    setLoading(true);
    setComponentShouldUpdate(false);
    setGetUserQueryParam({
      keyword: query.keyword || '',
    });
    setPageableRequest({
      page: Number(query.page) || 0, size: Number(query.size) || 20,
    });
    searchListOfUser(getUserQueryParam, pageableRequest);
    // setLoading(false);
  }, [componentShouldUpdate, queryString, keywordSearch]);
  return (<div>
    <div className='flex-between-center'>
      <div className='title'>Danh sách người dùng</div>
      <div className='flex flex-row gap-6'>
        <Button
          className='flex-center text-slate-900 gap-2 rounded-3xl border-[#5B69E6] border-2'
          onClick={() => navigate('/organization/users/create')}
        >
          <PlusCircleFilled />
          <div className='font-medium text-md text-[#5B69E6]'>Thêm mới</div>
        </Button>
      </div>
    </div>
    <Divider />
    <div className='flex justify-between flex-col'>
      <div
        className='flex flex-row gap-4 items-center mb-4'
        onClick={() => setIsShowCustomTable(!isShowCustomTable)}
      >
        <SelectOutlined />
        <div className='font-medium text-center cursor-pointer text-base'>Tùy chọn trường hiển thị</div>
      </div>
      {isShowCustomTable && <div className='flex flex-row gap-4'>
        {columnTable.length > 0 && columnTable.map((item: any) => (<div>
          <Checkbox
            defaultChecked={item?.show}
            onChange={(e: any) => onChangeCheckbox(item, e, columnTable, setColumnTable)}
          />
          <div>{item?.title}</div>
        </div>))}
      </div>}
      <div className='flex-between-center gap-4 p-4'>
        <Input
          placeholder='Tìm kiếm người dùng'
          allowClear
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
            onChangeQueryParams('keyword', e.target.value);
          }}
          className='input'
        />
        <div>
          <FilterFilled />
        </div>
      </div>
    </div>
    <Table 
      columns={columnTable.filter((item: any) => item.show)}
      dataSource={users}
      className='mt-6 shadow-md table-responsive'
      footer={() => (<>
        <TableFooter paginationProps={pagination} />
      </>)}
      pagination={false}
      loading={loading}
    />
  </div>);
};

export default User;
