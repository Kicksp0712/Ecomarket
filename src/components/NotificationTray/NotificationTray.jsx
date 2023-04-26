import React from "react";
import { RiNotification2Fill } from "react-icons/ri";
import { TiDelete } from "react-icons/ti";
import { Badge, Dropdown, Tooltip } from "flowbite-react";
import { useEffect } from "react";
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useState } from "react";
function NotificationTray({ user }) {
  const [notifications, setNotifications] = useState([]);
  const [notificationsReaded, setNotificationsReaded] = useState([]);
  useEffect(() => {
    const docNotifications = async () => {
      const docRef = collection(db, "users", user?.uid, "notifications");
      const q = query(docRef, orderBy("datetime", "desc"));
      onSnapshot(q, (querySnapshot) => {
        const notifications = [];
        let i = 0;
        querySnapshot.forEach((document) => {
          
          notifications.push({ ...document.data(), notificationId:document.id });
        });
        setNotifications(notifications);
      });
    };
    if (user?.uid) {
      docNotifications();
    }
  }, [user]);

  const updatedNotificationReaded = async (index)=>{
    if(index === null || index === undefined){ console.error("Index undefined or null");return; }
    let notifcation = notifications[index];
    let docRef = doc(db,"users",user?.uid,"notifications",notifcation.notificationId);
    return updateDoc(docRef,{readed:true});
  }
  const deleteNotification = async (index) =>{
    if(index === null || index === undefined){ console.error("Index undefined or null");return; }
    let notifcation = notifications[index];
    let docRef = doc(db,"users",user?.uid,"notifications",notifcation.notificationId);
    return deleteDoc(docRef);
  }
  
  const getNotificationsReaded = () => {
    return notifications.filter((value) => value?.readed === false);
  };

  const onClickNotification = (e, index) => {
    const notItem = notifications[index];
    notItem.readed = true;
    updatedNotificationReaded(index);
    notifications[index] = notItem;
    setNotifications([...notifications]);
    
  };

  const onDeleteNotification = (index) => {
    let newNotifications = notifications
      .slice(0, index)
      .concat(notifications.slice(index + 1));
    deleteNotification(index);
    setNotifications(newNotifications);
  };

  useEffect(() => {
    setNotificationsReaded(getNotificationsReaded());
  },[notifications]);

  return (
    <>
      <div className=" relative ">
        {Boolean(notificationsReaded.length >=1) && (
          <Badge className="absolute top-4 left-3 " color="gray" size="xs">
            {notificationsReaded.length}
          </Badge>
        )}
        <Dropdown
          label={
            <Tooltip content="Notifcaciones" placement="bottom">
              <RiNotification2Fill className=" text-primary text-2xl " />
            </Tooltip>}
          inline={true}
        >
          <Dropdown.Header>Notificaciones</Dropdown.Header>
          {notifications?.map((item, i) => {
            return (
                <div key={item?.notificationId} id={item?.notificationId} className=" relative ">
                  <Dropdown.Item  className={`${item?.readed ? "": " bg-gray-50"} rounded-md m-2 `}>
                    <div
                      onClick={(e) => {
                        onClickNotification(e, i);
                      }}
                    >
                      <p className=" min-w-[300px] font-semibold my-1">
                        {item.notifcation?.title}
                      </p>
                      <span>{item.notifcation?.message}</span>
                    </div>
                  </Dropdown.Item>
                  <Tooltip
                    content="Eliminar Notificacion"
                    arrow={false}
                    placement="top"
                  >
                    <TiDelete
                      onClick={() => {
                        onDeleteNotification(i);
                      }}
                      className="absolute top-4 right-0 text-3xl m-2 text-primary hover:text-lime-800  cursor-pointer"
                    />
                  </Tooltip>
                </div>
              
            );
          })}
        </Dropdown>
      </div>
    </>
  );
}

export { NotificationTray };
