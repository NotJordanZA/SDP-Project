export const createSchedule = async (scheduleData) => {
    console.log(scheduleData);
    try {
      const response = await fetch(`/api/schedules/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scheduleData),
      });
      const data = response.data;
      if (response.ok) {
        return data;
      } else {
        console.error("Error adding schedule:", data.error);
      }
    } catch (error) {
      console.error("Error adding schedule:", error);
    }
  };