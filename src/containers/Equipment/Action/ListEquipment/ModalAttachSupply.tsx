import { AttachSupplyForm, EquipmentListDto } from '../../../../types/equipment.type';
import { Button, Form, Input, Modal, Select } from 'antd';
import equipmentApi from '../../../../api/equipment.api';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { GetSupplyQueryParam, SupplyFullInfoDto } from '../../../../types/supply.type';
import useDebounce from '../../../../hooks/useDebounce';
import { PageableRequest } from '../../../../types/commonRequest.type';
import { useLocation } from 'react-router-dom';
import supplyApi from '../../../../api/supply.api';
import { options } from '../../../../utils/globalFunc.util';
import TextArea from 'antd/lib/input/TextArea';

export interface ModalAttachSupplyProps {
  equipment?: EquipmentListDto;
  showAttachSupplyModal: boolean;
  hideAttachSupplyModal: () => void;
  callback?: () => void;
}

const ModalAttachSupply = (props: ModalAttachSupplyProps) => {
  const {
    showAttachSupplyModal, hideAttachSupplyModal, callback, equipment,
  } = props;
  const [form] = Form.useForm<AttachSupplyForm>();
  const [supplies, setSupplies] = useState<SupplyFullInfoDto[]>([]);
  const [getSuppliesQueryParam, setGetSuppliesQueryParam] = useState<GetSupplyQueryParam>({});
  const keywordSearch = useDebounce(getSuppliesQueryParam.keyword as string, 500);
  const [keyword, setKeyword] = useState<string>('');
  const [componentShouldUpdate, setComponentShouldUpdate] = useState<boolean>(false);
  const [pageableRequest, setPageableRequest] = useState<PageableRequest>({ size: 1000, page: 0 });
  const location = useLocation();

  const attachSupply = (values: AttachSupplyForm) => {
    equipmentApi.attachSupply(values).then(res => {
      if (res.data.success) {
        toast.success('Đính kèm vật tư thành công!');
        hideAttachSupplyModal();
        form.resetFields();
        callback && callback();
      }
    });
  };
  const onChangeQueryParams = (key: string, value: string | string[] | undefined | number | PageableRequest | number[]) => {
    let pagebaleClone: PageableRequest;
    pagebaleClone = { ...pageableRequest, page: 0 };
    let getSuppliesQueryParamClone: GetSupplyQueryParam = getSuppliesQueryParam;
    if (key === '') { //if key is empty, it means that the component should be updated
      setComponentShouldUpdate(true);
    }
    if (key === 'keyword') {
      setKeyword(value as string);
      getSuppliesQueryParamClone = { ...getSuppliesQueryParamClone, keyword: value as string };
    }
    setGetSuppliesQueryParam(getSuppliesQueryParamClone);
    setPageableRequest(pagebaleClone);
    setComponentShouldUpdate(true);
  };
  useEffect(() => {
    supplyApi.getSupplies({ keyword: keywordSearch }, pageableRequest).then(res => {
      console.log("supplies: ", res);
      setSupplies(res.data.data.content);
    });
  }, [componentShouldUpdate, equipment]);
  return (<Modal
    title=' Đính kèm vật tư'
    open={showAttachSupplyModal}
    onCancel={() => {
      hideAttachSupplyModal();
      form.resetFields();
    }}
    footer={null}
  >
    <Form form={form} layout='vertical' onFinish={attachSupply}>

      <Form.Item
        label={'Vật tư'}
        name='supplyId' required={true}
        rules={[{ required: true, message: 'Vui lòng chọn vật tư' }]}
      >
        <Select
          showSearch
          placeholder=' Chọn vật tư'
          allowClear={true}
          options={options(supplies)}
          filterOption={(input, option) => (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())}
        />
      </Form.Item>
      <Form.Item
        label={'Số lượng'}
        name='amount' required={true}
        rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
      >
        <Input name='amount' className='input' placeholder='Số lượng' />
      </Form.Item>

      <Form.Item
        label={'Ghi chú'}
        name='note'
      >
        <TextArea name='amountUsed' rows={2} className='input' placeholder='Ghi chú' />
      </Form.Item>
      <Form.Item hidden={true} name='equipmentId'>
        <Input type='hidden' value={equipment?.id} name='equipmentId' />
      </Form.Item>

      <div className='flex flex-row justify-end gap-4'>
        <Form.Item>
          <Button htmlType='submit' className='button'>Xác nhận</Button>
        </Form.Item>
        <Form.Item>
          <Button onClick={() => hideAttachSupplyModal()} className='button'>Đóng</Button>
        </Form.Item>
      </div>
    </Form>
  </Modal>);
};
export default ModalAttachSupply;
