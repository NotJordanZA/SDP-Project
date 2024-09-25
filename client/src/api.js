


  //Requests
  export const getAllRequests = async () => {
    const response = await fetch(`/api/adminRequests`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.REACT_APP_API_KEY,
      },
    });
    return await response.json();
  };

  // update a Request- change status from pending to approved
export const updateReq= async (id, ReqData) => {
  const response = await fetch(`/api/adminRequests/${id}`, {
    method: "PUT",
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.REACT_APP_API_KEY,
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
  const response = await fetch(`/api/adminRequests/${id}`, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.REACT_APP_API_KEY,
    },
  });
  return await response.json();
};

//reports
export const getAllReports = async () => {
  const response = await fetch(`/api/reports`, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.REACT_APP_API_KEY,
    },
  });
  return await response.json();
};
export const updateRep= async (id, RepData) => {
  const response = await fetch(`/api/reports/${id}`, {
    method: "PUT",
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.REACT_APP_API_KEY,
    },
    body: JSON.stringify(RepData),
  });


 if (!response.ok) {
    throw new Error('Failed to update report');
  }
  return response.json();

};
export const getRepById = async (id) => {
  const response = await fetch(`/api/reports/${id}`, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.REACT_APP_API_KEY,
    },
  });
  return await response.json();
};
export const getReportByType = async (reportType) => {
  const response = await fetch(`/api/reports/type/${reportType}`, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.REACT_APP_API_KEY,
    },
  });
  return await response.json();
};

