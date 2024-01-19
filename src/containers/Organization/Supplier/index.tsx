import { useContext, useEffect, useState } from 'react';
import { DeleteFilled, EditFilled, FilterFilled, PlusCircleFilled, SelectOutlined } from '@ant-design/icons';
import { Button, Checkbox, Divider, Input, Menu, Popconfirm, Select, Table, Tooltip } from 'antd';
import useDebounce from 'hooks/useDebounce';
import { useLocation, useNavigate } from 'react-router-dom';
import useQuery from 'hooks/useQuery';
import { createUrlWithQueryString, hasAuthority, onChangeCheckbox, options } from 'utils/globalFunc.util';
import { PaginationProps } from 'antd/lib/pagination/Pagination';
import moment from 'moment/moment';
import { TableFooter } from 'components/TableFooter';
import { toast } from 'react-toastify';
import { GetSuppliersQueryParam, SupplierFullInfoDto } from 'types/supplier.type';
import { Pageable } from '../../../types/commonResponse.type';
import { PageableRequest } from '../../../types/commonRequest.type';
import { Authority } from '../../../constants/authority';
import { ModalCreateSupplier } from './ModalCreateSupplier';
import { ModalUpdateSupplier } from './ModalUpdateSupplier';
import supplierApi from '../../../api/supplierApi';
import { ServiceDto } from '../../../types/service.type';
import { FilterContext } from '../../../contexts/filter.context';

