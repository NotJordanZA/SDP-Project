export const handleApproveClick = async (requestId) => {
    try {
      await updateReq(requestId, { requestStatus: "approved" });
  
      //refresh the list of requests after the update
      const requestsFromAPI = await getAllRequests();
      setRequests(requestsFromAPI.AdReq);
    } catch (error) {
      console.error("Error updating request:", error);
    }
  };