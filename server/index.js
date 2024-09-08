const { getDoc, setDoc, updateDoc, doc, deleteDoc, collection, getDocs } = require('firebase/firestore');
const { initializeApp } = require('firebase/app');
const { getFirestore } = require("firebase/firestore");
const express = require("express");
const cors = require('cors');
const PORT = process.env.PORT || 3002;

const app = express();
app.use(express.json());
app.use(cors()); // Allow all origins
const firebaseConfig = {
    apiKey: "AIzaSyCbdIZYHInEVMi7cFjt75mBQitj9KCZb9U",
    authDomain: "wits-infrastructure-management.firebaseapp.com",
    projectId: "wits-infrastructure-management",
    storageBucket: "wits-infrastructure-management.appspot.com",
    messagingSenderId: "345175411625",
    appId: "1:345175411625:web:94d3e7f252f9ffc4ca12b8",
    measurementId: "G-56XZRZ4RYP"
};


initializeApp(firebaseConfig);
const db = getFirestore();


// Need to figure out for building and hosting APIs and app on same domain
// app.use(express.static(path.resolve(__dirname, '../build')));

// Get user API
app.get("/users/:userEmail", async (req, res) => {
    let userEmail = req.params.userEmail;
    
    // Fetches the reference to the user from the users collection
    const userDocRef = doc(db, "Users", userEmail);
    // For fetching all user info
    try {
        // Fetches data from database entry
        const userDocData = await getDoc(userDocRef);
        
        if (userDocData.exists()) {
            // Send the user data back as JSON
            res.json(userDocData.data());
            res.status(200).json({ message: "User fetched successfully" });
        } else {
            // Handle the case where the document does not exist
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        // Handle any internal errors
        console.error("Error fetching user document:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Add user API
app.post("/users", async (req, res) => {
    // Fetch all data passed into the API through the request body
    const {userEmail, firstName, lastName, isStudent, isLecturer, isAdmin} = req.body;

    // Checks that all fields are populated
    if (!userEmail || !firstName || !lastName || isStudent === undefined || isLecturer === undefined || isAdmin === undefined) {
        return res.status(400).json({ error: "Bad Request: All fields are required." });
    }

    // Fetches the reference to the user from the users collection
    const userDocRef = doc(db, "Users", userEmail);

    try {
        // Fetches data from database entry
        const userDocData = await getDoc(userDocRef);
            
        if (userDocData.exists()) {
            res.status(403).json({ error: "User already exists" });
        }else{
            // Creates a JSON object to pass into firebase
            const userData = {
                firstName: firstName,
                lastName: lastName,
                isStudent: isStudent,
                isLecturer: isLecturer,
                isAdmin: isAdmin
                };
            // Adds JSON object to firebase
            await setDoc(userDocRef, userData);
            res.status(200).json({ message: "User created successfully" });
        }
    } catch (error) {
        // Handle any internal errors
        console.error("Error fetching user document:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Update user API
app.put("/users/:userEmail", async (req, res) => {
    // Fetch email from the URL parameter
    let userEmail = req.params.userEmail;
    // Fetch all data passed into the API through the request body
    const {firstName, lastName, isStudent, isLecturer, isAdmin} = req.body;

    // Checks that at least one field is populated
    if (!firstName && !lastName && isStudent === undefined && isLecturer === undefined && isAdmin === undefined) {
        return res.status(400).json({ error: "Bad Request: A field to update is required." });
    }

    // Adds all populated fields to a JSON object
    const updates = {};

    if (firstName) updates.firstName = firstName;
    if (lastName) updates.lastName = lastName;
    if (isStudent !== undefined) updates.isStudent = isStudent;
    if (isLecturer !== undefined) updates.isLecturer = isLecturer;
    if (isAdmin !== undefined) updates.isAdmin = isAdmin;

    // Fetches the reference to the user from the users collection
    const userDocRef = doc(db, "Users", userEmail);

    try {
        // Fetches data from database entry
        const userDocData = await getDoc(userDocRef);
        if (!userDocData.exists()) {
            res.status(404).json({ error: "User not found" });
        }else{
            // Updates firebase entry with the updates JSON object
            await updateDoc(userDocRef, updates);
            res.status(200).json({ message: "User updated successfully" });
        }
        
    } catch (error) {
        // Handle any internal errors
        console.error("Error fetching user document:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Delete user API
app.delete("/users/:userEmail", async (req, res) => {
    // Fetch email from the URL parameter
    let userEmail = req.params.userEmail;

    // Fetches the reference to the user from the users collection
    const userDocRef = doc(db, "Users", userEmail);

    try {
        // Fetches data from database entry
        const userDocData = await getDoc(userDocRef);
        if (!userDocData.exists()) {
            res.status(404).json({ error: "User not found" });
        }else{
            // Delete user from the database
            await deleteDoc(userDocRef);
            res.status(200).json({ message: "User deleted successfully" });
        }
    } catch (error) {
        // Handle any internal errors
        console.error("Error fetching user document:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//Prints to console the port of the server
app.listen(PORT, () => {
console.log(`Server listening on ${PORT}`);
});






// POST - create Booking 
app.post("/bookings/create", async (req, res) => {
    const { venueBooker, venueID, bookingDate, bookingStartTime, bookingEndTime, bookingDescription } = req.body;

    // make sure all the fields are entered 
    if (!venueBooker || !venueID || !bookingDate || !bookingStartTime || !bookingEndTime || !bookingDescription) {
        return res.status(400).json({ error: "All fields are required." });
    }

    try {
        // adding a document to the Bookings collection
        const newBookingRef = doc(db, 'Bookings', `${venueID}-${bookingDate}-${bookingStartTime}`);//the document name/id is the venueID with the date and start time of the bookings
        const bookingData = {
            venueBooker,
            venueID,
            bookingDate,
            bookingStartTime,
            bookingEndTime,
            bookingDescription,
           
        };

        // Save the booking data 
        await setDoc(newBookingRef, bookingData);

        // Returns the  ID of the newly created booking
        res.status(200).json({ message: "Booking created successfully", bookingID: newBookingRef.id });
    } catch (error) {
        console.error("Error creating booking:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
//GET  all bookings
app.get("/bookings", async (req, res) => {
    try {
        // Reference to the "Bookings" collection
        const bookingsCollectionRef = collection(db, 'Bookings');
        
        // Get all documents from the collection
        const snapshot = await getDocs(bookingsCollectionRef);
        
        // Map over each document in the collection and return its data
        const bookings = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Respond with all bookings
        res.status(200).json({ bookings });
    } catch (error) {
        console.error("Error retrieving bookings:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});




//Get booking by  ID
app.get("/bookings/:id", async (req, res) => {
    const bookingId = req.params.id;

    try {
        // Reference to the specific booking document by ID
        const bookingDocRef = doc(db, 'Bookings', bookingId);
        const bookingDoc = await getDoc(bookingDocRef);
        
        if (bookingDoc.exists()) {
            res.status(200).json({ id: bookingDoc.id, ...bookingDoc.data() });
        } else {
            // error
            res.status(404).json({ error: "Booking not found" });
        }
    } catch (error) {
        console.error("Error retrieving booking:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// PUT -update a booking by ID

app.put("/bookings/:id", async (req, res) => {
    const bookingId = req.params.id;
    const { venueBooker, venueID, bookingDate, bookingStartTime, bookingEndTime, bookingDescription } = req.body;

    // Validate the required fields
    if (!venueBooker && !venueID && !bookingDate && !bookingStartTime && !bookingEndTime && !bookingDescription) {
        return res.status(400).json({ error: "At least one field is required to update." });
    }

    try {
    
        const bookingDocRef = doc(db, 'Bookings', bookingId);
        const bookingDoc = await getDoc(bookingDocRef);

        if (!bookingDoc.exists()) {
            return res.status(404).json({ error: "Booking not found" });
        }

        const updates = {};
        if (venueBooker) updates.venueBooker = venueBooker;
        if (venueID) updates.venueID = venueID;
        if (bookingDate) updates.bookingDate = bookingDate;
        if (bookingStartTime) updates.bookingStartTime = bookingStartTime;
        if (bookingEndTime) updates.bookingEndTime = bookingEndTime;
        if (bookingDescription) updates.bookingDescription = bookingDescription;

        // Update the document in Firestore
        await updateDoc(bookingDocRef, updates);
        res.status(200).json({ message: "Booking updated successfully", bookingID: bookingId });
    } catch (error) {
        console.error("Error updating booking:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
//Delete a booking by ID
app.delete("/bookings/:id", async (req, res) => {
    const bookingId = req.params.id;

    try {
        const bookingDocRef = doc(db, 'Bookings', bookingId);
        const bookingDoc = await getDoc(bookingDocRef);

        if (!bookingDoc.exists()) {
            return res.status(404).json({ error: "Booking not found" });
        }

        // Delete the document from Firestore
        await deleteDoc(bookingDocRef);
        res.status(200).json({ message: "Booking deleted successfully", bookingID: bookingId });
    } catch (error) {
        console.error("Error deleting booking:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



// //GET- returns venue name from the Venues collection where the document name =venueID in the Bookings collection
// //important for filtering bookings by venue
app.get('/bookings/venue/:venueid', async (req, res) => {
    try {
        const venueid = req.params.venueid;
        
        // Get the venue document 
        const venueDocRef = doc(db, 'Venues', venueid);
        const venueDoc = await getDoc(venueDocRef);

        if (!venueDoc.exists()) {
            return res.status(404).json({ error: 'Venue not found' });
        }

        const venueData = venueDoc.data();
        const venueName = venueData.venueName;

        res.status(200).json({ venueName });
    } catch (error) {
        console.error('Error fetching venue name:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});











// // Venues section
// // Create a new venue
app.post('/venues', async (req, res) => {
    const { buildingName, campus, isClosed, venueCapacity, venueName, venueType } = req.body;

    // Validate the required fields
    if (!buildingName || !campus || isClosed === undefined || !venueCapacity || !venueName || !venueType) {
        return res.status(400).json({ error: "All fields are required." });
    }

    try {
        // Create a reference for a new venue document
        const newVenueRef = doc(collection(db, 'Venues'));

        // Prepare the venue data, including the document ID as the id field
        const venueData = {
            id: newVenueRef.id,  // Add the id field with the document name
            buildingName,
            campus,
            isClosed,
            venueCapacity,
            venueName,
            venueType,
        };

        // Save the venue to Firestore
        await setDoc(newVenueRef, venueData);

        // Respond with the ID of the newly created venue
        res.status(201).json({ message: "Venue created successfully", venueID: newVenueRef.id });
    } catch (error) {
        console.error("Error creating venue:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// // Get all venues
app.get('/venues', async (req, res) => {
    try {
        const venuesSnapshot = await getDocs(collection(db, 'Venues'));
        const venuesList = [];

        venuesSnapshot.forEach(doc => {
            venuesList.push({
                id: doc.id,
                ...doc.data()
            });
        });

        res.status(200).json(venuesList);
    } catch (error) {
        console.error("Error getting venues:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// // Get a single venue by ID
app.get('/venues/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const venueDoc = await getDoc(doc(db, 'Venues', id));
        if (venueDoc.exists()) {
            res.status(200).json({ id: venueDoc.id, ...venueDoc.data() });
        } else {
            res.status(404).json({ error: "Venue not found" });
        }
    } catch (error) {
        console.error("Error getting venue:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Update a venue by ID
app.put('/venues/:id', async (req, res) => {
    const id = req.params.id;
    const { buildingName, campus, isClosed, venueCapacity, venueName, venueType } = req.body;

    // Validate the required fields
    if (!buildingName && !campus && isClosed === undefined && !venueCapacity && !venueName && !venueType) {
        return res.status(400).json({ error: "At least one field is required to update." });
    }

    try {
        const venueDocRef = doc(db, 'Venues', id);
        const venueDoc = await getDoc(venueDocRef);

        if (!venueDoc.exists()) {
            return res.status(404).json({ error: "Venue not found" });
        }

        const updates = {};
        if (buildingName) updates.buildingName = buildingName;
        if (campus) updates.campus = campus;
        if (isClosed !== undefined) updates.isClosed = isClosed;
        if (venueCapacity) updates.venueCapacity = venueCapacity;
        if (venueName) updates.venueName = venueName;
        if (venueType) updates.venueType = venueType;

        await updateDoc(venueDocRef, updates);

        res.status(200).json({ message: "Venue updated successfully" });
    } catch (error) {
        console.error("Error updating venue:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Delete a venue by ID
app.delete('/venues/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const venueDocRef = doc(db, 'Venues', id);
        const venueDoc = await getDoc(venueDocRef);

        if (!venueDoc.exists()) {
            return res.status(404).json({ error: "Venue not found" });
        }

        await deleteDoc(venueDocRef);

        res.status(200).json({ message: "Venue deleted successfully" });
    } catch (error) {
        console.error("Error deleting venue:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



// POST-create Admin Request 
app.post("/adminRequests/create", async (req, res) => {
    const { requesterEmail, requestText, requestStatus } = req.body;

    // Validate required fields
    if (!requesterEmail || !requestText || !requestStatus) {
        return res.status(400).json({ error: "All fields are required." });
    }

    try {
     
        // const newBookingRef = doc(db, 'AdminRequests', `${requesterEmail}-randomDocName`);
        // Generate a random string for the document name
        const randomDocName = Math.random().toString(36).substr(2, 9);

        const newBookingRef = doc(db, 'AdminRequests', randomDocName);
        const bookingData = {
            requesterEmail,
            requestText,
            requestStatus
        };

        await setDoc(newBookingRef, bookingData);

        // Respond with the ID of the newly created booking
        res.status(200).json({ message: "Booking created successfully", bookingID: newBookingRef.id });
    } catch (error) {
        console.error("Error creating booking:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


//PUT
app.put("/adminRequests/:id", async (req, res) => {
    const adminRequestId = req.params.id;
    const { requesterEmail, requestText, requestStatus } = req.body;

    // Validate the required fields
    if (!requesterEmail && !requestText && !requestStatus) {
        return res.status(400).json({ error: "At least one field is required to update." });
    }

    try {
        // Reference to the document in Firestore
        const adminRequestDocRef = doc(db, 'AdminRequests', adminRequestId);
        const adminRequestDoc = await getDoc(adminRequestDocRef);

        if (!adminRequestDoc.exists()) {
            return res.status(404).json({ error: "Admin request not found" });
        }

        const updates = {};
        if (requesterEmail) updates.requesterEmail = requesterEmail;
        if (requestText) updates.requestText = requestText;
        if (requestStatus) updates.requestStatus = requestStatus;

        // Update the document in Firestore
        await updateDoc(adminRequestDocRef, updates);
        res.status(200).json({ message: "Admin request updated successfully", adminRequestID: adminRequestId });
    } catch (error) {
        console.error("Error updating admin request:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});




//Get Requests
app.get("/adminRequests", async (req, res) => {
    try {
        
        const ReqCollectionRef = collection(db, 'AdminRequests');
        
        const snapshot = await getDocs(ReqCollectionRef);
        
        const AdReq = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

       
        res.status(200).json({ AdReq  });
    } catch (error) {
        console.error("Error retrieving bookings:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


//Reports
app.post("/Reports/create", async (req, res) => {
    const { reportText, reportType, resolutionLog, venueID } = req.body;

    // Validate required fields
    if ( !reportText|| !reportType|| !resolutionLog||!venueID ) {
        return res.status(400).json({ error: "All fields are required." });
    }

    try {
     
        // const newBookingRef = doc(db, 'AdminRequests', `${requesterEmail}-randomDocName`);
        // Generate a random string for the document name
        const randomDocName = Math.random().toString(36).substr(2, 9);

        const newBookingRef = doc(db, 'Reports', randomDocName);
        const bookingData = {
            reportStatus: "pending" ,reportText, reportType, resolutionLog, venueID 
        };

        await setDoc(newBookingRef, bookingData);

        res.status(200).json({ message: "Report created successfully", bookingID: newBookingRef.id });
    } catch (error) {
        console.error("Error creating report:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



app.put("/Reports/:id", async (req, res) => {
    const rID = req.params.id;
    const { reportText, reportType, resolutionLog, venueID, reportStatus }= req.body;

    // Validate the required fields
    if (!reportText && !reportType && !resolutionLog && !venueID && !reportStatus) {
        return res.status(400).json({ error: "At least one field is required to update." });
    }

    try {
        // Reference to the document in Firestore
        const adminRequestDocRef = doc(db, 'Reports', rID);
        const adminRequestDoc = await getDoc(adminRequestDocRef);

        if (!adminRequestDoc.exists()) {
            return res.status(404).json({ error: "Admin request not found" });
        }

        const updates = {};
        if (reportText) updates.reportText = reportText;
        if (reportType) updates.reportType = reportType;
        if (resolutionLog) updates.resolutionLog = resolutionLog;
        if ( venueID) updates.venueID=  venueID;
        if (  reportStatus) updates.reportStatus=  reportStatus;
       
       

        // Update the document in Firestore
        await updateDoc(adminRequestDocRef, updates);
        res.status(200).json({ message: "Admin request updated successfully", adminRequestID: rID });
    } catch (error) {
        console.error("Error updating admin request:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


//Get
app.get("/Reports", async (req, res) => {
    try {
        
        const RepCollectionRef = collection(db, 'Reports');
        
        const snapshot = await getDocs(RepCollectionRef);
        
        const rep = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

       
        res.status(200).json({ rep });
    } catch (error) {
        console.error("Error retrieving bookings:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
// Get reports by report type
app.get("/Reports/type/:reportType", async (req, res) => {
    const { reportType } = req.params; // Extract reportType from the request parameters

    try {
        // Reference to the "Reports" collection
        const reportsCollectionRef = collection(db, 'Reports');
        
        // Get all documents from the "Reports" collection
        const snapshot = await getDocs(reportsCollectionRef);
        
        // Filter documents that match the selected report type
        const filteredReports = snapshot.docs
          .map(doc => ({
              id: doc.id,
              ...doc.data()
          }))
          .filter(report => report.reportType === reportType); // Filter by report type
        
        // If no reports found, respond with a message
        if (filteredReports.length === 0) {
            return res.status(404).json({ message: `No reports found for type: ${reportType}` });
        }

        // Respond with the filtered reports
        res.status(200).json({ filteredReports });
    } catch (error) {
        console.error("Error retrieving reports by type:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
