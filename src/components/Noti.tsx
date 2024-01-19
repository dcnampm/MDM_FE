import { Input, List } from 'antd';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { useEffect, useState } from 'react';



const Noti = () => {

  const connect = () => {
    let stompClient : any = null;
  
    var socket = new SockJS('/ws');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function() {
        console.log();
        stompClient.subscribe('/all/messages', function(result : any) {
            show(JSON.parse(result.body));
        });
    });
  }
  
  const show = (message : any) => {
      var response = document.getElementById('messages');
      var p = document.createElement('p');
      p.appendChild(document.createTextNode("message: "  + message.content))
      // p.innerHTML= "message: "  + message.content;
      response?.appendChild(p);
  }
  let allNotifications: any;

  const [notification, setNotification] = useState<any>([]);
  useEffect( () => {
    let stompClient : any = null;
  
    var socket = new SockJS('http://localhost:8002/ws');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function() {
        console.log();
        stompClient.subscribe('/all/messages', function(result : any) {
            console.log(result);
            const newNotification = JSON.parse(result.body);
            show(JSON.parse(result.body));
            let newNotificationList = [newNotification, ...allNotifications];
            setNotification(newNotificationList);
            allNotifications = newNotificationList;

        });
    });
    // return () => {
    //   stompClient.disconnect();
    // }
  }, []);

  return (
    <div>
      {/* <ul>
                    {notification.map((name : any,index : any)=>(
                        <li key={index}>{name}</li>
                    ))}
                </ul> */}
        <p>Hello</p>
        <div id="messages"></div>
    </div>
    
  )
}

export default Noti;