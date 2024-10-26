   export const fetchRequests = async (setRequests, getAllRequests) => {
      try {
        const response = await getAllRequests();
        // console.log("Fetched Requests:", response.AdReq); 
        setRequests(response.AdReq); //the AdReq array from the response
      } catch (error) {
        console.error("Error fetching requests:", error);
        setRequests([]); //in case of an error
      }
    };
    