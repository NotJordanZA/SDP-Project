export const CreateAdminRequest = async (userEmail, requestText) =>{
    try{
      let requestStatus = "pending"; // Requests are always pending at first
      console.log(userEmail, requestText, requestStatus);
      const response = await fetch("/adminRequests/create", { // Call to the API to try add a new admin request
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail,
          requestText,
          requestStatus
        }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Admin request added successfully:', data); // Successful call
      } else {
        console.error('Error creating request:', data.error); // Logs error
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }