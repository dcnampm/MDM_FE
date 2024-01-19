import { useEffect, useState } from 'react';
import { DeleteFilled, EditFilled, FilterFilled, PlusCircleFilled, SelectOutlined } from '@ant-design/icons';
import { Button, Checkbox, Divider, Input, Menu, Popconfirm, Table, Tooltip } from 'antd';
import useDebounce from 'hooks/useDebounce';
import { useLocation, useNavigate } from 'react-router-dom';
import useQuery from 'hooks/useQuery';
import { createUrlWithQueryString, hasAuthority, onChangeCheckbox } from 'utils/globalFunc.util';
import { PaginationProps } from 'antd/lib/pagination/Pagination';
import ModalUpdateEquipmentUnit from './ModalUpdateEquipmentUnit';
import moment from 'moment/moment';
import { TableFooter } from 'components/TableFooter';
import { toast } from 'react-toastify';
import { EquipmentUnitDto, GetEquipmentUnitsQueryParam } from 'types/equipmentUnit.type';
import { Pageable } from '../../../types/commonResponse.type';
import { PageableRequest } from '../../../types/commonRequest.type';
import { Authority } from '../../../constants/authority';
import { ModalCreateEquipmentUnit } from './ModalCreateEquipmentUnit';
import { equipmentUnitApi } from '../../../api/equipmentUnit.api';

const EquipmentUnit = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const query = useQuery();
  const [keyword, setKeyword] = useState<string>(query.keyword);
  const [supplies, setSupplies] = useState<EquipmentUnitDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isShowCustomTable, setIsShowCustomTable] = useState<boolean>(false);
  const [pageable, setPageable] = useState<Pageable>({ number: 0, size: 20 });
  const [componentShouldUpdate, setComponentShouldUpdate] = useState<boolean>(false);
  const [getEquipmentUnitQueryParam, setGetEquipmentUnitsQueryParam] = useState<GetEquipmentUnitsQueryParam>({});
  const keywordSearch = useDebounce(getEquipmentUnitQueryParam.keyword as string, 500);
  const [pageableRequest, setPageableRequest] = useState<PageableRequest>({ size: query.size || 20, page: query.page || 0 });
  const [queryString, setQueryString] = useState<string>(location.search);
  const [showCreateEquipmentUnitModal, setShowCreateEquipmentUnitModal] = useState<boolean>(false);
  const [showUpdateEquipmentUnitModal, setShowUpdateEquipmentUnitModal] = useState<boolean>(false);
  const [updateEquipmentUnitModalData, setUpdateEquipmentUnitModalData] = useState<EquipmentUnitDto>({});
  const columns: any = [
    {
      title: 'Tên hiển thị', dataIndex: 'name', key: 'name', show: true, widthExcel: 30,
    }, {
      title: ' Ghi chú', dataIndex: 'note', key: 'note', show: true, widthExcel: 30,
    }, {
      title: 'Tác vụ', key: 'action', show: true, render: (item: EquipmentUnitDto) => (<Menu className='flex flex-row items-center'>
        {hasAuthority(Authority.EQUIPMENT_GROUP_UPDATE) && <Menu.Item>
          <Tooltip title='Cập nhật thông tin nhóm thiết bị'>
            <EditFilled
              onClick={() => {
                setUpdateEquipmentUnitModalData(item);
                setShowUpdateEquipmentUnitModal(true);
              }} />
          </Tooltip>
        </Menu.Item>}
        {hasAuthority(Authority.EQUIPMENT_DELETE) && <Menu.Item>
          <Tooltip title='Xóa'>
            <Popconfirm
              title='Bạn muốn xóa nhóm thiết bị này?'
              onConfirm={() => handleDeleteEquipmentUnit(item.id as number)}
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
    let getEquipmentUnitQueryParamClone: GetEquipmentUnitsQueryParam = getEquipmentUnitQueryParam;
    if (key === '') { //if key is empty, it means that the component should be updated
      setComponentShouldUpdate(true);
    }
    if (key === 'keyword') {
      getEquipmentUnitQueryParamClone = { ...getEquipmentUnitQueryParam, keyword: value as string };
    }
    if (key === 'pageable') {
      pagebaleClone = { ...pageableRequest, page: (value as PageableRequest).page, size: (value as PageableRequest).size };
    }
    setGetEquipmentUnitsQueryParam(getEquipmentUnitQueryParamClone);
    setPageableRequest(pagebaleClone);
    const url = createUrlWithQueryString(location.pathname, getEquipmentUnitQueryParamClone, pagebaleClone);
    setQueryString(url);
    navigate(url);
  };

  const pagination: PaginationProps = {
    current: pageable.number as number + 1,
    total: pageable.totalElements,
    pageSize: pageable.size,
    showTotal: (total: number) => `Tổng cộng: ${total} nhóm thiết bị`,
    onChange: (page, pageSize) => {
      onChangeQueryParams('pageable', { page: page - 1, size: pageSize });
    },
    showQuickJumper: true,
  };
  const handleDeleteEquipmentUnit = (id: number) => {
    equipmentUnitApi.deleteEquipmentUnit(id).then(() => {
      toast.success('Vật tư được xoá thành công!');
      onChangeQueryParams('', '');
    });
  };


  const searchListOfEquipmentUnit = (queryParams: GetEquipmentUnitsQueryParam, pageableRequest: PageableRequest) => {
    equipmentUnitApi.getEquipmentUnits(queryParams, pageableRequest).then((res) => {
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
    setGetEquipmentUnitsQueryParam({
      keyword: query.keyword || '',
    });
    setPageableRequest({
      page: Number(query.page) || 0, size: Number(query.size) || 20,
    });
    searchListOfEquipmentUnit(getEquipmentUnitQueryParam, pageableRequest);
    // setLoading(false);
  }, [componentShouldUpdate, queryString, keywordSearch]);
  return (<div>
    <div className='flex-between-center'>
      <div className='title'> DANH SÁCH NHÓM THIẾT BỊ</div>
      <div className='flex flex-row gap-6'>
        <Button
          className='flex-center text-slate-900 gap-2 rounded-3xl border-[#5B69E6] border-2'
          onClick={() => setShowCreateEquipmentUnitModal(true)}
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
          placeholder='Tìm kiếm nhóm thiết bị'
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

    <ModalCreateEquipmentUnit
      showCreateEquipmentUnitModal={showCreateEquipmentUnitModal}
      hideCreateEquipmentUnitModal={() => setShowCreateEquipmentUnitModal(false)}
      callback={() => {
        onChangeQueryParams('', '');
      }} />
    <ModalUpdateEquipmentUnit
      showUpdateEquipmentUnitModal={showUpdateEquipmentUnitModal}
      hideUpdateEquipmentUnitModal={() => setShowUpdateEquipmentUnitModal(false)}
      callback={() => {
        onChangeQueryParams('', '');
      }}
      updateEquipmentUnitModalData={updateEquipmentUnitModalData}
    />
  </div>);
};

export default EquipmentUnit;
