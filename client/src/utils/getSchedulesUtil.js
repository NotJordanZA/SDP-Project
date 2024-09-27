export const fetchSchedules = async (setSchedules, venueID) => {
    try {
        const response = await fetch(`/api/schedules/${venueID}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': process.env.REACT_APP_API_KEY,
            },
        });

        const data = await response.json();

        if(response.ok){
            setSchedules(data);
        }else{
            console.error("Error fetching schedules for this venue", data.error);
        }
    } catch (error) {
      console.error("Error fetching schedules:", error);
      return [];
    }
};