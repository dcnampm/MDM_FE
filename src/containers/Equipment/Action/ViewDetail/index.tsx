import { useEffect, useState } from 'react';
import { FileWordFilled } from '@ant-design/icons';
import { Divider, Image, PaginationProps, Table, Tooltip } from 'antd';
import { useParams } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import equipmentApi from 'api/equipment.api';
import { EquipmentFullInfoDto } from '../../../../types/equipment.type';
import { HandoverTicketFullInfoDto } from '../../../../types/handover.type';
import i18n from 'i18next';
import image from 'assets/image.png';
import { Moment } from 'moment';

import {
  createImageSourceFromBase64,
  downloadDocumentsByListOfFileStorageDtoes,
  formatCurrencyVn,
  getDateForRendering,
  getTheSecondBiggestIdTicket,
  getIfNull,
  getBiggestIdTicket,
} from '../../../../utils/globalFunc.util';
import { RepairTicketFullInfoDto } from '../../../../types/repair.type';
import { TransferTicketFullInfoDto } from '../../../../types/transfer.type';
import { MaintenanceTicketFullInfoDto } from '../../../../types/maintenance.type';
import { InspectionTicketFullInfoDto } from '../../../../types/equipmentInspection.type';
import { fileApi } from '../../../../api/file.api';
import { FileDescription, FileStorageDto } from '../../../../types/fileStorage.type';
import { EquipmentSupplyUsageDto } from '../../../../types/equipmentSupplyUsage.type';
import { LiquidationTicketFullInfoDto } from '../../../../types/equipmentLiquidation.type';
import DownloadTicketAttachmentsButton from '../../../../components/DownloadTicketAttachmentsButton';
import { ReportBrokenTicketFullInfoDto } from '../../../../types/reportBroken.type';
import notificationApi from 'api/notification.api';
import { EquipmentHistoryDto } from 'types/notification.type';
import { toast } from 'react-toastify';
import useQuery from 'hooks/useQuery';
import { TableFooter } from 'components/TableFooter';


interface DataType {
  key1: string;
  value1: string;
  key2: string;
  value2: string;
}




