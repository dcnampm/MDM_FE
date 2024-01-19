import { Button, Form, Input, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { downloadBrokenDocx } from 'utils/file.util';
import { equipmentReportBrokenApi } from '../../../api/equipmentReportBrokenApi';
import { getDateForRendering, getBiggestIdTicket } from '../../../utils/globalFunc.util';
import i18n from 'i18next';
import { EquipmentFullInfoDto } from '../../../types/equipment.type';
import { ReportBrokenTicketFullInfoDto } from '../../../types/reportBroken.type';
import DownloadTicketAttachmentsButton from '../../../components/DownloadTicketAttachmentsButton';

interface BrokenReportProps {
  equipment: EquipmentFullInfoDto;
}

const BrokenReport = (props: BrokenReportProps) => {

  const { equipment } = props;
  const [form] = Form.useForm();
  const [reportBrokenTicket, setReportBrokenTicket] = useState<ReportBrokenTicketFullInfoDto>({});
  useEffect(() => {
    if (Object.keys(equipment)?.length === 0) return;
    equipmentReportBrokenApi.getReportBrokenTicketDetail(equipment.id as number, getBiggestIdTicket(equipment.reportBrokenTickets)?.id as number)
      .then((res) => {
        setReportBrokenTicket(res.data.data);
      });

  }, [equipment]);

  return (<div>
    <div className='title'>THÔNG TIN PHIẾU BÁO HỎNG</div>
    <Form size='large' layout='vertical' form={form}>
      <div className='grid grid-cols-2 gap-5'>
        <Form.Item label='Tên thiết bị'>
          <Input disabled className='input' value={equipment.name} />
        </Form.Item>
        <Form.Item label='Khoa - Phòng'>
          <Input disabled className='input' value={equipment.department?.name} />
        </Form.Item>
      </div>
      <div className='grid grid-cols-2 gap-5'>
        <Form.Item label='Model'>
          <Input disabled className='input' value={equipment.model} />
        </Form.Item>
        <Form.Item label='Serial'>
          <Input disabled className='input' value={equipment.serial} />
        </Form.Item>
      </div>
      <div className='grid grid-cols-2 gap-5'>
        <Form.Item label='Lí do hỏng'>
          <Input disabled className='input' value={reportBrokenTicket.reason} />
        </Form.Item>
        <Form.Item label='Mức độ ưu tiên'>
          <Input disabled value={i18n.t(reportBrokenTicket.priority as string).toString()} />
        </Form.Item>
      </div>
      <div className='grid grid-cols-2 gap-5'>
        <Form.Item label='Ngày báo hỏng'>
          <Input disabled className='input' value={getDateForRendering(reportBrokenTicket.createdDate)} />
        </Form.Item>
        <Form.Item label='Người báo hỏng'>
          <Input disabled className='input' value={reportBrokenTicket.creator?.name} />
        </Form.Item>
      </div>
      <div className='flex gap-6'>
        <DownloadTicketAttachmentsButton ticket={reportBrokenTicket}/>
      </div>
    </Form>
  </div>);
};

export default BrokenReport;