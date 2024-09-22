export const deleteVenue = async(id, getAllVenues) => {
      try {
        const response = await fetch(`/api/venues/${id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        if (response.ok){
            console.log("Delete successful", data);
            getAllVenues();
        }else{
            console.error('Error deleting venue:', data.error); // Logs error
        }
      } catch (error) {
        console.error('Error deleting venue:', error);
      }
}