const Supplier = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const query = useQuery();
  const [keyword, setKeyword] = useState<string>(query.keyword);
  const [supplies, setSupplies] = useState<SupplierFullInfoDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isShowCustomTable, setIsShowCustomTable] = useState<boolean>(false);
  const [pageable, setPageable] = useState<Pageable>({ number: 0, size: 20 });
  const [componentShouldUpdate, setComponentShouldUpdate] = useState<boolean>(false);
  const [getSupplierQueryParam, setGetSuppliersQueryParam] = useState<GetSuppliersQueryParam>({});
  const keywordSearch = useDebounce(getSupplierQueryParam.keyword as string, 500);
  const [pageableRequest, setPageableRequest] = useState<PageableRequest>({ size: query.size || 20, page: query.page || 0 });
  const [queryString, setQueryString] = useState<string>(location.search);
  const [showCreateSupplierModal, setShowCreateSupplierModal] = useState<boolean>(false);
  const [showUpdateSupplierModal, setShowUpdateSupplierModal] = useState<boolean>(false);
  const [updateSupplierModalData, setUpdateSupplierModalData] = useState<SupplierFullInfoDto>({});
  const { services } = useContext(FilterContext);
  const columns: any = [
    {
      title: 'Tên hiển thị', dataIndex: 'name', key: 'name', show: true, widthExcel: 30,
    }, {
      title: ' Địa chỉ', dataIndex: 'address', key: 'alias', show: true, widthExcel: 30,
    }, {
      title: ' Hotline', dataIndex: 'hotline', key: 'hotline', show: true, widthExcel: 30,
    }, {
      title: '  Email', dataIndex: 'email', key: 'email', show: true, widthExcel: 30,
    }, {
      title: ' Fax', dataIndex: 'fax', key: 'fax', show: true, widthExcel: 30,
    }, {
      title: ' Website', dataIndex: 'website', key: 'website', show: true, widthExcel: 30,
    }, {
      title: ' Mã số thuế', dataIndex: 'taxCode', key: 'taxCode', show: true, widthExcel: 30,
    }, {
      title: ' Đầu mối liên hệ',
      show: true,
      widthExcel: 30,
      render: (item: SupplierFullInfoDto) => (<div>{item.contactPerson?.name} - {item.contactPerson?.phone} - {item.contactPerson?.email}</div>),
    }, {
      title: ' Ghi chú', dataIndex: 'note', key: 'note', show: true, widthExcel: 30,
    }, {
      title: ' Dịch vụ cung cấp', show: true, widthExcel: 30, render: (item: SupplierFullInfoDto) => {
        let services = '';
        if (item.services != undefined && item.services.length > 0) {
          services = item.services.map((service: ServiceDto) => service.name).join(', ');
        }
        return (<div>{services}</div>);
      },
    }, {
      title: 'Tác vụ', key: 'action', show: true, render: (item: SupplierFullInfoDto) => (<Menu className='flex flex-row items-center'>
        {hasAuthority(Authority.EQUIPMENT_GROUP_UPDATE) && <Menu.Item>
          <Tooltip title='Cập nhật thông tin nhà cung cấp'>
            <EditFilled
              onClick={() => {
                setUpdateSupplierModalData(item);
                setShowUpdateSupplierModal(true);
              }} />
          </Tooltip>
        </Menu.Item>}
        {hasAuthority(Authority.EQUIPMENT_DELETE) && <Menu.Item>
          <Tooltip title='Xóa'>
            <Popconfirm
              title='Bạn muốn xóa nhà cung cấp này?'
              onConfirm={() => handleDeleteSupplier(item.id as number)}
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
    let getSupplierQueryParamClone: GetSuppliersQueryParam = getSupplierQueryParam;
    if (key === '') { //if key is empty, it means that the component should be updated
      setComponentShouldUpdate(true);
    }
    if (key === 'keyword') {
      getSupplierQueryParamClone = { ...getSupplierQueryParam, keyword: value as string };
    }
    if (key === 'pageable') {
      pagebaleClone = { ...pageableRequest, page: (value as PageableRequest).page, size: (value as PageableRequest).size };
    }
    if (key === 'serviceId') {

      getSupplierQueryParamClone = { ...getSupplierQueryParam, serviceId: value as number };
    }
    setGetSuppliersQueryParam(getSupplierQueryParamClone);
    setPageableRequest(pagebaleClone);
    const url = createUrlWithQueryString(location.pathname, getSupplierQueryParamClone, pagebaleClone);
    setQueryString(url);
    navigate(url);
  };

  const pagination: PaginationProps = {
    current: pageable.number as number + 1,
    total: pageable.totalElements,
    pageSize: pageable.size,
    showTotal: (total: number) => `Tổng cộng: ${total} nhà cung cấp`,
    onChange: (page, pageSize) => {
      onChangeQueryParams('pageable', { page: page - 1, size: pageSize });
    },
    showQuickJumper: true,
  };
  const handleDeleteSupplier = (id: number) => {
    supplierApi.deleteSupplier(id).then(() => {
      toast.success('Nhà cung cấp được xoá thành công!');
      onChangeQueryParams('', '');
    });
  };
  const searchListOfSupplier = (queryParams: GetSuppliersQueryParam, pageableRequest: PageableRequest) => {
    supplierApi.getSuppliers(queryParams, pageableRequest).then((res) => {
      if (res.data.success) {
        setSupplies(res.data.data.content);
        setPageable(res.data.data.page);
        setLoading(false);

      }
    });
  };
  useEffect(() => {
    setLoading(true);
    setComponentShouldUpdate(false);
    setGetSuppliersQueryParam({
      keyword: query.keyword || '',
    });
    setPageableRequest({
      page: Number(query.page) || 0, size: Number(query.size) || 20,
    });
    searchListOfSupplier(getSupplierQueryParam, pageableRequest);
    // setLoading(false);
  }, [componentShouldUpdate, queryString, keywordSearch]);
  return (<div>
    <div className='flex-between-center'>
      <div className='title'> DANH SÁCH NHÀ CUNG CẤP</div>
      <div className='flex flex-row gap-6'>
        <Button
          className='flex-center text-slate-900 gap-2 rounded-3xl border-[#5B69E6] border-2'
          onClick={() => setShowCreateSupplierModal(true)}
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
        <Select
          style={{ width: '100%', maxWidth: '300px', minWidth: '200px' }}
          showSearch
          placeholder=' Chọn loại dịch vụ'
          optionFilterProp='children'
          allowClear
          filterOption={(input, option) => (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())}
          options={options(services)}
          onChange={(e) => {
            onChangeQueryParams('serviceId', e);
          }}
        />
        <Input
          placeholder='Tìm kiếm nhà cung cấp'
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
      dataSource={supplies}
      className='mt-6 shadow-md table-responsive'
      footer={() => (<>
        <TableFooter paginationProps={pagination} />
      </>)}
      pagination={false}
      loading={loading}
    />

    <ModalCreateSupplier
      showCreateSupplierModal={showCreateSupplierModal}
      hideCreateSupplierModal={() => setShowCreateSupplierModal(false)}
      callback={() => {
        onChangeQueryParams('', '');
      }} />
    <ModalUpdateSupplier
      showUpdateSupplierModal={showUpdateSupplierModal}
      hideUpdateSupplierModal={() => setShowUpdateSupplierModal(false)}
      callback={() => {
        onChangeQueryParams('', '');
      }}
      updateSupplierModalData={updateSupplierModalData}
    />
  </div>);
};

export default Supplier;
