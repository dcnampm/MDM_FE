import { CheckCircleOutlined, EyeFilled, FileWordFilled, FilterFilled, PlusCircleFilled, SelectOutlined } from '@ant-design/icons';
import { Checkbox, DatePicker, Divider, Input, Menu, Pagination, Row, Select, Table, Tooltip } from 'antd';
import equipmentTransferApi from 'api/equipment_transfer.api';
import ModalAcceptTransferTicket from 'components/ModalAcceptTransferTicket';
import { FilterContext } from 'contexts/filter.context';
import useDebounce from 'hooks/useDebounce';
import useQuery from 'hooks/useQuery';
import { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  createUrlWithQueryString,
  getDateForRendering,
  getEquipmentCategoryOptions,
  getBiggestIdTicket,
  getLatestTicket_whoseStatusIsPending,
  getStatusOptionForTransfer,
  hasAuthority,
  onChangeCheckbox,
  options,
} from 'utils/globalFunc.util';
import i18n from 'i18next';
import { Authority } from '../../../constants/authority';
import { downloadTransferDocx } from '../../../utils/file.util';
import { PageableRequest } from '../../../types/commonRequest.type';
import { ISO_DATE_FORMAT } from 'constants/dateFormat.constants';
import { EquipmentListTransferDto, EquipmentStatus, GetEquipmentsForTransferQueryParam } from '../../../types/equipment.type';
import ModalCreateTransferTicket from '../../../components/ModalCreateTransferTicket';
import { PaginationProps } from 'antd/lib/pagination/Pagination';
import { Pageable } from '../../../types/commonResponse.type';
import { NotificationContext } from '../../../contexts/notification.context';
import { HasTicketStatus } from '../../../types/trait.type';
import { TransferTicketFullInfoDto } from '../../../types/transfer.type';

export interface CreateTransferTicketModalData {
  equipment?: EquipmentListTransferDto;
}

export interface AcceptTransferTicketModalData {
  equipment?: EquipmentListTransferDto;
}

const TableFooter = ({ paginationProps }: any) => {
  return (<Row justify='space-between'>
    <div></div>
    <Pagination {...paginationProps} />
  </Row>);
};

