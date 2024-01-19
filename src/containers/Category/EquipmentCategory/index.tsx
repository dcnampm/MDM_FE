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
import { EquipmentCategoryFullInfoDto, GetEquipmentCategoriesQueryParam } from 'types/equipmentCategory.type';
import { Pageable } from '../../../types/commonResponse.type';
import { PageableRequest } from '../../../types/commonRequest.type';
import { Authority } from '../../../constants/authority';
import { ModalCreateEquipmentCategory } from './ModalCreateEquipmentCategory';
import { ModalUpdateEquipmentCategory } from './ModalUpdateEquipmentCategory';
import { equipmentCategoryApi } from 'api/equipmentCategory.api';
import { FilterContext } from '../../../contexts/filter.context';

const EquipmentCategory = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const query = useQuery();
  const [keyword, setKeyword] = useState<string>(query.keyword);
  const [supplies, setSupplies] = useState<EquipmentCategoryFullInfoDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isShowCustomTable, setIsShowCustomTable] = useState<boolean>(false);
  const [pageable, setPageable] = useState<Pageable>({ number: 0, size: 20 });
  const [componentShouldUpdate, setComponentShouldUpdate] = useState<boolean>(false);
  const [getEquipmentCategoryQueryParam, setGetEquipmentCategoriesQueryParam] = useState<GetEquipmentCategoriesQueryParam>({});
  const keywordSearch = useDebounce(getEquipmentCategoryQueryParam.keyword as string, 500);
  const [pageableRequest, setPageableRequest] = useState<PageableRequest>({ size: query.size || 20, page: query.page || 0 });
  const [queryString, setQueryString] = useState<string>(location.search);
  const [showCreateEquipmentCategoryModal, setShowCreateEquipmentCategoryModal] = useState<boolean>(false);
  const [showUpdateEquipmentCategoryModal, setShowUpdateEquipmentCategoryModal] = useState<boolean>(false);
  const [updateEquipmentCategoryModalData, setUpdateEquipmentCategoryModalData] = useState<EquipmentCategoryFullInfoDto>({});
  const { equipmentGroups } = useContext(FilterContext);
  const columns: any = [
    {
      title: 'Tên hiển thị', dataIndex: 'name', key: 'name', show: true, widthExcel: 30,
    }, {
      title: ' Ký hiệu', dataIndex: 'alias', key: 'alias', show: true, widthExcel: 30,
    }, {
      title: ' Ghi chú', dataIndex: 'note', key: 'note', show: true, widthExcel: 30,
    }, {
      title: ' Nhóm thiết bị', show: true, widthExcel: 30, render: (item: EquipmentCategoryFullInfoDto) => (<div>{item.group?.name}</div>),
    }, {
      title: 'Tác vụ', key: 'action', show: true, render: (item: EquipmentCategoryFullInfoDto) => (<Menu className='flex flex-row items-center'>
        {hasAuthority(Authority.EQUIPMENT_GROUP_UPDATE) && <Menu.Item>
          <Tooltip title='Cập nhật thông tin loại thiết bị'>
            <EditFilled
              onClick={() => {
                setUpdateEquipmentCategoryModalData(item);
                setShowUpdateEquipmentCategoryModal(true);
              }} />
          </Tooltip>
        </Menu.Item>}
        {hasAuthority(Authority.EQUIPMENT_DELETE) && <Menu.Item>
          <Tooltip title='Xóa'>
            <Popconfirm
              title='Bạn muốn xóa loại thiết bị này?'
              onConfirm={() => handleDeleteEquipmentCategory(item.id as number)}
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
    let getEquipmentCategoryQueryParamClone: GetEquipmentCategoriesQueryParam = getEquipmentCategoryQueryParam;
    if (key === '') { //if key is empty, it means that the component should be updated
      setComponentShouldUpdate(true);
    }
    if (key === 'keyword') {
      getEquipmentCategoryQueryParamClone = { ...getEquipmentCategoryQueryParam, keyword: value as string };
    }
    if (key === 'groupId') {
      getEquipmentCategoryQueryParamClone = { ...getEquipmentCategoryQueryParam, groupId: value as number };
    }
    if (key === 'pageable') {
      pagebaleClone = { ...pageableRequest, page: (value as PageableRequest).page, size: (value as PageableRequest).size };
    }
    setGetEquipmentCategoriesQueryParam(getEquipmentCategoryQueryParamClone);
    setPageableRequest(pagebaleClone);
    const url = createUrlWithQueryString(location.pathname, getEquipmentCategoryQueryParamClone, pagebaleClone);
    setQueryString(url);
    navigate(url);
  };

  const pagination: PaginationProps = {
    current: pageable.number as number + 1,
    total: pageable.totalElements,
    pageSize: pageable.size,
    showTotal: (total: number) => `Tổng cộng: ${total} loại thiết bị`,
    onChange: (page, pageSize) => {
      onChangeQueryParams('pageable', { page: page - 1, size: pageSize });
    },
    showQuickJumper: true,
  };
  const handleDeleteEquipmentCategory = (id: number) => {
    equipmentCategoryApi.deleteEquipmentCategory(id).then(() => {
      toast.success('Vật tư được xoá thành công!');
      onChangeQueryParams('', '');
    });
  };


  const searchListOfEquipmentCategory = (queryParams: GetEquipmentCategoriesQueryParam, pageableRequest: PageableRequest) => {
    equipmentCategoryApi.getEquipmentCategories(queryParams, pageableRequest).then((res) => {
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
    setGetEquipmentCategoriesQueryParam({
      keyword: query.keyword || '',
    });
    setPageableRequest({
      page: Number(query.page) || 0, size: Number(query.size) || 20,
    });
    searchListOfEquipmentCategory(getEquipmentCategoryQueryParam, pageableRequest);
    // setLoading(false);
  }, [componentShouldUpdate, queryString, keywordSearch]);
  return (<div>
    <div className='flex-between-center'>
      <div className='title'> DANH SÁCH LOẠI THIẾT BỊ</div>
      <div className='flex flex-row gap-6'>
        <Button
          className='flex-center text-slate-900 gap-2 rounded-3xl border-[#5B69E6] border-2'
          onClick={() => setShowCreateEquipmentCategoryModal(true)}
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
          showSearch
          placeholder=' Chọn nhóm thiết bị'
          optionFilterProp='children'
          onChange={(value: string) => onChangeQueryParams('groupId', value)}
          allowClear
          filterOption={(input, option) => (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())}
          options={options(equipmentGroups)}
        />
        <Input
          placeholder='Tìm kiếm loại thiết bị'
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

    <ModalCreateEquipmentCategory
      showCreateEquipmentCategoryModal={showCreateEquipmentCategoryModal}
      hideCreateEquipmentCategoryModal={() => setShowCreateEquipmentCategoryModal(false)}
      callback={() => {
        onChangeQueryParams('', '');
      }} />
    <ModalUpdateEquipmentCategory
      showUpdateEquipmentCategoryModal={showUpdateEquipmentCategoryModal}
      hideUpdateEquipmentCategoryModal={() => setShowUpdateEquipmentCategoryModal(false)}
      callback={() => {
        onChangeQueryParams('', '');
      }}
      updateEquipmentCategoryModalData={updateEquipmentCategoryModalData}
    />
  </div>);
};

export default EquipmentCategory;
