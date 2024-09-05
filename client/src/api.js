const API_URL = process.env.NODE_ENV === 'production' ? 'https://your-production-site.com' : 'http://localhost:3002'; 

//  get all bookings
export const getAllBookings = async () => {
  const response = await fetch(`${API_URL}/bookings`);
  return await response.json();
};

// get a booking by ID
export const getBookingById = async (id) => {
  const response = await fetch(`${API_URL}/bookings/${id}`);
  return await response.json();
};

//create a new booking
export const createBooking = async (bookingData) => {
  const response = await fetch(`${API_URL}/bookings/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bookingData),
  });
  return await response.json();
};

// update a booking
export const updateBooking = async (id, bookingData) => {
  const response = await fetch(`${API_URL}/bookings/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bookingData),
  });

 // return await response.json();
 if (!response.ok) {
    throw new Error('Failed to update booking');
  }
  return response.json();

};

//delete a booking
export const deleteBooking = async (id) => {
  const response = await fetch(`${API_URL}/bookings/${id}`, {
    method: "DELETE",
  });
  return await response.json();
};

//For filtering bookings by venue
export const getVenueNameByBookingVenueID = async (venueID) => {
    const response = await fetch(`${API_URL}/bookings/venue/${venueID}`);
    if (!response.ok) {
      throw new Error('Failed to fetch venue name');
    }
    return await response.json();
  };


  //Requests
  export const getAllRequests = async () => {
    const response = await fetch(`${API_URL}/adminRequests`);
    return await response.json();
  };

  // update a Request- change status from pending to approved
export const updateReq= async (id, ReqData) => {
  const response = await fetch(`${API_URL}/adminRequests/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ReqData),
  });

 // return await response.json();
 if (!response.ok) {
    throw new Error('Failed to update request');
  }
  return response.json();

};

export const getReqById = async (id) => {
  const response = await fetch(`${API_URL}/adminRequests/${id}`);
  return await response.json();
};

//Reports
export const getAllReports = async () => {
  const response = await fetch(`${API_URL}/Reports`);
  return await response.json();
};
export const updateRep= async (id, RepData) => {
  const response = await fetch(`${API_URL}/Reports/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(RepData),
  });


 if (!response.ok) {
    throw new Error('Failed to update report');
  }
  return response.json();

};
export const getRepById = async (id) => {
  const response = await fetch(`${API_URL}/Reports/${id}`);
  return await response.json();
};
export const getReportByType = async (reportType) => {
  const response = await fetch(`${API_URL}/Reports/type/${reportType}`);
  return await response.json();
};

//Venues
export const getAllVenues = async () => {
  try {
    const response = await fetch(`${API_URL}/venues`);
    const data = await response.json();
    return { venues: data }; // Ensure you're returning venues inside an object
  } catch (error) {
    console.error("Error fetching venues:", error);
    return { venues: [] }; // Return an empty array in case of failure
  }
};

