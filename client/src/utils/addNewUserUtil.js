export const addNewUser = async (userEmail, firstName, lastName) =>{
    let isStudent = true;// New users are Students by default
    let isLecturer = false;
    let isAdmin = false;
    try{
      const response = await fetch(`/users`, { // Call to the API to try add a new user
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.REACT_APP_API_KEY,
        },
        body: JSON.stringify({
          userEmail,
          firstName,
          lastName,
          isStudent,
          isLecturer,
          isAdmin,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('User added successfully:', data); // Successful call
      } else {
        console.error('Error adding user:', data.error); // Logs error
      }
    } catch (error) {
      console.log('Error:', error);
    }
  }