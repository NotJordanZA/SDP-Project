
export const fetchAllReports = async (setReports, getAllReports) => {
    try {
      const response = await getAllReports();
      // console.log('Fetched Reports:', response);  // Log all fetched reports
      setReports(response); // Directly set the reports from API
    } catch (error) {
      console.error("Error fetching all reports:", error);
      setReports([]); 
      
    }
  };