const Transfer = () => {

  const columns: any = [
    {
      title: 'Tên thiết bị', key: 'name', show: true, widthExcel: 35, render: (item: EquipmentListTransferDto) => (<>{item?.name}</>),
    }, {
      title: 'Code', key: 'code', show: true, widthExcel: 35, render: (item: EquipmentListTransferDto) => (<>{item?.hashCode}</>),
    }, {
      title: 'Model', key: 'model', show: true, widthExcel: 30, render: (item: EquipmentListTransferDto) => (<>{item?.model}</>),
    }, {
      title: 'Serial', key: 'serial', show: true, widthExcel: 30, render: (item: EquipmentListTransferDto) => (<>{item?.serial}</>),
    }, {
      title: 'Trạng thái', show: true, widthExcel: 30, render: (item: EquipmentListTransferDto) => {
        return (<>{i18n.t(item.status as string)}</>);
      },
    }, {
      title: 'Khoa - Phòng hiện tại', key: 'fromDepartment', show: true, widthExcel: 30, render: (item: EquipmentListTransferDto) => {
        const transferTicket = getLatestTicket_whoseStatusIsPending(item.transferTickets as HasTicketStatus[]) as TransferTicketFullInfoDto;
        const fromDeparmentName = transferTicket?.fromDepartment?.name;
        return (<>{fromDeparmentName}</>);
      },
    }, {
      title: 'Khoa - Phòng điều chuyển', key: 'toDepartment', show: true, widthExcel: 30, render: (item: EquipmentListTransferDto) => {
        const latestAndStatusIsNotRejectedTicket = getLatestTicket_whoseStatusIsPending(item.transferTickets as HasTicketStatus[]) as TransferTicketFullInfoDto;
        const toDepartmentName = latestAndStatusIsNotRejectedTicket?.toDepartment?.name;
        return (<>{toDepartmentName}</>);
      },
    },  {
      title: ' Ngày điều chuyển', show: true, widthExcel: 30, render: (item: EquipmentListTransferDto) => {
        const latestAndStatusIsNotRejectedTicket = getLatestTicket_whoseStatusIsPending(item.transferTickets as HasTicketStatus[]) as TransferTicketFullInfoDto;
        const transferDate = getDateForRendering(latestAndStatusIsNotRejectedTicket?.dateTransfer);
        return (<>{transferDate}</>);
      },
    }, {
      title: 'Tác vụ', key: 'action', show: true, render: (item: EquipmentListTransferDto) => (<Menu className='flex flex-row'>
        {item.status === EquipmentStatus.IN_USE && hasAuthority(Authority.LIQUIDATION_CREATE) && <Menu.Item key='word'>
          <Tooltip title=' Tạo phiếu yêu cầu điều chuyển'>
            <PlusCircleFilled
              onClick={() => {
                showCreateTransferTicketModalAndRenderData(item);
              }} />
          </Tooltip>
        </Menu.Item>}
        {item.status === EquipmentStatus.PENDING_TRANSFER && hasAuthority(Authority.TRANSFER_ACCEPT) && <Menu.Item key='approver'>
          <Tooltip title='Phê duyệt phiếu điều chuyển'>
            <CheckCircleOutlined onClick={() => showAcceptTransferTicketModalAndRenderData(item)} />
          </Tooltip>
        </Menu.Item>}
        <Menu.Item key='detail'>
          <Tooltip title='Hồ sơ thiết bị'>
            <Link to={`/equipments/${item?.id}`}><EyeFilled /></Link>
          </Tooltip>
        </Menu.Item>
        {/*{hasAuthority(Authority.TRANSFER_READ) && <>
          <Menu.Item key='word'>
            <Tooltip title={' Xuất biên bản điều chuyển'}>
              <FileWordFilled onClick={() => handleDownloadTransferData(item)} />
            </Tooltip>
          </Menu.Item>
        </>}*/}

      </Menu>),
    },
  ];
  const { equipmentGroups, equipmentCategories, departments } = useContext(FilterContext);
  const [columnTable, setColumnTable] = useState<any>(columns);
  const [isShowCustomTable, setIsShowCustomTable] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const query = useQuery();
  const currentKeywod = query?.keyword;
  const [keyword, setKeyword] = useState<string>(currentKeywod);
  const [loading, setLoading] = useState<boolean>(false);
  const [createTransferTicketModalData, setCreateTransferTicketModalData] = useState<CreateTransferTicketModalData>({});
  const [acceptTransferTicketModalData, setAcceptTransferTicketModalData] = useState<AcceptTransferTicketModalData>({});
  const [equipments, setEquipments] = useState<EquipmentListTransferDto[]>([]);
  const [componentShouldUpdate, setComponentShouldUpdate] = useState<boolean>(false);
  const [getTransferQueryParam, setGetTransferQueryParam] = useState<GetEquipmentsForTransferQueryParam>({});
  const [pageableRequest, setPageableRequest] = useState<PageableRequest>({ size: 20, page: 0 });
  const [selectedEquipmentGroup, setSelectedEquipmentGroup] = useState<number | undefined>(undefined);
  const [queryString, setQueryString] = useState<string>(location.search);
  const [showAcceptTransferTicketModal, setShowAcceptTransferTicketModal] = useState<boolean>(false);
  const [showCreateTransferTicketModal, setShowCreateTransferTicketModal] = useState<boolean>(false);
  const [pageable, setPageable] = useState<Pageable>({ number: 0, size: 20 });
  const keywordSearch = useDebounce(getTransferQueryParam.keyword as string, 500);
  const { increaseCount, getAllNotifications } = useContext(NotificationContext);

  const showCreateTransferTicketModalAndRenderData = (item: EquipmentListTransferDto) => {
    setShowCreateTransferTicketModal(true);
    setCreateTransferTicketModalData({ equipment: item });
  };
  const showAcceptTransferTicketModalAndRenderData = (item: EquipmentListTransferDto) => {
    setShowAcceptTransferTicketModal(true);
    setAcceptTransferTicketModalData({ equipment: item });
  };
  const pagination: PaginationProps = {
    current: pageable.number as number + 1,
    total: pageable.totalElements,
    pageSize: pageable.size,
    showTotal: (total: number) => `Tổng cộng: ${total} thiết bị`,
    onChange: (page, pageSize) => {
      onChangeQueryParams('pageable', { page: page - 1, size: pageSize });

    },
    showQuickJumper: true,
  };

  useEffect(() => {
    setLoading(true);
    setComponentShouldUpdate(false);
    setPageableRequest({
      page: Number(query.page) || 0, size: Number(query.size) || 20,
    });
    searchListOfTransfer(getTransferQueryParam, pageableRequest);
    // setLoading(false);
  }, [queryString, keywordSearch, componentShouldUpdate]);
  const searchListOfTransfer = (getTransferQueryParam: GetEquipmentsForTransferQueryParam, pageable: PageableRequest) => {
    equipmentTransferApi.getAllEquipmentForTransfer(getTransferQueryParam, pageable).then((res) => {
      if (res.data.success) {
        setEquipments(res.data.data.content as EquipmentListTransferDto[]);
        setPageable(res.data.data.page as Pageable);
        setLoading(false);

      }
    });
  };


  const handleInputChange = (e: any) => {
    setKeyword(e.target.value);
    onChangeQueryParams('keyword', e.target.value);
  };
  const onChangeQueryParams = (key: string, value: string | string[] | undefined | number | PageableRequest) => {
    let pagebaleClone: PageableRequest;
    pagebaleClone = { ...pageableRequest, page: 0 };
    let getTransferQueryParamClone: GetEquipmentsForTransferQueryParam = getTransferQueryParam;
    if (key === '') { //if key is empty, it means that the component should be updated
      setComponentShouldUpdate(true);
    }
    if (key === 'groupId') {
      setSelectedEquipmentGroup(isNaN(Number(value)) ? undefined : Number(value));
      getTransferQueryParamClone = { ...getTransferQueryParam, groupId: isNaN(Number(value)) ? undefined : Number(value), categoryId: undefined };
    }
    if (key === 'categoryId') {
      getTransferQueryParamClone = { ...getTransferQueryParam, categoryId: isNaN(Number(value)) ? undefined : Number(value) };
    }
    if (key === 'status') {
      getTransferQueryParamClone = { ...getTransferQueryParam, equipmentStatus: value as string };
    }
    if (key === 'departmentId') {
      getTransferQueryParamClone = { ...getTransferQueryParam, departmentId: isNaN(Number(value)) ? undefined : Number(value) };
    }
    if (key === 'keyword') {
      getTransferQueryParamClone = { ...getTransferQueryParam, keyword: value as string };
    }
    setGetTransferQueryParam(getTransferQueryParamClone);
    setPageableRequest(pagebaleClone);
    const url = createUrlWithQueryString(location.pathname, getTransferQueryParamClone, pagebaleClone);
    setQueryString(url);
    navigate(url);
  };
  return (<div>
    <div className='flex-between-center'>
      <div className='title'>DANH SÁCH ĐIỀU CHUYỂN THIẾT BỊ</div>
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
    </div>
    <div className='flex justify-between'>
      <div></div>
      <div className='flex-between-center gap-4 p-4'>
        <Tooltip title='Lọc theo thời gian điều chuyển'>
          <DatePicker.RangePicker
            className={'date'}
            format={ISO_DATE_FORMAT}
            allowClear={true}
            placeholder={['Từ ngày', 'Đến ngày']}
            onChange={(value) => {
              if (value == null || value[0] == null || value[1] == null) {
                onChangeQueryParams('transferDate', undefined);
                return;
              }
              onChangeQueryParams('transferDate', [value[0].toISOString(), value[1].toISOString()]);
            }}
          />
        </Tooltip>
        <Select
          showSearch
          placeholder='Tất cả Trạng thái'
          optionFilterProp='children'
          onChange={(value: string) => onChangeQueryParams('status', value)}
          allowClear
          options={getStatusOptionForTransfer()}
          filterOption={(input, option) => (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())}
          className='select-custom'
        />
        <Select
          showSearch
          placeholder='Khoa - Phòng'
          optionFilterProp='children'
          onChange={(value: string) => onChangeQueryParams('departmentId', value)}
          allowClear
          options={options(departments)}
          filterOption={(input, option) => (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())}
        />
        <Select
          showSearch
          placeholder='Nhóm thiết bị'
          optionFilterProp='children'
          onChange={(value: string) => onChangeQueryParams('groupId', value)}
          allowClear
          options={options(equipmentGroups)}
          filterOption={(input, option) => (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())}
        />
        <Select
          showSearch
          placeholder='Loại thiết bị'
          optionFilterProp='children'
          onChange={(value: string) => onChangeQueryParams('categoryId', value)}
          allowClear
          filterOption={(input, option) => (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())}
          options={getEquipmentCategoryOptions(equipmentCategories, selectedEquipmentGroup as number)}
        />
        <Input
          placeholder='Tìm kiếm thiết bị'
          allowClear
          value={keyword}
          className='rounded-lg h-9 border-[#A3ABEB] border-2'
          onChange={handleInputChange}
        />
        <div>
          <FilterFilled />
        </div>
      </div>
    </div>
    <Table
      columns={columnTable.filter((item: any) => item.show)}
      dataSource={equipments}
      className='mt-6 shadow-md table-responsive'
      footer={() => <TableFooter paginationProps={pagination} />}
      pagination={false}
      loading={loading}
    />
    <ModalAcceptTransferTicket
      showAcceptTransferTicketModal={showAcceptTransferTicketModal}
      hideAcceptTransferTicketModal={() => setShowAcceptTransferTicketModal(false)}
      callback={() => {
        // increaseCount();
        // getAllNotifications();
        onChangeQueryParams('', '');
      }}
      acceptTransferTicketModalData={acceptTransferTicketModalData}
    />
    <ModalCreateTransferTicket
      showCreateTransferTicketModal={showCreateTransferTicketModal}
      hideCreateTransferTicketModal={() => setShowCreateTransferTicketModal(false)}
      callback={() => {
        // increaseCount();
        // getAllNotifications();
        onChangeQueryParams('', '');
      }}
      createTransferTicketModalData={createTransferTicketModalData}
    />

  </div>);
};

export default Transfer;