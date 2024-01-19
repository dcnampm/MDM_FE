import { Button, Result } from 'antd';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <Result
      status="404"
      title="404"
      subTitle="Xin lỗi, trang bạn đang vào không tồn tại hoặc bạn không có quyền truy cập."
      extra={<Button type="default"><Link to="/">Quay lại Trang chủ</Link></Button>}
    />
  );
};

export default NotFoundPage;
