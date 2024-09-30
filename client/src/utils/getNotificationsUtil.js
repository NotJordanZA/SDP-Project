export const getNotifications = async (currentUserEmail, setNotifications) =>{
    try{
      const response = await fetch(`/api/notifications/${currentUserEmail}`, { // API call which GETs notifications
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.REACT_APP_API_KEY,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setNotifications(data); 
      } else {
        console.error('Error fetching notifications:', data.error); 
      }
    } catch (error) {
      console.error('Error:', error);
    }
}