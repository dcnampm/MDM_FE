import notificationApi from 'api/notification.api';
import React, { createContext, useEffect, useState } from 'react';
import { ACCESS_TOKEN } from 'constants/auth.constant';
import { Notification } from '../types/notification.type';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

interface NotificationData {
  count: number,
  increaseCount: () => void,
  decreaseCount: () => void,
  resetCount: () => void,
  notification: Notification<any>[],
  getAllNotifications: () => void,
  connect: () => void,
}

interface NotificationProps {
  children: React.ReactNode;
}

export const NotificationContext = createContext<NotificationData>({
  count: 0, increaseCount: () => {}, decreaseCount: () => {}, resetCount: () => {}, notification: [], getAllNotifications: () => {}, connect: () => {}
});

let client : any = null;
let allNotifications: any= [];

const NotificationProvider: React.FC<NotificationProps> = ({ children }) => {

  const [count, setCount] = useState<number>(0);
  const [notification, setNotification] = useState<any>([]);
  const [stompClient, setStopmClient] = useState<any>(null);

  const access_token: any = localStorage.getItem(ACCESS_TOKEN);

  const increaseCount = () => {
    setCount(x => x + 1);
  };

  const decreaseCount = () => {
    setCount(x => x - 1);
  };

  const resetCount = () => {
    setCount(0);
  };

  const getAllNotifications = () => {
    notificationApi.getNotifications({ sort: ['id,desc'] }).then((res: any) => {
      setNotification(res.data.data.content);
    });
  };

  useEffect(() => {
    if (access_token) {
      connect();
      getAllNotifications();
      // getNoti();
    }
  }, []);
 //////////////
 const connect = () => {
  let socket = new SockJS('http://localhost:8002/ws');
  const stompClient = Stomp.over(socket);
  stompClient.connect({}, () => {
    stompClient.subscribe("/all/notifications", onPushNotification);
  }, onError);
  setStopmClient(stompClient);
}



const onPushNotification = async (payload : any) => {
  const newNotification : Notification<any> = JSON.parse(payload.body);
  // console.log(newNotification);
  getAllNotifications();
  // console.log(notification);
  let newNotificationList = [newNotification, ...notification];
  setNotification(newNotificationList);
  // notification = newNotificationList;
  console.log("count: ", count)
  increaseCount();
}

const onError = () => {
  return (error: any) => {
    console.log('Error on event source: ', error);
  };
}

// const getNoti = async () => {
//   let fetchedNotifications = await getAllNotifications();
//   setNotification(fetchedNotifications);
//   allNotifications = fetchedNotifications;
//   connect();
// }


//////////////
  const NotificationContextData = {
    count, increaseCount, decreaseCount, resetCount, notification, getAllNotifications,connect
  };

 



  return (<NotificationContext.Provider value={NotificationContextData}>
    {children}
  </NotificationContext.Provider>);
};

export default NotificationProvider;