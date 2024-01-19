import { useContext, useEffect, useState } from 'react';
import { CheckCircleOutlined, EyeFilled, FileExcelFilled, FileWordFilled, FilterFilled, PlusCircleFilled, ProfileFilled } from '@ant-design/icons';
import { Button, DatePicker, Divider, Input, Menu, Select, Table, Tooltip } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FilterContext } from 'contexts/filter.context';
import {
  createUrlWithQueryString, getDateForRendering, getEquipmentCategoryOptions, getBiggestIdTicket, getStatusOptionForReportBroken, hasAuthority, options,
} from 'utils/globalFunc.util';
import useQuery from '../../../hooks/useQuery';
import { PageableRequest } from '../../../types/commonRequest.type';
import { toast } from 'react-toastify';
import { ColumnGroupType } from 'antd/es/table';
import { ColumnType } from 'antd/lib/table';
import i18n from 'i18next';
import { Authority } from '../../../constants/authority';
import useDebounce from '../../../hooks/useDebounce';
import { ISO_DATE_FORMAT } from '../../../constants/dateFormat.constants';
import moment from 'moment';
import { TableFooter } from 'components/TableFooter';
import { PaginationProps } from 'antd/lib/pagination/Pagination';
import { Pageable } from '../../../types/commonResponse.type';
import { EquipmentListReportBrokenDto, EquipmentStatus } from '../../../types/equipment.type';
import { GetEquipmentsForReportBrokenQueryParam } from '../../../types/reportBroken.type';
import { equipmentReportBrokenApi } from '../../../api/equipmentReportBrokenApi';
import { NotificationContext } from '../../../contexts/notification.context';
import ModalAcceptReportBrokenTicket from 'components/ModalAcceptReportBrokenTicket';
import { ModalCreateReportBrokenTicket } from 'components/ModalCreateReportBrokenTicket';


export interface CreateReportBrokenTicketModalData {
  equipment?: EquipmentListReportBrokenDto;
}

export interface AcceptReportBrokenTicketModalData {
  equipment?: EquipmentListReportBrokenDto;
}

