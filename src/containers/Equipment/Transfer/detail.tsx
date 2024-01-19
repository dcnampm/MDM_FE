import { FileWordFilled } from '@ant-design/icons';
import { Divider, Menu, Table, Tooltip } from 'antd';
import equipmentTransferApi from 'api/equipment_transfer.api';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { downloadTransferDocx } from 'utils/file.util';
import { getDateForRendering } from '../../../utils/globalFunc.util';
import i18n from 'i18next';
import { TransferListDto } from '../../../types/transfer.type';
import { EquipmentDto } from '../../../types/equipment.type';

const TransferDetail = () => {
  const param: any = useParams();
  const { equipmentId } = param;
  const [transferListDto, setTransferListDto] = useState<TransferListDto[]>();
  const [equipment, setEquipment] = useState<EquipmentDto>();
  const [transferData, setTransferData] = useState<any>([]);
  const columns: any = [
    {
      title: 'Người tạo phiếu', key: 'createUserId', show: true, widthExcel: 35, render: (item: TransferListDto) => (<>{item.creator?.name}</>),
    }, {
      title: 'Ngày tạo phiếu',
      key: 'transferDate',
      show: true,
      widthExcel: 30,
      render: (item: TransferListDto) => (<>{getDateForRendering(item?.createdDate)}</>),
    }, {
      title: 'Khoa - Phòng hiện tại', key: 'fromDepartment', show: true, widthExcel: 30, render: (item: TransferListDto) => {
        return (<>{item?.fromDepartment?.name}</>);
      },
    }, {
      title: 'Khoa - Phòng điều chuyển', key: 'toDepartment', show: true, widthExcel: 30, render: (item: TransferListDto) => {
        return (<>{item?.toDepartment?.name}</>);
      },
    }, {
      title: 'Tình trạng xử lý',
      key: 'transferStatus',
      show: true,
      widthExcel: 20,
      render: (item: TransferListDto) => (<>{i18n?.t(item.status as string).toString()}</>),
    }, {
      title: 'Người phê duyệt', key: 'approverId', show: true, widthExcel: 30, render: (item: TransferListDto) => (<>{item?.approver?.name}</>),
    }, {
      title: 'Tác vụ', key: 'action', show: true, render: (item: TransferListDto) => (<Menu className='flex flex-row'>
        {<Menu.Item key='word'>
          <Tooltip title='Biên bản điều chuyển'>
            <FileWordFilled onClick={() => handleDownloadTransferData(item)} />
          </Tooltip>
        </Menu.Item>}
      </Menu>),
    },
  ];
  const [columnTable, setColumnTable] = useState<any>(columns);

  useEffect(() => {
    equipmentTransferApi.getAllTransferTicketsOfAnEquipment(equipmentId).then((res) => {
      setTransferListDto(res.data.data.content);
      setEquipment(res.data.data.content[0]?.equipment);
    })
  }, [equipmentId]);

  const handleDownloadTransferData = (item: TransferListDto) => {
    let data = {
      name: item.equipment?.name,
      model: item?.equipment?.model,
      serial: item?.equipment?.serial,
      fromDepartment: item?.fromDepartment?.name,
      toDepartment: item?.toDepartment?.name,
      transferDate: getDateForRendering(item?.dateTransfer),
      transferCreateUser: item?.creator?.name,
      transferApprover: item?.approver?.name,
      note: item?.transferNote,
    };
    downloadTransferDocx(data);
  };

  return (<div>
    <div className='title text-center'>DANH SÁCH PHIẾU YÊU CẦU ĐIỀU CHUYỂN THIẾT BỊ</div>
    <Divider />
    <div>
      <div className='title'>THÔNG TIN THIẾT BỊ</div>
      <div>Tên: {equipment?.name}</div>
      <div>Model: {equipment?.model}</div>
      <div>Serial: {equipment?.serial}</div>
    </div>
    <Divider />
    <div className='flex flex-row justify-between'>
      <div className='title'>CHI TIẾT PHIẾU YÊU CẦU ĐIỀU CHUYỂN</div>
    </div>
    <Table
      columns={columnTable.filter((item: any) => item.show)}
      dataSource={transferListDto as TransferListDto[]}
      className='mt-6 shadow-md'
      pagination={false}
    />
  </div>);
};

export default TransferDetail;