import { DeleteFilled } from '@ant-design/icons';
import { Divider, Popconfirm, Table, Tooltip } from 'antd';
import notificationApi from 'api/notification.api';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PaginationProps } from 'antd/lib/pagination/Pagination';
import { Pageable } from '../../types/commonResponse.type';
import { Notification } from '../../types/notification.type';
import { PageableRequest } from '../../types/commonRequest.type';
import { createUrlWithQueryString } from '../../utils/globalFunc.util';
import { toast } from 'react-toastify';
import { TableFooter } from 'components/TableFooter';

const NotificationList = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification<any>[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pageable, setPageable] = useState<Pageable>({ number: 0, size: 20 });
  const [queryString, setQueryString] = useState<string>(location.search);
  const [componentShouldUpdate, setComponentShouldUpdate] = useState<boolean>(false);
  const [pageableRequest, setPageableRequest] = useState<PageableRequest>({ size: 20, page: 0 });

  const handleDelete = (id: number) => {
    notificationApi.deleteNotificationById(id).then((res) => {
      toast.success('Xóa thông báo thành công');
      setComponentShouldUpdate(true);
    });
  };

  const columns: any = [
    {
      title: 'Thời gian', key: 'createdAt', render: (item: Notification<any>) => (<div>
        {moment(item?.createdAt).format('hh:mm:ss a DD-MM-YYYY')}
      </div>),
    }, {
      title: 'Nội dung', key: 'content', render: (item: Notification<any>) => (<div>
        {item.content}
      </div>),
    }, {
      title: 'Tác vụ', key: 'action', render: (item: Notification<any>) => (<div className='flex flex-row gap-2'>
        {/*<Tooltip title='Đánh dấu là đã đọc'>
          <ToolFilled />
        </Tooltip>
        TODO: mark as read */}
        <Tooltip title='Xóa thông báo'>
          <Popconfirm
            title='Bạn muốn xóa thông báo này?'
            onConfirm={() => handleDelete(item.id)}
            okText='Xóa'
            cancelText='Hủy'
          >
            <DeleteFilled />
          </Popconfirm>
        </Tooltip>
      </div>),
    },
  ];


  const pagination: PaginationProps = {
    current: pageable.number as number + 1,
    total: pageable.totalElements,
    pageSize: pageable.size,
    showTotal: (total: number) => `Tổng cộng: ${total} thông báo`,
    onChange: (page, pageSize) => {
      onChangeQueryParams('pageable', { page: page - 1, size: pageSize });

    },
    showQuickJumper: true,
  };
  const onChangeQueryParams = (key: string, value: string | string[] | undefined | number | PageableRequest | number[]) => {
    let pagebaleClone: PageableRequest;
    pagebaleClone = { ...pageableRequest, page: 0 };
    if (key === '') { //if key is empty, it means that the component should be updated
      setComponentShouldUpdate(true);
    }
    if (key === 'pageable') {
      pagebaleClone = { ...pageableRequest, page: (value as PageableRequest).page, size: (value as PageableRequest).size };
    }
    setPageableRequest(pagebaleClone);
    const url = createUrlWithQueryString(location.pathname, pagebaleClone);
    setQueryString(url);
    navigate(url);
  };
  useEffect(() => {
    setLoading(true);
    setComponentShouldUpdate(false);
    notificationApi.getNotifications({ ...pageableRequest, sort: ['id,desc'] }).then((res) => {
      setNotifications(res.data.data.content);
      setPageable(res.data.data.page);
    });
    setLoading(false);
  }, [queryString, componentShouldUpdate, pageableRequest]);

  return (<div>
    <div className='title text-center'>THÔNG BÁO</div>
    <Divider />
    <Table
      columns={columns}
      dataSource={notifications}
      className='mt-6 shadow-md'
      footer={() => (<>
        <TableFooter paginationProps={pagination} />
      </>)}
      pagination={false}
      loading={loading}
    />
  </div>);
};

export default NotificationList;