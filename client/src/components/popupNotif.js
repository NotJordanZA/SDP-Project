import React, { useState, useEffect } from 'react';
import '../styles/Notifications.css'; 
// import { getCurrentUser } from "../utils/getCurrentUser"; 
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { NotifItem } from './NotifsItem';
import { getNotifications } from '../utils/getNotificationsUtil'; // Import the getNotifications function
import '../styles/Notifications.css'

const Notifications = ({ isOpen, toggleNotification }) => {
  const [notifications, setNotifications] = useState([]); 
  const [user, setUser] = useState(null); // currently authenticated user
  // const [userInfo, setUserInfo] = useState({}); // State to store the user's info (fetched from Firestore)
  // const [isLoading, setIsLoading] = useState(true);

  // Ensure the user is logged in and listen for Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser); // Store the Firebase authenticated user
        // setIsLoading(false); // Declare that Firebase has finished loading
      } else {
        setUser(null); // If the user isn't logged in, set user to null
        // setIsLoading(false);
      }
    });
    return () => unsubscribe();
    // eslint-disable-next-line
  }, [auth]);

  // Fetch user information from Firestore when the user is logged in
  // useEffect(() => {
  //   const fetchUserInfo = async () => {
  //     if (user && user.email) {
  //       try {
  //         await getCurrentUser(user.email, setUserInfo); // Fetch user info using email and set it in state
  //       } catch (error) {
  //         console.error('Failed to fetch user info:', error);
  //       }
  //     }
  //   };
  //   if (!isLoading && user && user.email) { 
  //     fetchUserInfo(); 
  //   }
  // }, [user, isLoading]);

  // Fetch notifications based on the user's email and filter those where read=false
  useEffect(() => {
    if (user && user.email) { 
      // Call the getNotifications  function
      getNotifications(user.email, (notificationsData) => {
        // Filter notifications where read == false
        const unreadNotifications = notificationsData.filter(notification => !notification.read);
        setNotifications(unreadNotifications); // Store only unread notifications in state
        console.log("Fetched unread notifications:", unreadNotifications);
      });
    }
    // eslint-disable-next-line
  }, [user && user.email]);

  return (
    <nav className={`popupNotif-panel ${isOpen ? 'open' : ''}`}>
      <section className='popupNotif-topSection'>
        <button className="popupNotif-close-btn" onClick={toggleNotification}>X</button>
      </section>
      <section className='popupNotif-list'>
        <h2 className='popupNotif-heading'>Your Notifications</h2>
        <ul>
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <NotifItem
                notification={notification}
                setNotifications={setNotifications}
              />
            ))
          ) : (
            <li>No notifications available</li>
          )}
        </ul>

      </section>
    </nav>
  );
};

export default Notifications;
