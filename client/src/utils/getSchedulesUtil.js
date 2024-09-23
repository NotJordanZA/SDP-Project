export const fetchSchedules = async (setSchedules, venueID) => {
    try {
        const response = await fetch(`/api/schedules/${venueID}`);

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