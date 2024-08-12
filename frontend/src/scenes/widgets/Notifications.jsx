import React, { useState, useEffect } from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { Notifications as NotificationIcon } from '@mui/icons-material';
import { useSelector } from 'react-redux';

export default function Notifications({userId}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const token = useSelector((state) => state.token);
  const state = useSelector((state) => state);

  useEffect(() => {
    getNotifications();
  }, []);

  const handleClick = async (event) => {
    setAnchorEl(event.currentTarget);
    await getNotifications();

  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const clearNotifications = async () => {
    try {

      const response = await fetch(`${process.env.REACT_APP_URL_BACKEND}/notifications/clearNotifications`, {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
        }
        )
      });

      if (!response.ok) {
        console.log("Failed to clear notifications.");
        return; // Exit the function if the request failed
      }
      await getNotifications();
      console.log("Successfully cleared notifications");
    } catch (error) {
      console.error("Error fetching notifications.", error);
    }
  };

  const deleteNotificationFromDatabase = async(indexToRemove) => {
    try {
      console.log("\n\nAttempting to remove notification at index", indexToRemove);

      const response = await fetch(`${process.env.REACT_APP_URL_BACKEND}/notifications/deleteNotification`, {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          notificationIndexToRemove: indexToRemove
        }
        )
      });

      if (!response.ok) {
        console.log("Failed to remove notification.");
        return; // Exit the function if the request failed
      }
      await getNotifications();
      console.log("Successfully deleted notification");
    } catch (error) {
      console.error("Error fetching notifications.", error);
    }
  };

  const getNotifications = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_URL_BACKEND}/notifications/${state.user._id}/getUserNotifications`, {
        method: "GET",
        headers: { 
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("1");
      if (!response.ok) {
        console.log("Failed to get notifications.");
        return; // Exit the function if the request failed
      }

      const data = await response.json();
      const notificationsObjects = data.notifications;
      let notificationTexts = [];
    
      console.log("\nNotificationsObjects fetched successfully:");
    
      // Populate notificationTexts with the notification texts
      notificationsObjects.forEach((notification) => notificationTexts.push(notification.text));
    
      // Update the state with the new notification texts
      setNotifications(notificationTexts);
    
      // Log the notification texts
      console.log("Fetched Notifications:", notifications);
    } catch (error) {
      console.error("Error fetching notifications.", error);
    }
      
  };

  const buttonStyle = notifications.length > 0 ? 
  {
    position: 'relative',
    padding: '10px',
    color: 'red'
  } : 
  {
    padding: '10px',
  };

  const badgeStyle = {
    position: 'absolute',
    top: '-5px',
    right: '-5px',
    backgroundColor: 'red',
    color: 'white',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '12px',
  };

  return (
    <div>
      <IconButton onClick={handleClick} style={buttonStyle}>
        <NotificationIcon />
        {notifications.length > 0 && (
          <div style={badgeStyle}>
            {notifications.length}
          </div>
        )}
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <div style={{
          display: 'flex',

        }}>
          <b style={{
            width: '100%',
            display:'block',
            textAlign: 'center',
            marginRight: '10px',
          }}>
            Notification Center
          </b>
          <button onClick={clearNotifications}>Clear</button>
        </div>
        {notifications.length > 0 ? (
          notifications.map((notification, notificationIndex) => (
            <MenuItem key={notificationIndex} onClick={async () => {
              await deleteNotificationFromDatabase(notificationIndex);
            }}>
              {notification}
            </MenuItem>
          ))
        ) : (
          <MenuItem onClick={handleClose}>No new notifications</MenuItem>
        )}
      </Menu>
    </div>
  );
}
