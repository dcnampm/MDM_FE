import { useContext, useEffect, useState } from 'react';
import {
  CheckCircleOutlined, EyeFilled, FileExcelFilled, FileWordFilled, FilterFilled, FormOutlined, PlusCircleFilled, ProfileFilled,
} from '@ant-design/icons';
import { Button, DatePicker, Divider, Input, Menu, Select, Table, Tooltip } from 'antd';
import useDebounce from 'hooks/useDebounce';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import { EquipmentListInspectionDto, EquipmentStatus } from '../../../types/equipment.type';
import { PageableRequest } from '../../../types/commonRequest.type';
import useQuery from '../../../hooks/useQuery';
import { GetEquipmentsForInspectionQueryParam } from '../../../types/equipmentInspection.type';
import {
  createUrlWithQueryString,
  getCycleOption,
  getDateForRendering,
  getTheSecondBiggestIdTicket,
  getEquipmentCategoryOptions,
  getBiggestIdTicket,
  getStatusOptionForInspection,
  hasAuthority,
  options,
} from '../../../utils/globalFunc.util';
import equipmentInspectionApi from '../../../api/equipmentInspection.api';
import i18n from 'i18next';
import { Authority } from '../../../constants/authority';
import { ModalCreateInspectionTicket } from '../../../components/ModalCreateInspectionTicket';
import ModalAcceptInspectionTicket from '../../../components/ModalAcceptInspectionTicket';
import { ISO_DATE_FORMAT } from '../../../constants/dateFormat.constants';
import { FilterContext } from '../../../contexts/filter.context';
import { NotificationContext } from '../../../contexts/notification.context';

const { Option } = Select;

interface DataType {
  key: string;
  image: string;
  code: string;
  name: string;
  model: string;
  serial: string;
  status: string;
  room: string;
}

export interface CreateInspectionTicketModalData {
  equipment?: EquipmentListInspectionDto;
}

export interface AcceptInspectionTicketModalData {
  equipment?: EquipmentListInspectionDto;
}