const Detail = () => {

  const params = useParams<{ equipmentId: string }>();
  const { equipmentId } = params;
  const [equipment, setEquipment] = useState<EquipmentFullInfoDto>({});
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

 
  
  

  const latestCompletedMaintenanceTicket = getBiggestIdTicket(equipment.maintenanceTickets)?.maintenanceDate != null ?
    getBiggestIdTicket(equipment.maintenanceTickets) : getTheSecondBiggestIdTicket(equipment.maintenanceTickets) as MaintenanceTicketFullInfoDto;
  const latestCompletedInspectionTicket = getBiggestIdTicket(equipment.inspectionTickets)?.inspectionDate != null ?
    getBiggestIdTicket(equipment.inspectionTickets) : getTheSecondBiggestIdTicket(equipment.inspectionTickets) as InspectionTicketFullInfoDto;

  const columns: ColumnsType<DataType> = [
    {
      title: 'Trường', dataIndex: 'key1', key: 'key1',
    }, {
      title: 'Giá trị', dataIndex: 'value1', key: 'value1',
    }, {
      title: 'Trường', dataIndex: 'key2', key: 'key2',
    }, {
      title: 'Giá trị', dataIndex: 'value2', key: 'value2',
    },
  ];

  const columnsSupply: any = [
    {
      title: 'Tên vật tư', key: 'name', render: (item: EquipmentSupplyUsageDto) => (<>{item.supply.name}</> /*TODO: supply*/),
    }, {
      title: ' Mã vật tư', key: 'code', render: (item: EquipmentSupplyUsageDto) => (<>{item.supply.hashCode}</>),
    }, {
      title: 'Năm sản xuất', key: 'yearOfManufacture', render: (item: EquipmentSupplyUsageDto) => (<>{item.supply.yearOfManufacture}</>),
    }, {
      title: 'Năm sử dụng', key: 'yearInUse', render: (item: EquipmentSupplyUsageDto) => (<>{item.supply.yearInUse}</>),
    }, {
      title: 'Số lượng vật tư đi kèm thiết bị', key: 'count', render: (item: EquipmentSupplyUsageDto) => (<>{item.amount}</>),
    },
  ];

  const columnsHandover: any[] = [
    {
      title: 'Mã phiếu', key: 'code', render: (item: HandoverTicketFullInfoDto) => (<>{item.code}</>),
    }, {
      title: 'Tên thiết bị', key: 'name', render: () => (<>{equipment.name}</>),
    }, {
      title: 'Ngày bàn giao', key: 'handoverDate', render: (item: HandoverTicketFullInfoDto) => (<>{getDateForRendering(item?.handoverDate as string)}</>),
    }, {
      title: 'Người tạo phiếu', key: 'name', render: (item: HandoverTicketFullInfoDto) => (<>{item.creator?.name}</>),
    }, {
      title: 'Ghi chú của người tạo phiếu', key: 'name', render: (item: HandoverTicketFullInfoDto) => (<>{item.creatorNote}</>),
    }, {
      title: 'Người phụ trách', key: 'handoverInCharge', render: (item: HandoverTicketFullInfoDto) => (<>{item?.responsiblePerson?.name}</>),
    }, {
      title: 'Khoa Phòng nhận bàn giao', key: 'department', render: (item: HandoverTicketFullInfoDto) => (<>{item?.department?.name}</>),
    }, {
      title: ' Ngày bàn giao', key: 'name', render: (item: HandoverTicketFullInfoDto) => (<>{getDateForRendering(item.handoverDate as string)}</>),
    }, {
      title: 'Người  phê duyệt', key: 'name', render: (item: HandoverTicketFullInfoDto) => (<>{item.approver?.name}</>),
    }, {
      title: ' Ngày duyệt', key: 'name', render: (item: HandoverTicketFullInfoDto) => (<>{getDateForRendering(item.approvalDate as string)}</>),
    }, {
      title: ' Ghi chú của người duyệt', key: 'name', render: (item: HandoverTicketFullInfoDto) => (<>{item.creatorNote}</>),
    }, {
      title: ' Trạng thái duyệt', key: 'name', render: (item: HandoverTicketFullInfoDto) => (<>{i18n.t(item?.status as string)}</>),
    }, {
      title: 'Thao tác', key: 'action', render: (item: HandoverTicketFullInfoDto) => (<DownloadTicketAttachmentsButton isInEquipmentDetail={true} ticket={item} />),
    },
  ];

  const columnsRepair: any = [ //TODO: xem lai phan nay
    {
      title: 'Mã phiếu sửa chữa', dataIndex: 'code', key: 'code',
    }, {
      title: ' Trạng thái phiếu', key: 'status', render: (item: RepairTicketFullInfoDto) => (<>{i18n.t(item.status as string)}</>),
    }, {
      title: 'Ngày lập kế hoạch sửa chữa', key: 'createdDate', render: (item: RepairTicketFullInfoDto) => (<>{getDateForRendering(item.createdDate)}</>),
    }, {
      title: 'Ngày sửa chữa', key: 'repairDate', render: (item: RepairTicketFullInfoDto) => (<>{getDateForRendering(item.repairStartDate)}</>),
    }, {
      title: 'Ngày hoàn thành sửa chữa', render: (item: RepairTicketFullInfoDto) => (<>{getDateForRendering(item.repairEndDate)}</>),
    }, {
      title: 'Chi phí dự kiến', render: (item: RepairTicketFullInfoDto) => (<>{formatCurrencyVn(item.estimatedCost as number)}</>),
    }, {
      title: 'Chi phí thực tế', render: (item: RepairTicketFullInfoDto) => (<>{formatCurrencyVn(item.actualCost as number)}</>),
    }, {
      title: 'Nhà cung cấp', key: 'provider', render: (item: RepairTicketFullInfoDto) => (<>{item.repairCompany?.name}</>),
    }, {
      title: 'Tình trạng  sửa chữa', key: 'repairStatus', render: (item: RepairTicketFullInfoDto) => (<>{i18n.t(item.repairStatus as string)}</>),
    }, {
      title: 'Thao tác', key: 'action', render: (item: RepairTicketFullInfoDto) => (<DownloadTicketAttachmentsButton isInEquipmentDetail={true} ticket={item} />),
    },
  ];


  const columnsReportBroken: any = [ //TODO: xem lai phan nay
    {
      title: 'Mã phiếu báo hỏng', dataIndex: 'code', key: 'code',
    }, {
      title: ' Trạng thái phiếu', key: 'status', render: (item: ReportBrokenTicketFullInfoDto) => (<>{i18n.t(item.status as string)}</>),
    }, {
      title: ' Ngày tạo phiếu', key: 'createdDate', render: (item: ReportBrokenTicketFullInfoDto) => (<>{getDateForRendering(item.createdDate)}</>),
    }, {
      title: ' Người tạo phiếu', key: 'creator', render: (item: ReportBrokenTicketFullInfoDto) => (<>{item.creator?.name}</>),
    }, {
      title: ' Lý do hỏng', render: (item: ReportBrokenTicketFullInfoDto) => (<>{item.reason}</>),
    }, {
      title: ' Mức độ ưu tiên', render: (item: ReportBrokenTicketFullInfoDto) => (<>{i18n.t(item.priority as string)}</>),
    }, {
      title: ' Người phê duyệt', key: 'approver', render: (item: ReportBrokenTicketFullInfoDto) => (<>{item.approver?.name}</>),
    }, {
      title: ' Ngày phê duyệt', key: 'approvalDate', render: (item: ReportBrokenTicketFullInfoDto) => (<>{getDateForRendering(item.approvalDate)}</>),
    }, {
      title: 'Thao tác', key: 'action', render: (item: ReportBrokenTicketFullInfoDto) => (<DownloadTicketAttachmentsButton isInEquipmentDetail={true} ticket={item} />),
    },
  ];
  const columnsMaintenance: any = [
    {
      title: 'Mã phiếu bảo dưỡng', dataIndex: 'code', key: 'code',
    }, {
      title: 'Người tạo phiếu', render: (item: MaintenanceTicketFullInfoDto) => (<>{item.creator?.name}</>),
    }, {
      title: ' Ngày tạo phiếu', render: (item: MaintenanceTicketFullInfoDto) => (<>{getDateForRendering(item.createdDate)}</>),
    }, {
      title: 'Trạng thái', render: (item: MaintenanceTicketFullInfoDto) => (<>{i18n.t(item.status as string)}</>),
    }, {
      title: 'Người duyệt', render: (item: MaintenanceTicketFullInfoDto) => (<>{item.approver?.name}</>),
    }, {
      title: ' Ngày duyệt phiếu', render: (item: MaintenanceTicketFullInfoDto) => (<>{getDateForRendering(item.approvalDate)}</>),
    }, {
      title: ' Ngày bảo dưỡng', render: (item: MaintenanceTicketFullInfoDto) => (<>{getDateForRendering(item.maintenanceDate)}</>),
    }, {
      title: 'Giá', render: (item: MaintenanceTicketFullInfoDto) => (<>{formatCurrencyVn(item.price as number)}</>),
    }, {
      title: 'Công ty bảo dưỡng', render: (item: MaintenanceTicketFullInfoDto) => (<>{item.maintenanceCompany?.name}</>),
    }, {
      title: 'Thao tác', key: 'action', render: (item: MaintenanceTicketFullInfoDto) => (<DownloadTicketAttachmentsButton isInEquipmentDetail={true} ticket={item} />),
    },
  ];

  const columnsTranfer: any = [
    {
      title: 'Mã phiếu điều chuyển', render: (item: TransferTicketFullInfoDto) => (<>{item.code}</>),
    }, {
      title: 'Khoa phòng', render: (item: TransferTicketFullInfoDto) => (<>{item.fromDepartment?.name}</>),
    }, {
      title: 'Khoa phòng điều chuyển', render: (item: TransferTicketFullInfoDto) => (<>{item.toDepartment?.name}</>),
    }, {
      title: 'Người tạo phiếu', render: (item: TransferTicketFullInfoDto) => (<>{item.creator?.name}</>),
    }, {
      title: ' Ngày tạo phiếu', render: (item: TransferTicketFullInfoDto) => (<>{getDateForRendering(item.createdDate)}</>),
    }, {
      title: 'Ngày điều chuyển', render: (item: TransferTicketFullInfoDto) => (<>{getDateForRendering(item.dateTransfer)}</>),
    }, {
      title: 'Trạng thái', render: (item: TransferTicketFullInfoDto) => (<>{i18n.t(item.status as string)}</>),
    }, {
      title: 'Người duyệt', render: (item: TransferTicketFullInfoDto) => (<>{item.approver?.name}</>),
    }, {
      title: ' Ngày duyệt phiếu', render: (item: TransferTicketFullInfoDto) => (<>{getDateForRendering(item.approvalDate)}</>),
    }, {
      title: 'Thao tác', key: 'action', render: (item: TransferTicketFullInfoDto) => (<DownloadTicketAttachmentsButton isInEquipmentDetail={true} ticket={item} />),
    },
  ];

  const columnsInspection: any = [
    {
      title: 'Mã phiếu kiểm định', render: (item: InspectionTicketFullInfoDto) => (<>{item.code}</>),
    }, {
      title: 'Người tạo phiếu', render: (item: InspectionTicketFullInfoDto) => (<>{item.creator?.name}</>),
    }, {
      title: ' Ngày tạo phiếu', render: (item: InspectionTicketFullInfoDto) => (<>{getDateForRendering(item.createdDate)}</>),
    }, {
      title: ' Ngày kiểm định', render: (item: InspectionTicketFullInfoDto) => (<>{getDateForRendering(item.inspectionDate)}</>),
    }, {
      title: 'Trạng thái', render: (item: InspectionTicketFullInfoDto) => (<>{i18n.t(item.status as string)}</>),
    }, {
      title: 'Người duyệt', render: (item: InspectionTicketFullInfoDto) => (<>{item.approver?.name}</>),
    }, {
      title: ' Ngày duyệt phiếu', render: (item: InspectionTicketFullInfoDto) => (<>{getDateForRendering(item.approvalDate)}</>),
    }, {
      title: 'Giá', render: (item: InspectionTicketFullInfoDto) => (<>{formatCurrencyVn(item.price as number)}</>),
    }, {
      title: 'Công ty kiểm định', render: (item: InspectionTicketFullInfoDto) => (<>{item.inspectionCompany?.name}</>),
    }, {
      title: ' Tình trạng thiết bị', render: (item: InspectionTicketFullInfoDto) => (<>{i18n.t(item.evaluationStatus as string)}</>),
    }, {
      title: 'Thao tác', key: 'action', render: (item: InspectionTicketFullInfoDto) => (<DownloadTicketAttachmentsButton isInEquipmentDetail={true} ticket={item} />),
    },
  ];


  const columnsLiquidation: any = [
    {
      title: 'Mã phiếu thanh lý', render: (item: LiquidationTicketFullInfoDto) => (<>{item.code}</>),
    }, {
      title: 'Người tạo phiếu', render: (item: LiquidationTicketFullInfoDto) => (<>{item.creator?.name}</>),
    }, {
      title: ' Ngày tạo phiếu', render: (item: LiquidationTicketFullInfoDto) => (<>{getDateForRendering(item.createdDate)}</>),
    }, {
      title: ' Ngày thanh lý', render: (item: LiquidationTicketFullInfoDto) => (<>{getDateForRendering(item.liquidationDate)}</>),
    }, {
      title: 'Trạng thái', render: (item: LiquidationTicketFullInfoDto) => (<>{i18n.t(item.status as string)}</>),
    }, {
      title: 'Người duyệt', render: (item: LiquidationTicketFullInfoDto) => (<>{item.approver?.name}</>),
    }, {
      title: ' Ngày duyệt phiếu', render: (item: LiquidationTicketFullInfoDto) => (<>{getDateForRendering(item.approvalDate)}</>),
    }, {
      title: 'Giá thanh lý', render: (item: LiquidationTicketFullInfoDto) => (<>{formatCurrencyVn(item.price as number)}</>),
    }, {
      title: 'Thao tác', key: 'action', render: (item: LiquidationTicketFullInfoDto) => (<DownloadTicketAttachmentsButton isInEquipmentDetail={true} ticket={item} />),
    },
  ];
  
  const columnsHistory: any = [
    {
      title: 'Thời gian', render: (item: EquipmentHistoryDto) => (<>{getDateForRendering(item.createdAt)}</>),
    }, {
      title: 'Lịch sử hoạt động', render: (item: EquipmentHistoryDto) => (<>{item.content}</>),
    }
  ]
  const query = useQuery();
  const currentPage = query?.page;
  const [page, setPage] = useState<number>(currentPage || 0);
  const [size, setSize] = useState<number>(5);
  const [total, setTotal] = useState<number>(1);
  const onPaginationChange = (page: number, size: number) => {
    setPage(page);
    setSize(size);
  };
  
  const pagination: PaginationProps = {
    current: page,
    total: total,
    pageSize: size,
    // showTotal: (total: number) => `Tổng cộng: ${total} thiết bị`,
    onChange: onPaginationChange,
    showQuickJumper: true,
  };
  const [history, setHistory] = useState<EquipmentHistoryDto[]>([]);
  const getEquipmentHistory = (equipmentId : Number, page: number, size: number) => {
    notificationApi.getNotificationsByEquipmentId({equipmentId}, {page: page, size: size})
      .then(res => {
        console.log("data", res);
        setHistory(res.data.data.content as EquipmentHistoryDto[]);
        setTotal(res.data.data?.page?.totalElements as number);
      })
      .catch(error => {
        console.log('Error in equipment list when call api getEquipments: ', error);
        toast.error('Lỗi tìm kiếm thiết bị');
      }
      );;

  }

  useEffect(() => {
    setLoading(true);
    equipmentApi.getEquipmentById(Number(equipmentId))
      .then((res) => {
        if (res.data.success) {
          const equipment = res.data.data;
          setEquipment(equipment);
          const imageId = equipment.attachments?.filter(values => values.description === FileDescription.IMAGE)[0]?.id;
          if (imageId) {
            fileApi.getImage(imageId).then((res) => {
              setImageUrl(createImageSourceFromBase64(res.data.data.data));
            });
          }
        }
      }).finally(() => setLoading(false));
    getEquipmentHistory(Number(equipmentId), page, size)
  }, [equipmentId, page, size]);




  const data: DataType[] = [
    {
      key1: 'Khoa - Phòng', value1: `${getIfNull(equipment?.department?.name, '')}`, key2: 'Trạng thái', value2: `${i18n.t(equipment.status as string)}`,
    }, {
      key1: 'Model', value1: `${equipment?.model}`, key2: 'Serial', value2: `${equipment?.serial}`,
    }, {
      key1: 'Ngày nhập kho',
      value1: `${equipment?.warehouseImportDate ? getDateForRendering(equipment.warehouseImportDate) : ''}`,
      key2: 'Loại thiết bị',
      value2: `${equipment?.category?.name}`,
    }, {
      key1: 'Giá nhập', value1: `${formatCurrencyVn(equipment?.importPrice as number)}` || '', key2: 'Số lượng', value2: '1',
    }, {
      key1: 'Năm sản xuất', value1: getIfNull(equipment?.yearOfManufacture, ''), key2: 'Năm sử dụng', value2: getIfNull(equipment?.yearInUse, ''),
    }, {
      key1: 'Hãng sản xuất', value1: getIfNull(equipment?.manufacturer, ''), key2: 'Quốc gia', value2: `${getIfNull(equipment?.manufacturingCountry, '')}`,
    }, {
      key1: 'Thời điểm kết thúc HĐ LDLK',
      value1: `${getDateForRendering(equipment.jointVentureContractExpirationDate)}`,
      key2: 'Ngày hết hạn bảo hành',
      value2: `${getDateForRendering(equipment.warrantyExpirationDate)}`,
    }, {
      key1: 'Bảo dưỡng định kỳ',
      value1: equipment.regularMaintenance === 0 ? 'Không bắt buộc' : `${equipment.regularMaintenance} tháng`,
      key2: 'Ngày bảo dưỡng gần nhất', //lấy ngày kiểm định của phiếu gần nhất nếu có, còn ko thì lấy của phiếu trước đó
      value2: getDateForRendering(latestCompletedMaintenanceTicket?.maintenanceDate),
    }, 
    // {
    //   key1: 'Kiểm định định kỳ',
    //   value1: equipment.regularInspection === 0 ? 'Không bắt buộc' : `${equipment.regularInspection} tháng`,
    //   key2: 'Ngày kiểm định gần nhất', //lấy ngày kiểm định của phiếu gần nhất nếu có, còn ko thì lấy của phiếu trước đó
    //   value2: getDateForRendering(latestCompletedInspectionTicket?.inspectionDate),
    // },
  ];
  return (<div>
    <div className='flex-between-center'>
      <div className='font-medium text-lg'>HỒ SƠ THIẾT BỊ</div>
      {/*TODO: xuat file pdf*/}
      {/*<Button
        loading={loading}
        className='flex flex-row items-center text-slate-900 gap-2 rounded-3xl border-[#5B69E6] border-2'
      >
        <FilePdfFilled />
        <div
          className='font-medium text-md text-[#5B69E6]'
        >Xuất PDF
        </div>
      </Button>*/}
    </div>
    <Divider />
    <div id='detail' className=''>
      <div className='flex flex-row gap-6 my-8'>
      <div className='basis-2/3'>
          <div className='font-bold text-2xl'>{equipment?.name}</div>
          <div className='mt-4'>
            <Table columns={columns} dataSource={data} pagination={false} className='shadow-md' />
          </div>
        </div>
        <div className='flex flex-col gap-4 items-center basis-1/3'>
          <Image
            src={imageUrl == null ? image : imageUrl} /*TODO: Sua lai phan anh*/
            width={300}
          />
          <div>Ảnh thiết bị</div>
          {/*TODO: Sua lai phan qr code*/}
          <Image
            src={equipment?.qrCode}
            width={300}
          />
          <div>Mã QR thiết bị</div>
        </div>
        
      </div>
      <Divider />
      {/*TODO: sua lai phan nay*/}
      {/* <div>
        <div className='text-center font-bold text-2xl mb-9'>Danh sách vật tư đi kèm</div>
        <Table loading={loading} columns={columnsSupply} dataSource={equipment.equipmentSupplyUsages} pagination={false} className='shadow-md' />
      </div> */}
      <Divider />
      <div>
        <div className='text-center font-bold text-2xl mb-9'>Thống kê lịch sử hoạt động của thiết bị</div>
        <div className='mb-10'>
          <div className='font-bold text-xl mb-6'> Tình trạng hoạt động</div>
          <Table 
          loading={loading} 
          columns={columnsHistory} 
          dataSource={history} 
          className='shadow-md'
          footer={() => (<>
            <TableFooter paginationProps={pagination} />
          </>)}
          pagination={false} />
        </div>
        <div className='mb-10'>
          <div className='font-bold text-xl mb-6'>Thông tin bàn giao</div>
          <Table
            loading={loading}
            columns={columnsHandover}
            dataSource={equipment.handoverTickets}
            pagination={false}
            className='shadow-md' />
        </div>
        <div className='mb-10'>
          <div className='font-bold text-xl mb-6'> Lịch sử báo hỏng</div>
          <Table loading={loading} columns={columnsReportBroken} dataSource={equipment.reportBrokenTickets} pagination={false} className='shadow-md' />
        </div>
        <div className='mb-10'>
          <div className='font-bold text-xl mb-6'>Lịch sử sửa chữa</div>
          <Table loading={loading} columns={columnsRepair} dataSource={equipment.repairTickets} pagination={false} className='shadow-md' />
        </div>
        <div className='mb-10'>
          <div className='font-bold text-xl mb-6'>Lịch sử điều chuyển</div>
          <Table loading={loading} columns={columnsTranfer} dataSource={equipment.transferTickets} pagination={false} className='shadow-md' />
        </div>
        <div className='mb-10'>
          <div className='font-bold text-xl mb-6'>Lịch sử bảo dưỡng</div>
          <Table loading={loading} columns={columnsMaintenance} dataSource={equipment.maintenanceTickets} pagination={false} className='shadow-md' />
        </div>
        {/* <div className='mb-10'>
          <div className='font-bold text-xl mb-6'>Lịch sử kiểm định</div>
          <Table loading={loading} columns={columnsInspection} dataSource={equipment.inspectionTickets} pagination={false} className='shadow-md' />
        </div> */}
        <div className='mb-10'>
          <div className='font-bold text-xl mb-6'>Lịch sử thanh lý</div>
          <Table loading={loading} columns={columnsLiquidation} dataSource={equipment.liquidationTickets} pagination={false} className='shadow-md' />
        </div>
      </div>
    </div>

  </div>);
};

export default Detail;

function setTotal(arg0: number) {
  throw new Error('Function not implemented.');
}
