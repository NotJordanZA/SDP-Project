export const handleNotificationRead = async (notification, setNotifications) => {
    try {
      const response = await fetch(`/api/notifications/${notification.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dateCreated: notification.dateCreated,
          notificationMessage: notification.notificationMessage,
          notificationType: notification.notificationType,
          read: true, // Update the 'read' field to true when the checkbox is checked
          recipientEmail: notification.recipientEmail,
        }),
      });
  
      if (!response.ok) {
        console.error('Error updating notification:', await response.json());
      } else {
        console.log(`Notification ${notification.id} marked as read.`);
        // Remove the notification from the state after marking as read
        setNotifications((prevNotifications) => 
          prevNotifications.filter((notif) => notif.id !== notification.id)
        );
      }
    } catch (error) {
      console.error('Error updating notification:', error);
    }
  };
  