const Inspection = () => {
  const columns: ColumnsType<EquipmentListInspectionDto> = [
    {
      title: 'Mã thiết bị', render: (item: EquipmentListInspectionDto) => (<div>{item.hashCode}</div>),
    }, {
      title: 'Tên thiết bị', key:'name', dataIndex:'name'
    },  {
      title: 'Model', key:'model', dataIndex:'model'
    },   {
      title: 'Serial', key:'serial', dataIndex:'serial'
    },{
      title: 'Trạng thái', key: 'status', render: (item: EquipmentListInspectionDto) => (<div>{i18n.t(item.status as string)}</div>),
    }, {
      title: 'Khoa - Phòng', key: 'department', render: (item: EquipmentListInspectionDto) => (<div>{item.department?.name}</div>),
    }, {
      title: 'Chu kỳ kiểm định', key: 'cycle', render: (item: EquipmentListInspectionDto) => (<div>{item.regularInspection} tháng </div>),
    }, {
      title: 'Ngày kiểm định lần cuối', render: (item: EquipmentListInspectionDto) => {
        //lấy ra last time của ticket mới nhất, nếu ticket không có last time nghĩa là ticket này chưa được hoàn thành => lấy last time của ticket trước đó
        let inspectionDate: string = getDateForRendering(item.lastInspectionDate);
        return (<div>{inspectionDate}</div>);
      },
    }, {
      title: 'Ngày kiểm định tiếp theo', render: (item: EquipmentListInspectionDto) => {
        //lấy ra next time của ticket mới nhất, nếu ticket không có next time nghĩa là ticket này chưa được hoàn thành => lấy next time của ticket trước đó
        let nextTime: string = getDateForRendering(item.nextInspectionDate);
        return (<div>{nextTime}</div>);
      },
    }, {
      title: 'Tác vụ', key: 'action', render: (item: EquipmentListInspectionDto) => (<Menu className='flex items-center'>
        {item.status === EquipmentStatus.IN_USE && hasAuthority(Authority.INSPECTION_CREATE) && <Menu.Item key='word'>
          <Tooltip title='Tạo phiếu đề xuất kiểm định'>
            <PlusCircleFilled
              onClick={() => {
                showCreateInspectionTicketModalAndRenderData(item);
              }} />
          </Tooltip>
        </Menu.Item>}
        {item.status === EquipmentStatus.PENDING_ACCEPT_INSPECTION && hasAuthority(Authority.INSPECTION_ACCEPT) && <Menu.Item key='edit'>
          <Tooltip title='Phê duyệt phiếu đề xuất kiểm định'>
            <CheckCircleOutlined
              onClick={event => {
                showAcceptInspectionTicketModalAndRenderData(item);
              }} />
          </Tooltip>
        </Menu.Item>}
        {item.status === EquipmentStatus.UNDER_INSPECTION && hasAuthority(Authority.INSPECTION_UPDATE) && <Menu.Item key='edit'>
          <Tooltip title=' Cập nhật tiến độ kiểm định'>
            <FormOutlined
              onClick={event => {
                navigate(`/equipments/${item.id}/inspections/${getBiggestIdTicket(item.inspectionTickets)?.id}/update`);
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
  const { equipmentGroups, equipmentCategories, departments } = useContext(FilterContext);
  const [equipments, setEquipments] = useState<EquipmentListInspectionDto[]>([]);
  const [getInspectionQueryParam, setGetInspectionQueryParam] = useState<GetEquipmentsForInspectionQueryParam>({});
  const query = useQuery();
  const [pageable, setPageable] = useState<PageableRequest>({ size: 20, page: 0 });
  const navigate = useNavigate();
  const location = useLocation();
  const [queryString, setQueryString] = useState<string>(location.search);
  const [showCreateInspectionTicketModal, setShowCreateInspectionTicketModal] = useState<boolean>(false);
  const [showAcceptInspectionTicketModal, setShowAcceptInspectionTicketModal] = useState<boolean>(false);
  // const [createInspectionTicketModalData, setCreateInspectionTicketModalData] = useState<CreateInspectionTicketModalData>({});
  // const [acceptInspectionTicketModalData, setAcceptInspectionTicketModalData] = useState<AcceptInspectionTicketModalData>({});
  const [keyword, setKeyword] = useState<string>(query.keyword);
  const [loading, setLoading] = useState<boolean>(false);
  const [componentShouldUpdate, setComponentShouldUpdate] = useState<boolean>(false);
  const keywordSearch = useDebounce(getInspectionQueryParam.keyword as string, 500);
  const [selectedEquipmentGroup, setSelectedEquipmentGroup] = useState<number | undefined>(undefined);
  const [createInspectionTicketModalData, setCreateInspectionTicketModalData] = useState<CreateInspectionTicketModalData>({});
  const [acceptInspectionTicketModalData, setAcceptInspectionTicketModalData] = useState<AcceptInspectionTicketModalData>({});
  const { increaseCount, getAllNotifications } = useContext(NotificationContext);

  const showCreateInspectionTicketModalAndRenderData = (item: EquipmentListInspectionDto) => {
    setShowCreateInspectionTicketModal(true);
    setCreateInspectionTicketModalData({ equipment: item });
  };
  const showAcceptInspectionTicketModalAndRenderData = (item: EquipmentListInspectionDto) => {
    setShowAcceptInspectionTicketModal(true);
    setAcceptInspectionTicketModalData({ equipment: item });
  };


  const handleInputChange = (e: any) => {
    setKeyword(e.target.value);
    onChangeQueryParams('keyword', e.target.value);
  };
  const searchListOfInspection = (getInspectionQueryParam: GetEquipmentsForInspectionQueryParam, pageable: PageableRequest) => {
    equipmentInspectionApi.getAllEquipmentForInspection(getInspectionQueryParam, pageable).then((res) => {
      if (res.data.success) {
        setEquipments(res.data.data.content as EquipmentListInspectionDto[]);
        setLoading(false);
      }
    });
  };
  useEffect(() => {
    setLoading(true);
    setComponentShouldUpdate(false);
    setPageable({
      page: Number(query.page) || 0, size: Number(query.size) || 20,
    });
    searchListOfInspection(getInspectionQueryParam, pageable);
    // setLoading(false);
  }, [queryString, keywordSearch, componentShouldUpdate]);
  const onChangeQueryParams = (key: string, value: string | string[] | undefined) => {
    let pagebaleClone: PageableRequest;
    pagebaleClone = { ...pageable, page: 0 };
    let getInspectionQueryParamClone: GetEquipmentsForInspectionQueryParam = getInspectionQueryParam;
    if (key === '') { //if key is empty, it means that the component should be updated
      setComponentShouldUpdate(true);
    }
    if (key === 'inspectionDate') {
      if (value == undefined) {
        getInspectionQueryParamClone = { ...getInspectionQueryParam, lastTimeFrom: undefined, lastTimeTo: undefined };
      } else {
        getInspectionQueryParamClone = { ...getInspectionQueryParam, lastTimeFrom: value[0], lastTimeTo: value[1] };
      }
    }
    if (key === 'groupId') {
      setSelectedEquipmentGroup(isNaN(Number(value)) ? undefined : Number(value));
      getInspectionQueryParamClone = { ...getInspectionQueryParam, groupId: isNaN(Number(value)) ? undefined : Number(value), categoryId: undefined };
    }
    if (key === 'categoryId') {
      getInspectionQueryParamClone = { ...getInspectionQueryParam, categoryId: isNaN(Number(value)) ? undefined : Number(value) };
    }
    if (key === 'regularInspection') {
      getInspectionQueryParamClone = { ...getInspectionQueryParam, regularInspection: isNaN(Number(value)) ? undefined : Number(value) };
    }
    if (key === 'nextTime') {
      if (value == undefined) {
        getInspectionQueryParamClone = { ...getInspectionQueryParam, nextTimeFrom: undefined, nextTimeTo: undefined };
      } else {
        getInspectionQueryParamClone = { ...getInspectionQueryParam, nextTimeFrom: value[0], nextTimeTo: value[1] };
      }
    }
    if (key === 'status') {
      getInspectionQueryParamClone = { ...getInspectionQueryParam, equipmentStatus: value as string };
    }
    if (key === 'departmentId') {
      getInspectionQueryParamClone = { ...getInspectionQueryParam, departmentId: isNaN(Number(value)) ? undefined : Number(value) };
    }
    if (key === 'keyword') {
      getInspectionQueryParamClone = { ...getInspectionQueryParam, keyword: value as string };
    }
    setGetInspectionQueryParam(getInspectionQueryParamClone);
    setPageable(pagebaleClone);
    const url = createUrlWithQueryString(location.pathname, getInspectionQueryParamClone, pagebaleClone);
    setQueryString(url);
    navigate(url);
  };
  return (<div>
    <div className='flex-between-center'>
      <div className='title'>DANH SÁCH THIẾT BỊ CẦN KIỂM ĐỊNH</div>
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
    <div className='flex justify-between'>
      <div></div>
      <div className='flex-between-center gap-4 p-4'>
        <Tooltip title='Lọc theo thời gian kiểm định lần cuối'>
          <DatePicker.RangePicker
            className={'date'}
            format={ISO_DATE_FORMAT}
            allowClear={true}
            placeholder={['Từ ngày', 'Đến ngày']}
            onChange={(value) => {
              if (value == null || value[0] == null || value[1] == null) {
                onChangeQueryParams('inspectionDate', undefined);
                return;
              }
              onChangeQueryParams('inspectionDate', [value[0].toISOString(), value[1].toISOString()]);
            }}
          />
        </Tooltip>
        <Tooltip title='Lọc theo thời gian kiểm định tiếp theo'>
          <DatePicker.RangePicker
            className={'date'}
            format={ISO_DATE_FORMAT}
            allowClear={true}
            placeholder={['Từ ngày', 'Đến ngày']}
            onChange={(value) => {
              if (value == null || value[0] == null || value[1] == null) {
                onChangeQueryParams('nextTime', undefined);
                return;
              }
              onChangeQueryParams('nextTime', [value[0].toISOString(), value[1].toISOString()]);
            }}
          />
        </Tooltip>
        <Select
          showSearch
          placeholder=' Chọn chu kỳ kiểm định'
          optionFilterProp='children'
          onChange={(value: string) => onChangeQueryParams('regularInspection', value)}
          allowClear
          filterOption={(input, option) => (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())}
          options={getCycleOption()}
        />
        <Select
          showSearch
          placeholder='Tất cả Trạng thái'
          optionFilterProp='children'
          onChange={(value: string) => onChangeQueryParams('status', value)}
          allowClear
          options={getStatusOptionForInspection()}
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
    <Table columns={columns} dataSource={equipments} className='mt-6 shadow-md table-responsive' />

    <ModalCreateInspectionTicket
      showCreateInspectionTicketModal={showCreateInspectionTicketModal}
      hideCreateInspectionTicketModal={() => setShowCreateInspectionTicketModal(false)}
      callback={() => {
        // increaseCount();
        // getAllNotifications();
        onChangeQueryParams('', '');
      }}
      createInspectionTicketModalData={createInspectionTicketModalData}
    />

    <ModalAcceptInspectionTicket
      showAcceptInspectionTicketModal={showAcceptInspectionTicketModal}
      hideAcceptInspectionTicketModal={() => setShowAcceptInspectionTicketModal(false)}
      callback={() => {
        // increaseCount();
        // getAllNotifications();
        onChangeQueryParams('', '');
      }}
      acceptInspectionTicketModalData={acceptInspectionTicketModalData}
    />
  </div>);
};

export default Inspection;