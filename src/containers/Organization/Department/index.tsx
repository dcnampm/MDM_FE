import { useEffect, useState } from 'react';
import { DeleteFilled, EditFilled, EyeFilled, FilterFilled, PlusCircleFilled, SelectOutlined } from '@ant-design/icons';
import { Button, Checkbox, Divider, Input, Menu, Popconfirm, Row, Table, Tooltip } from 'antd';
import useDebounce from 'hooks/useDebounce';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import departmentApi from 'api/department.api';
import useQuery from 'hooks/useQuery';
import { createUrlWithQueryString, hasAuthority, onChangeCheckbox } from 'utils/globalFunc.util';
import { PaginationProps } from 'antd/lib/pagination/Pagination';
import { Pageable } from '../../../types/commonResponse.type';
import moment from 'moment/moment';
import { PageableRequest } from '../../../types/commonRequest.type';
import { DepartmentFullInfoDto, GetDepartmentsQueryParam } from '../../../types/department.type';
import { TableFooter } from 'components/TableFooter';
import { toast } from 'react-toastify';
import { Authority } from '../../../constants/authority';
import { ModalCreateDepartment } from './ModalCreateDepartment';

const Department = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const query = useQuery();
  const [keyword, setKeyword] = useState<string>(query.keyword);
  const [departments, setDepartments] = useState<DepartmentFullInfoDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isShowCustomTable, setIsShowCustomTable] = useState<boolean>(false);
  const [pageable, setPageable] = useState<Pageable>({ number: 0, size: 20 });
  const [componentShouldUpdate, setComponentShouldUpdate] = useState<boolean>(false);
  const [getDepartmentQueryParam, setGetDepartmentQueryParam] = useState<GetDepartmentsQueryParam>({});
  const keywordSearch = useDebounce(getDepartmentQueryParam.keyword as string, 500);
  const [pageableRequest, setPageableRequest] = useState<PageableRequest>({ size: query.size || 20, page: query.page || 0 });
  const [queryString, setQueryString] = useState<string>(location.search);
  const [showCreateDepartmentModal, setShowCreateDepartmentModal] = useState<boolean>(false);
  const columns: any = [
    {
      title: 'Tên hiển thị', dataIndex: 'name', key: 'name', show: true, widthExcel: 30,
    }, {
      title: ' Kí hiệu', dataIndex: 'alias', key: 'alias', show: true, widthExcel: 30,
    }, {
      title: 'Số điện thoại', key: 'phone', dataIndex: 'phone', show: true, widthExcel: 20,
    }, {
      title: 'Email', key: 'email', dataIndex: 'email', show: true, widthExcel: 40,
    }, {
      title: 'Địa chỉ', key: 'address', dataIndex: 'address', show: true, widthExcel: 20,
    }, {
      title: 'Trưởng khoa', key: 'head', show: true, widthExcel: 20, render: (item: DepartmentFullInfoDto) => (<Row>{item?.headOfDepartment?.name}</Row>),
    }, {
      title: 'Điều dưỡng trưởng', show: true, widthExcel: 20, render: (item: DepartmentFullInfoDto) => (<Row>{item?.chiefNurse?.name}</Row>),
    }, {
      title: 'Đầu mối liên hệ', show: true, widthExcel: 20, render: (item: DepartmentFullInfoDto) => (<Row>{item?.contactPerson?.name}</Row>),
    }, {
      title: ' Giám đốc quản lý', key: 'nurse', show: true, widthExcel: 20, render: (item: DepartmentFullInfoDto) => (<Row>{item?.manager?.name}</Row>),
    }, {
      title: 'Tác vụ', key: 'action', show: true, render: (item: DepartmentFullInfoDto) => (<Menu className='flex flex-row items-center'>
        {hasAuthority(Authority.DEPARTMENT_UPDATE) && <Menu.Item>
          <Tooltip title='Chi tiết khoa phòng'>
            <Link to={`/organization/departments/${item.id}`}><EyeFilled /></Link>
          </Tooltip>
        </Menu.Item>}
        {hasAuthority(Authority.DEPARTMENT_DELETE) && <Menu.Item>
          <Tooltip title='Xóa'>
            <Popconfirm
              title='Bạn muốn xóa Khoa - Phòng này?'
              onConfirm={() => handleDeleteDepartment(item.id)}
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
    let getDepartmentQueryParamClone: GetDepartmentsQueryParam = getDepartmentQueryParam;
    if (key === '') { //if key is empty, it means that the component should be updated
      setComponentShouldUpdate(true);
    }
    if (key === 'keyword') {
      getDepartmentQueryParamClone = { ...getDepartmentQueryParam, keyword: value as string };
    }
    if (key === 'pageable') {
      pagebaleClone = { ...pageableRequest, page: (value as PageableRequest).page, size: (value as PageableRequest).size };
    }
    setGetDepartmentQueryParam(getDepartmentQueryParamClone);
    setPageableRequest(pagebaleClone);
    const url = createUrlWithQueryString(location.pathname, getDepartmentQueryParamClone, pagebaleClone);
    setQueryString(url);
    navigate(url);
  };

  const pagination: PaginationProps = {
    current: pageable.number as number + 1,
    total: pageable.totalElements,
    pageSize: pageable.size,
    showTotal: (total: number) => `Tổng cộng: ${total} khoa phòng`,
    onChange: (page, pageSize) => {
      onChangeQueryParams('pageable', { page: page - 1, size: pageSize });
    },
    showQuickJumper: true,
  };
  const handleDeleteDepartment = (id: number) => {
    departmentApi.deleteDepartment(id).then(res => {
      toast.success(' Khoa phòng được xoá thành công!');
      onChangeQueryParams('', '');
    });
  };


  const searchListOfDepartment = (queryParams: GetDepartmentsQueryParam, pageableRequest: PageableRequest) => {
    departmentApi.getDepartments(queryParams, pageableRequest).then((res) => {
      if (res.data.success) {
        setDepartments(res.data.data.content);
        setPageable(res.data.data.page);
        setLoading(false);

      }
    });
  };
  useEffect(() => {
    setLoading(true);
    setComponentShouldUpdate(false);
    setGetDepartmentQueryParam({
      keyword: query.keyword || '',
    });
    setPageableRequest({
      page: Number(query.page) || 0, size: Number(query.size) || 20,
    });
    searchListOfDepartment(getDepartmentQueryParam, pageableRequest);
    // setLoading(false);
  }, [componentShouldUpdate, queryString, keywordSearch]);
  return (<div>
    <div className='flex-between-center'>
      <div className='title'>DANH SÁCH KHOA - PHÒNG</div>
      <div className='flex flex-row gap-6'>
        <Button
          className='flex-center text-slate-900 gap-2 rounded-3xl border-[#5B69E6] border-2'
          onClick={() => setShowCreateDepartmentModal(true)}
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
          placeholder='Tìm kiếm khoa phòng'
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
      dataSource={departments}
      className='mt-6 shadow-md table-responsive'
      footer={() => (<>
        <TableFooter paginationProps={pagination} />
      </>)}
      pagination={false}
      loading={loading}
    />
    <ModalCreateDepartment
      showCreateDepartmentModal={showCreateDepartmentModal} hideCreateDepartmentModal={() => setShowCreateDepartmentModal(false)} callback={() => {
      onChangeQueryParams('', '');
    }} />
  </div>);
};

export default Department;