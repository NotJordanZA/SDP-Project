

export const addNewUser = async (userEmail, firstName, lastName) =>{
    let isStudent = true;
    let isLecturer = false;
    let isAdmin = false;
    try{
      const response = await fetch(`/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
        console.log('User added successfully:', data);
      } else {
        console.error('Error updating user:', data.error);
      }
    } catch (error) {
      console.log('Error:', error);
    }
  }