const ReportBroken = () => {
  const { departments, equipmentGroups, equipmentCategories } = useContext(FilterContext);
  const columns: (ColumnGroupType<never> | ColumnType<never>)[] = [
    {
      title: 'Mã thiết bị', key: 'hashCode', render: (item: EquipmentListReportBrokenDto) => (<div>{item.hashCode}</div>),
    }, {
      title: 'Tên thiết bị', key: 'name', render: (item: EquipmentListReportBrokenDto) => (<div>{item.name}</div>),
    }, {
      title: ' Serial', key: 'serial', render: (item: EquipmentListReportBrokenDto) => (<div>{item.serial}</div>),
    }, {
      title: 'Model', key: 'model', render: (item: EquipmentListReportBrokenDto) => (<div>{item.model}</div>),
    }, {
      title: 'Trạng thái', key: 'status', render: (item: EquipmentListReportBrokenDto) => (<div>{i18n.t(item.status as string)}</div>),
    }, {
      title: 'Khoa - Phòng nhận báo hỏng', key: 'department', render: (item: EquipmentListReportBrokenDto) => (<div>{item.department?.name}</div>),
    }, {
      title: 'Ngày báo hỏng',

      render: (item: EquipmentListReportBrokenDto) => {
        let maintenanceDate: string = getDateForRendering(getBiggestIdTicket(item.reportBrokenTickets)?.createdDate as string);
        if (item.status === EquipmentStatus.PENDING_REPORT_BROKEN) {
          return (<div>{maintenanceDate}</div>);
        }
        return (<div></div>);
      },
    }, {
      title: 'Tác vụ', key: 'action', render: (item: EquipmentListReportBrokenDto) => (<Menu className='flex flex-row items-center'>
        {item.status === EquipmentStatus.PENDING_REPORT_BROKEN && hasAuthority(Authority.REPORT_BROKEN_ACCEPT) && <Menu.Item key='edit'>
          <Tooltip title=' Phê duyệt phiếu yêu cầu báo hỏng'>
            <CheckCircleOutlined
              onClick={event => {
                showAcceptReportBrokenTicketModalAndRenderData(item);
              }} />
          </Tooltip>
        </Menu.Item>}
        {item.status === EquipmentStatus.IN_USE && hasAuthority(Authority.REPORT_BROKEN_CREATE) && <Menu.Item key='word'>
          <Tooltip title=' Tạo phiếu yêu cầu báo hỏng'>
            <PlusCircleFilled
              onClick={() => {
                showCreateReportBrokenTicketModalAndRenderData(item);
              }} />
          </Tooltip>
        </Menu.Item>}
        <Menu.Item key='detail'>
          <Tooltip title='Hồ sơ thiết bị'>
            <Link to={`/equipments/${item.id}`}><EyeFilled /></Link>
          </Tooltip>
        </Menu.Item>

      </Menu>),
    },
  ];
  const [equipments, setEquipments] = useState<EquipmentListReportBrokenDto[]>([]);
  const [getReportBrokenQueryParam, setGetReportBrokenQueryParam] = useState<GetEquipmentsForReportBrokenQueryParam>({});
  const query = useQuery();
  const [pageableRequest, setPageableRequest] = useState<PageableRequest>({ size: 20, page: 0 });
  const navigate = useNavigate();
  const location = useLocation();
  const [queryString, setQueryString] = useState<string>(location.search);
  const [showCreateReportBrokenTicketModal, setShowCreateReportBrokenTicketModal] = useState<boolean>(false);
  const [showAcceptReportBrokenTicketModal, setShowAcceptReportBrokenTicketModal] = useState<boolean>(false);
  const [createReportBrokenTicketModalData, setCreateReportBrokenTicketModalData] = useState<CreateReportBrokenTicketModalData>({});
  const [acceptReportBrokenTicketModalData, setAcceptReportBrokenTicketModalData] = useState<AcceptReportBrokenTicketModalData>({});
  const [keyword, setKeyword] = useState<string>(query.keyword);
  const [loading, setLoading] = useState<boolean>(false);
  const [componentShouldUpdate, setComponentShouldUpdate] = useState<boolean>(false);
  const keywordSearch = useDebounce(getReportBrokenQueryParam.keyword as string, 500);
  const [selectedEquipmentGroup, setSelectedEquipmentGroup] = useState<number | undefined>(undefined);
  const [pageable, setPageable] = useState<Pageable>({ number: 0, size: 20 });
  const { increaseCount, getAllNotifications } = useContext(NotificationContext);
  const showCreateReportBrokenTicketModalAndRenderData = (item: EquipmentListReportBrokenDto) => {
    setShowCreateReportBrokenTicketModal(true);
    setCreateReportBrokenTicketModalData({ equipment: item });
  };
  const showAcceptReportBrokenTicketModalAndRenderData = (item: EquipmentListReportBrokenDto) => {
    setShowAcceptReportBrokenTicketModal(true);
    setAcceptReportBrokenTicketModalData({ equipment: item });
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
  const onChangeQueryParams = (key: string, value: string | string[] | undefined | number | PageableRequest) => {
    let pagebaleClone: PageableRequest;
    pagebaleClone = { ...pageableRequest, page: 0 };
    let getReportBrokenQueryParamClone: GetEquipmentsForReportBrokenQueryParam = getReportBrokenQueryParam;
    if (key === '') { //if key is empty, it means that the component should be updated
      setComponentShouldUpdate(true);
    }
    if (key === 'reportBrokenDate') {
      if (value == undefined) {
        getReportBrokenQueryParamClone = { ...getReportBrokenQueryParam, reportBrokenDateFrom: undefined, reportBrokenDateTo: undefined };
      } else {
        getReportBrokenQueryParamClone = {
          ...getReportBrokenQueryParam, // @ts-ignore
          reportBrokenDateFrom: value[0], // @ts-ignore
          reportBrokenDateTo: value[1],
        };
      }
    }
    if (key === 'status') {
      getReportBrokenQueryParamClone = { ...getReportBrokenQueryParam, equipmentStatus: value as string };
    }
    if (key === 'groupId') {
      setSelectedEquipmentGroup(isNaN(Number(value)) ? undefined : Number(value));
      getReportBrokenQueryParamClone = { ...getReportBrokenQueryParam, groupId: isNaN(Number(value)) ? undefined : Number(value), categoryId: undefined };
    }
    if (key === 'categoryId') {
      getReportBrokenQueryParamClone = { ...getReportBrokenQueryParam, categoryId: isNaN(Number(value)) ? undefined : Number(value) };
    }
    if (key === 'departmentId') {
      getReportBrokenQueryParamClone = { ...getReportBrokenQueryParam, departmentId: isNaN(Number(value)) ? undefined : Number(value) };
    }
    if (key === 'keyword') {
      getReportBrokenQueryParamClone = { ...getReportBrokenQueryParam, keyword: value as string };
    }
    if (key === 'page') {
      pagebaleClone = { ...pageableRequest, page: value as number };
    }
    if (key === 'size') {
      pagebaleClone = { ...pageableRequest, size: value as number };
    }
    setGetReportBrokenQueryParam(getReportBrokenQueryParamClone);
    setPageableRequest(pagebaleClone);
    const url = createUrlWithQueryString(location.pathname, getReportBrokenQueryParamClone, pagebaleClone);
    setQueryString(url);
    navigate(url);
  };

  const searchListOfReportBroken = (queryParams: GetEquipmentsForReportBrokenQueryParam, pageableRequest: PageableRequest) => {
    equipmentReportBrokenApi.getAllEquipmentForReportBroken(queryParams, pageableRequest).then((res) => {
      if (res.data.success) {
        setEquipments(res.data.data.content as EquipmentListReportBrokenDto[]);
        setPageable(res.data.data.page as Pageable);
        setLoading(false);

      }
    }).catch((err) => {
      toast.error('Có lỗi xảy ra khi tải dữ liệu');
    });
  };
  useEffect(() => {
    setLoading(true);
    setComponentShouldUpdate(false);
    setPageableRequest({
      page: Number(query.page) || 0, size: Number(query.size) || 20,
    });
    searchListOfReportBroken(getReportBrokenQueryParam, pageableRequest);
    // setLoading(false);
  }, [queryString, keywordSearch, componentShouldUpdate]);
  const handleInputChange = (e: any) => {
    setKeyword(e.target.value);
    onChangeQueryParams('keyword', e.target.value);
  };
  return (<div>
    <div className='flex-between-center'>
      <div className='title'> BÁO HỎNG THIẾT BỊ</div>
      <div className='flex flex-row gap-6'>
        {/*<Button
          className='flex-center text-slate-900 gap-2 rounded-3xl border-[#5B69E6] border-2'
        >
          <FileExcelFilled />
          <div className='font-medium text-md text-[#5B69E6]'>Xuất Excel</div>
        </Button>*/}
      </div>
    </div>
    <Divider />
    <div className='flex justify-between flex-col'>
      <div className=''>
      </div>
      <div className='flex-between-center gap-4 p-4'>
        <Tooltip title='Lọc theo thời gian báo hỏng'>
          <DatePicker.RangePicker
            className={'date'}
            format={ISO_DATE_FORMAT}
            allowClear={true}
            placeholder={['Từ ngày', 'Đến ngày']}
            onChange={(value) => {
              if (value == null || value[0] == null || value[1] == null) {
                onChangeQueryParams('reportBrokenDate', undefined);
                return;
              }
              onChangeQueryParams('reportBrokenDate', [value[0].toISOString(), value[1].toISOString()]);
            }}
          />
        </Tooltip>
        <Select
          showSearch
          placeholder='Tất cả Trạng thái'
          optionFilterProp='children'
          onChange={(value: string) => onChangeQueryParams('status', value)}
          allowClear
          filterOption={(input, option) => (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())}
          options={getStatusOptionForReportBroken()}
        />
        <Select
          showSearch
          placeholder='Khoa - Phòng'
          optionFilterProp='children'
          onChange={(value: string) => onChangeQueryParams('departmentId', value)}
          allowClear
          filterOption={(input, option) => (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())}
          options={options(departments)}
        />
        <Select
          showSearch
          placeholder=' Nhóm thiết bị'
          optionFilterProp='children'
          onChange={(value: string) => onChangeQueryParams('groupId', value)}
          allowClear
          filterOption={(input, option) => (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())}
          options={options(equipmentGroups)}
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
          className='input'
          onChange={handleInputChange}
        />
        <FilterFilled />
      </div>
    </div>
    <Table
      loading={loading} columns={columns} dataSource={equipments as never[]}
      footer={() => (<>
        <TableFooter paginationProps={pagination} />
      </>)}
      pagination={false}
      className='mt-6 shadow-md table-responsive' />
    <ModalCreateReportBrokenTicket
      showCreateReportBrokenTicketModal={showCreateReportBrokenTicketModal}
      hideCreateReportBrokenTicketModal={() => setShowCreateReportBrokenTicketModal(false)}
      callback={() => {
        // increaseCount();
        // getAllNotifications();
        onChangeQueryParams('', '');
      }}
      createReportBrokenTicketModalData={createReportBrokenTicketModalData}
    />

    <ModalAcceptReportBrokenTicket
      showAcceptReportBrokenTicketModal={showAcceptReportBrokenTicketModal}
      hideAcceptReportBrokenTicketModal={() => setShowAcceptReportBrokenTicketModal(false)}
      callback={() => {
        // increaseCount();
        // getAllNotifications();
        onChangeQueryParams('', '');
      }}
      acceptReportBrokenTicketModalData={acceptReportBrokenTicketModalData}
    />
  </div>);
};

export default ReportBroken;
;
;
