import { Divider, Radio } from 'antd';
import { useEffect, useState } from 'react';
import AttachExistSupply from './AttachExistSupply';
import AttachNewSupply from './AttachNewSupply';
import equipmentApi from '../../../../api/equipment.api';
import { EquipmentFullInfoDto } from '../../../../types/equipment.type';
import { useParams } from 'react-router-dom';

export interface AttachSuppliesProps {
  equipment?: EquipmentFullInfoDto;
}

const AttachSupplies = () => {
  const param: any = useParams();
  const { equipmentId } = param;
  const [isAttachNewSupplies, setIsAttachNewSupplies] = useState<boolean>(false);
  const [equipment, setEquipment] = useState<EquipmentFullInfoDto>({});
  useEffect(() => {
    equipmentApi.getEquipmentById(equipmentId).then(res => {
      setEquipment(res.data.data);
    });
  }, [equipmentId]);
  return (<div>
    <div className='flex flex-between-center'>
      <div className='font-medium text-lg'> ĐÍNH KÈM VẬT TƯ</div>
      <div>
        <Radio.Group defaultValue={false}>
          <Radio.Button checked={!isAttachNewSupplies} value={false} onClick={event => setIsAttachNewSupplies(false)}>Đính kèm vật tư có sẵn</Radio.Button>
          <Radio.Button checked={isAttachNewSupplies} value={true} onClick={event => setIsAttachNewSupplies(true)}>Nhập vật tư mới</Radio.Button>
        </Radio.Group>
      </div>
    </div>
    <Divider />
    <div>
      <div className='font-medium text-lg'> THÔNG TIN THIẾT BỊ</div>
      <div>{` Tên thiết bị: ${equipment.name}`}</div>
      <div>{`Model: ${equipment.model}`}</div>
      <div>{`Serial: ${equipment.serial}`}</div>
      <div>{`Mã thiết bị: ${equipment.hashCode}`}</div>
    </div>
    <Divider />

  </div>);
};
export default AttachSupplies;