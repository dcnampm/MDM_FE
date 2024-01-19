import { Button, Form, Input, Modal } from 'antd';
import equipmentHandoverApi from 'api/equipment_handover.api';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { convertBase64 } from 'utils/globalFunc.util';

const ModalHandoverSuccess = (props: any) => {

  const {
    showHandoverSuccessModal,
    setShowHandoverSuccessModal,
    dataHandover
  } = props;
  const [form] = Form.useForm();
  const [files, setFile] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);

  const readUploadFile = async (e: any) => {
    let file = e.target.files[0];
    if (file) {
      let fileBase64 = await convertBase64(file);
      setFile(fileBase64)
    }
  }

  const sendEmailToManager = () => {
    let data = { files, ...dataHandover };
    setLoading(true);
    equipmentHandoverApi.sendEmailHandoverReport(data)
      .then((res: any) => {
        const { success } = res.data;
        if (success) {
          setShowHandoverSuccessModal();
          toast.success("Hoàn tất quy trình bàn giao")
        } else {
          toast.error("Quy trình bàn giao có gặp sự cố. Vui lòng kiểm tra lại")
        }
      })
      .catch()
      .finally(() => setLoading(false))
  }

  return (
    <Modal
      title="Bàn giao thiết bị thành công"
      open={showHandoverSuccessModal}
      onCancel={setShowHandoverSuccessModal}
      footer={null}
    >
      <Form form={form} layout="vertical" size="large" >
        <Form.Item
          className="fileUploadInput"
          name="excel"
          label="Đính kèm biên bản bàn giao (Không bắt buộc)"
        >
          <Input
            type="file"
            placeholder='Chọn file word'
            onChange={(e: any) => readUploadFile(e)}
          />
        </Form.Item>
        <div className='mb-6'>Gửi email xác nhận cho đại diện khoa phòng</div>
        <div className='flex flex-row justify-end gap-4'>
          <Form.Item>
            <Button
              onClick={() => sendEmailToManager()}
              loading={loading}
              className='button'
            >
              Xác nhận
            </Button>
          </Form.Item>
          <Form.Item>
            <Button onClick={setShowHandoverSuccessModal} className='button'>Đóng</Button>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  )
}

export default ModalHandoverSuccess