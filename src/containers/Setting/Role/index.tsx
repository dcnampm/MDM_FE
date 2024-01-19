import { useEffect, useState } from 'react';
import { DeleteFilled, EditFilled, FilterFilled, PlusCircleFilled, SelectOutlined } from '@ant-design/icons';
import { Button, Checkbox, Divider, Input, Menu, Popconfirm, Table, Tooltip } from 'antd';
import useDebounce from 'hooks/useDebounce';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import roleApi from 'api/role.api';
import useQuery from 'hooks/useQuery';
import { createUrlWithQueryString, hasAuthority, onChangeCheckbox } from 'utils/globalFunc.util';
import { PaginationProps } from 'antd/lib/pagination/Pagination';
import { Pageable } from '../../../types/commonResponse.type';
import { PageableRequest } from '../../../types/commonRequest.type';
import { TableFooter } from 'components/TableFooter';
import { toast } from 'react-toastify';
import { Authority } from '../../../constants/authority';
import { GetRolesQueryParam, RoleFullInfoDto } from '../../../types/role.type';
import moment from 'moment';

const RoleManagement = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const query = useQuery();
  const [keyword, setKeyword] = useState<string>(query.keyword);
  const [roles, setRoles] = useState<RoleFullInfoDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isShowCustomTable, setIsShowCustomTable] = useState<boolean>(false);
  const [pageable, setPageable] = useState<Pageable>({ number: 0, size: 20 });
  const [componentShouldUpdate, setComponentShouldUpdate] = useState<boolean>(false);
  const [pageableRequest, setPageableRequest] = useState<PageableRequest>({ size: query.size || 20, page: query.page || 0 });
  const [queryString, setQueryString] = useState<string>(location.search);
  const [getRolesQueryParam, setGetRolesQueryParam] = useState<GetRolesQueryParam>({});
  const keywordSearch = useDebounce(getRolesQueryParam.keyword as string, 500);

  const columns: any = [
    {
      title: ' Kí hiệu', dataIndex: 'name', key: 'name', show: true, widthExcel: 30,
    }, {
      title: ' Mô tả', key: 'description', dataIndex: 'description', show: true, widthExcel: 20,
    }, {
      title: 'Tác vụ', key: 'action', show: true, render: (item: RoleFullInfoDto) => (<Menu className='flex flex-row items-center'>
        {hasAuthority(Authority.DEPARTMENT_UPDATE) && <Menu.Item key='updateEquipment'>
          <Tooltip title=' Chỉnh sửa'>
            <Link to={`/setting/roles/${item.id}/update`}><EditFilled /></Link>
          </Tooltip>
        </Menu.Item>}
        {hasAuthority(Authority.DEPARTMENT_DELETE) && <Menu.Item>
          <Tooltip title='Xóa'>
            <Popconfirm
              title=' Bạn có muốn xoá chức vụ này?'
              onConfirm={() => handleDeleteRole(item.id)}
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
    let getRoleQueryParamClone: GetRolesQueryParam = getRolesQueryParam;
    let pagebaleClone: PageableRequest;
    pagebaleClone = { ...pageableRequest };
    if (key === '') { //if key is empty, it means that the component should be updated
      setComponentShouldUpdate(true);
    }
    if (key === 'keyword') {
      getRoleQueryParamClone = { ...getRolesQueryParam, keyword: value as string };
    }
    if (key === 'pageable') {
      pagebaleClone = { ...pageableRequest, page: (value as PageableRequest).page, size: (value as PageableRequest).size };
    }
    setPageableRequest(pagebaleClone);
    setGetRolesQueryParam(getRoleQueryParamClone);
    const url = createUrlWithQueryString(location.pathname, getRoleQueryParamClone, pagebaleClone);
    setQueryString(url);
    navigate(url);
  };

  const pagination: PaginationProps = {
    current: pageable.number as number + 1,
    total: pageable.totalElements,
    pageSize: pageable.size,
    showTotal: (total: number) => `Tổng cộng: ${total} chức vụ`,
    onChange: (page, pageSize) => {
      onChangeQueryParams('pageable', { page: page - 1, size: pageSize });
    },
    showQuickJumper: true,
  };
  const handleDeleteRole = (id:number) => {
    roleApi.deleteRoleById(id).then(() => {
      toast.success(' Chức vụ được xoá thành công!');
      onChangeQueryParams('', '');
    });
  };


  const searchListOfRole = (params: GetRolesQueryParam, pageableRequest: PageableRequest) => {
    roleApi.getRoles(params, pageableRequest).then((res) => {
      if (res.data.success) {
        setRoles(res.data.data.content);
        setPageable(res.data.data.page);
      }
    });
  };
  useEffect(() => {
    setLoading(true);
    setComponentShouldUpdate(false);
    setGetRolesQueryParam({ keyword: query.keyword });
    setPageableRequest({
      page: Number(query.page) || 0, size: Number(query.size) || 20,
    });
    searchListOfRole(getRolesQueryParam, pageableRequest);
    setLoading(false);
  }, [componentShouldUpdate, queryString, keywordSearch]);
  return (<div>
    <div className='flex-between-center'>
      <div className='title'> DANH SÁCH CHỨC VỤ</div>
      <div className='flex flex-row gap-6'>
        <Button
          className='flex-center text-slate-900 gap-2 rounded-3xl border-[#5B69E6] border-2'
          onClick={() => navigate('/setting/roles/create')}
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
          placeholder='Tìm kiếm chức vụ'
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
      dataSource={roles}
      className='mt-6 shadow-md'
      footer={() => (<>
        <TableFooter paginationProps={pagination} />
      </>)}
      pagination={false}
      loading={loading}
    />
  </div>);
};

export default RoleManagement;
