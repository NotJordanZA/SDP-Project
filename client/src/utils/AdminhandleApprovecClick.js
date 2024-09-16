import { getAllRequests, updateReq } from "../pages/ManageRequests";

export const handleApproveClick = async (requestId, setRequests) => {
    try {
      await updateReq(requestId, { requestStatus: "approved" });
  
      //refresh the list of requests after the update
      const requestsFromAPI = await getAllRequests();
      setRequests(requestsFromAPI.AdReq);
    } catch (error) {
      console.error("Error updating request:", error);
    }
  };