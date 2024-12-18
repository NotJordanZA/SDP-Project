const { getDoc, setDoc, updateDoc, doc, deleteDoc, getDocs, collection, query, where } = require('firebase/firestore');
const { initializeApp } = require('firebase/app');
const { getFirestore,  addDoc } = require('firebase/firestore');
const express = require("express");
const cors = require('cors');
const multer = require('multer');
const {onRequest} = require("firebase-functions/v2/https");
const { getStorage, ref, uploadBytes, getDownloadURL } = require('firebase/storage'); 
const logger = require("firebase-functions/logger");
// const PORT = process.env.PORT || 3001; //Must be commented out for production build
const dotenv = require('dotenv').config({ path: './.env' });

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
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Get user API
app.get("/api/users/:userEmail", async (req, res) => {
    let userEmail = req.params.userEmail;
    let api_key = req.header("x-api-key"); // Fetches API key from request
    if(api_key === process.env.REACT_APP_API_KEY){ // Checks if API key is valid
        // Fetches the reference to the user from the users collection
        const userDocRef = doc(db, "Users", userEmail);
        // For fetching all user info
        try {
            // Fetches data from database entry
            const userDocData = await getDoc(userDocRef);
            
            if (userDocData.exists()) {
                // Send the user data back as JSON
                res.status(200).json(userDocData.data());
            } else {
                // Handle the case where the document does not exist
                res.status(404).json({ error: "User not found" });
            }
        } catch (error) {
            // Handle any internal errors
            console.error("Error fetching user document:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }else{
        res.status(401).json({ error: "Unauthorized. Please supply valid API key" });
    }
});

// Add user API
app.post("/api/users", async (req, res) => {
    // Fetch all data passed into the API through the request body
    let api_key = req.header("x-api-key"); // Fetches API key from request
    if(api_key === process.env.REACT_APP_API_KEY){ // Checks if API key is valid
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
    }else{
        res.status(401).json({ error: "Unauthorized. Please supply valid API key" });
    }
});

// Update user API
app.put("/api/users/:userEmail", async (req, res) => {
    // Fetch email from the URL parameter
    let userEmail = req.params.userEmail;
    let api_key = req.header("x-api-key"); // Fetches API key from request
    if(api_key === process.env.REACT_APP_API_KEY){ // Checks if API key is valid
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
    }else{
        res.status(401).json({ error: "Unauthorized. Please supply valid API key" });
    }
});

// Delete user API
app.delete("/api/users/:userEmail", async (req, res) => {
    // Fetch email from the URL parameter
    let userEmail = req.params.userEmail;
    let api_key = req.header("x-api-key"); // Fetches API key from request
    if(api_key === process.env.REACT_APP_API_KEY){ // Checks if API key is valid

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
    }else{
        res.status(401).json({ error: "Unauthorized. Please supply valid API key" });
    }
});

// Get all venues
app.get('/api/venues', async (req, res) => {
    let api_key = req.header("x-api-key"); // Fetches API key from request
    if(api_key === process.env.REACT_APP_API_KEY || api_key === process.env.EVENTS_API_KEY){ // Checks if API key is valid
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
    }else{
        res.status(401).json({ error: "Unauthorized. Please supply valid API key" });
    }
});

// POST - create Booking 
app.post("/api/bookings/create", async (req, res) => {
    let api_key = req.header("x-api-key"); // Fetches API key from request
    if(api_key === process.env.REACT_APP_API_KEY || api_key === process.env.EVENTS_API_KEY){ // Checks if API key is valid
        const { venueBooker, venueID, bookingDate, bookingStartTime, bookingEndTime, bookingDescription } = req.body;

        // make sure all the fields are entered 
        if (!venueBooker || !venueID || !bookingDate || !bookingStartTime || !bookingEndTime || !bookingDescription) {
            return res.status(400).json({ error: "All fields are required." });
        }

        const startTime = new Date(`1970-01-01T${bookingStartTime}:00`);
        const endTime = new Date(`1970-01-01T${bookingEndTime}:00`);

        if(startTime > endTime){
            return res.status(400).json({error: "Start time cannot be later than end time"});
        }

        try {
            const bookingsRef = collection(db, 'Bookings'); // Get already made bookings
            const conflictingBookingsQuery = query( // Make query which looks for bookings that are on the same day
                bookingsRef,                        // and in the same venue, starting before the end time of the new
                where('bookingDate', '==', bookingDate),// booking and ending after the start time of the new booking
                where('venueID', '==', venueID),    
                where('bookingStartTime', '<', bookingEndTime),
                where('bookingEndTime', '>', bookingStartTime)
            );

            const conflictingBookingsSnapshot = await getDocs(conflictingBookingsQuery); // Get results from query

            if (!conflictingBookingsSnapshot.empty) { // If the query returned bookings
                conflictingBookingsSnapshot.forEach((doc) => { // Check each returned booking
                    const existingBooking = doc.data();
                    const existingStartTime = existingBooking.bookingStartTime;
                    const existingEndTime = existingBooking.bookingEndTime;

                    if ( // Check that there is no overlap between the two bookings
                        (bookingStartTime >= existingStartTime && bookingStartTime < existingEndTime) ||
                        (bookingEndTime > existingStartTime && bookingEndTime <= existingEndTime) ||
                        (bookingStartTime <= existingStartTime && bookingEndTime >= existingEndTime)
                    ) {
                        return res.status(409).json({ error: "There is already a booking within the requested timeframe." });
                    }
                });
            }

            // Check for overlapping schedules
            const schedulesRef = collection(db, 'Schedules'); // Get already made bookings
            const scheduleDay = new Date(bookingDate).toLocaleString('en-US', { weekday: 'long' }); // Get the day of the week from booking date

            const scheduleQuery = query(
                schedulesRef,
                where('venueID', '==', venueID),
                where('bookingStartTime', '<', bookingEndTime),
                where('bookingEndTime', '>', bookingStartTime),
                where('bookingDay', '==', scheduleDay) // Check for schedules on the same day
            );

            const schedulesSnapshot = await getDocs(scheduleQuery); // Get results from schedule query

            if (!schedulesSnapshot.empty) {
                for (const doc of schedulesSnapshot.docs) {
                    const existingSchedule = doc.data();
                    const scheduleStartTime = existingSchedule.bookingStartTime;
                    const scheduleEndTime = existingSchedule.bookingEndTime;

                    if (
                        (bookingStartTime >= scheduleStartTime && bookingStartTime < scheduleEndTime) ||
                        (bookingEndTime > scheduleStartTime && bookingEndTime <= scheduleEndTime) ||
                        (bookingStartTime <= scheduleStartTime && bookingEndTime >= scheduleEndTime)
                    ) {
                        return res.status(409).json({ error: "There is a conflicting schedule for this day." });
                    }
                }
            }

            // adding a document to the Bookings collection
            const newBookingRef = doc(db, 'Bookings', `${venueID}-${bookingDate}-${bookingStartTime}`);//the document name/id is the venueID with the date and start time of the bookings
            if(api_key === process.env.EVENTS_API_KEY){
                const bookingData = {
                    venueBooker,
                    venueID,
                    bookingDate,
                    bookingStartTime,
                    bookingEndTime,
                    bookingDescription,
                    "externalBooking":"events"
                };
                // Save the booking data 
                await setDoc(newBookingRef, bookingData);

                // Returns the  ID of the newly created booking
                res.status(200).json({ message: "Booking created successfully", bookingID: newBookingRef.id });
            }else{
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
            }
        } catch (error) {
            console.error("Error creating booking:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }else{
        res.status(401).json({ error: "Unauthorized. Please supply valid API key" });
    }
});

// Get bookings by field API
app.get("/api/bookings/findByField", async (req, res) => {
    // Extract optional query parameters from the request
    const { venueID, bookingDate, bookingEndTime, bookingStartTime, venueBooker, bookingDescription} = req.query;
    let api_key = req.header("x-api-key"); // Fetches API key from request
    if(api_key === process.env.REACT_APP_API_KEY || api_key === process.env.EVENTS_API_KEY || api_key === process.env.DINING_API_KEY){ // Checks if API key is valid
        const bookingsCollection = collection(db, "Bookings"); // Reference to the "Bookings" collection in Firestore

        try {
            // Start building the query
            let bookingsQuery = bookingsCollection;

            // Apply filters if query parameters are provided
            if (venueID) {
                bookingsQuery = query(bookingsQuery, where("venueID", "==", venueID));
            }

            if (bookingDate) {
                bookingsQuery = query(bookingsQuery, where("bookingDate", "==", bookingDate));
            }

            if (bookingEndTime) {
                bookingsQuery = query(bookingsQuery, where("bookingEndTime", "==", bookingEndTime));
            }

            if (bookingStartTime) {
                bookingsQuery = query(bookingsQuery, where("bookingStartTime", "==", bookingStartTime));
            }

            if (venueBooker) {
                bookingsQuery = query(bookingsQuery, where("venueBooker", "==", venueBooker));
            }

            if (bookingDescription) {
                bookingsQuery = query(bookingsQuery, where("bookingDescription", "==", bookingDescription));
            }

            // Execute the query
            const bookingsSnapshot = await getDocs(bookingsQuery);
            const bookingsList = [];

            // Iterate over each document and push it to the list
            bookingsSnapshot.forEach((doc) => {
                bookingsList.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            // Send the filtered bookings as a JSON response
            res.status(200).json(bookingsList);
        } catch (error) {
            console.error("Error getting bookings:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }else{
        res.status(401).json({ error: "Unauthorized. Please supply valid API key" });
    }
});


app.post('/api/report-submit', async (req, res) => {
    let api_key = req.header("x-api-key"); // Fetches API key from request
    if(api_key === process.env.REACT_APP_API_KEY){ // Checks if API key is valid
    const { venueID, reportType, reportText, createdBy, photos } = req.body;
  
    try {
      const reportData = {
        venueID,
        reportType,
        reportText,
        reportStatus: 'pending',
        resolutionLog: '',
        createdBy,
        photos: photos || [],
      };
      console.log("I got here")
      // Use addDoc to create a new document in the Reports collection
      const docRef = await addDoc(collection(db, 'Reports'), reportData);
      res.status(201).json({ id: docRef.id });
    } catch (error) {
      console.error('Error creating report:', error);
      res.status(500).json({ error: 'Failed to create report' });

    }
  }else{res.status(401).json({ error: "Unauthorized. Please supply valid API key" });}});

app.get("/api/reports", async (req, res) => {
    let api_key = req.header("x-api-key"); // Fetches API key from request
    if(api_key === process.env.REACT_APP_API_KEY){ // Checks if API key is valid
        const { venueID, roomNumber, reportType, createdBy } = req.query;  // Include 'createdBy' as a filter

        try {
            const reportsQuery = collection(db, "Reports");
            let queryRef = reportsQuery;

            // Apply filters based on query parameters
            if (venueID) {
                queryRef = query(queryRef, where("venueID", "==", venueID));
            }
            if (roomNumber) {
                queryRef = query(queryRef, where("roomNumber", "==", roomNumber));
            }
            if (reportType) {
                queryRef = query(queryRef, where("reportType", "==", reportType));
            }
            if (createdBy) {
                queryRef = query(queryRef, where("createdBy", "==", createdBy));  // Ensure reports are filtered by creator
            }

            // Execute the query
            const querySnapshot = await getDocs(queryRef);
            const reports = [];

            querySnapshot.forEach((doc) => {
                reports.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            res.status(200).json(reports);
        } catch (error) {
            console.error("Error retrieving reports:", error);
            res.status(500).json({ error: "Failed to retrieve reports" });
        }
    }else{
        res.status(401).json({ error: "Unauthorized. Please supply valid API key" });
    }
});

//GET  all bookings
app.get("/api/bookings", async (req, res) => {
    let api_key = req.header("x-api-key"); // Fetches API key from request
    if(api_key === process.env.REACT_APP_API_KEY || api_key === process.env.EVENTS_API_KEY || api_key === process.env.DINING_API_KEY){ // Checks if API key is valid
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
            res.status(200).json(bookings);
        } catch (error) {
            console.error("Error retrieving bookings:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }else{
        res.status(401).json({ error: "Unauthorized. Please supply valid API key" });
    }
});




//Get booking by  ID
app.get("/api/bookings/:id", async (req, res) => {
    let api_key = req.header("x-api-key"); // Fetches API key from request
    if(api_key === process.env.REACT_APP_API_KEY || api_key === process.env.EVENTS_API_KEY || api_key === process.env.DINING_API_KEY){ // Checks if API key is valid
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
    }else{
        res.status(401).json({ error: "Unauthorized. Please supply valid API key" });
    }
});


// PUT -update a booking by ID
app.put("/api/bookings/:id", async (req, res) => {
    const bookingId = req.params.id;
    let api_key = req.header("x-api-key"); // Fetches API key from request
    if(api_key === process.env.REACT_APP_API_KEY){ // Checks if API key is valid
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
    }else{
        res.status(401).json({ error: "Unauthorized. Please supply valid API key" });
    }
});

//Delete a booking by ID
app.delete("/api/bookings/:id", async (req, res) => {
    const bookingId = req.params.id;
    let api_key = req.header("x-api-key"); // Fetches API key from request
    if(api_key === process.env.REACT_APP_API_KEY){ // Checks if API key is valid
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
    }else if(api_key === process.env.EVENTS_API_KEY){
        try {
            const bookingDocRef = doc(db, 'Bookings', bookingId);
            const bookingDoc = await getDoc(bookingDocRef);

            if (!bookingDoc.exists()) {
                return res.status(404).json({ error: "Booking not found" });
            }

            const bookingData = bookingDoc.data();

            // Check if this booking was made by events
            if (bookingData.externalBooking === 'events') {
                await deleteDoc(bookingDocRef);
                return res.status(200).json({ message: "Booking deleted successfully", bookingID: bookingId });
            } else {
                return res.status(403).json({ error: "Forbidden. You can only delete bookings made using your API key" });
            }
        } catch (error) {
            console.error("Error deleting booking:", error.message);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
    else{
        res.status(401).json({ error: "Unauthorized. Please supply valid API key" });
    }
});

// // Venues section
// // Create a new venue
app.post('/api/venues', async (req, res) => {
    let api_key = req.header("x-api-key"); // Fetches API key from request
    if(api_key === process.env.REACT_APP_API_KEY){ // Checks if API key is valid
        const { buildingName, campus, isClosed, venueCapacity, venueName, venueType,timeSlots } = req.body;

        // Validate the required fields
        if (!buildingName || !campus || isClosed === undefined || !venueCapacity || !venueName || !venueType || !timeSlots) {
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
                timeSlots
            };

            // Save the venue to Firestore
            await setDoc(newVenueRef, venueData);

            // Respond with the ID of the newly created venue
            res.status(201).json({ message: "Venue created successfully", venueID: newVenueRef.id });
        } catch (error) {
            console.error("Error creating venue:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }else{
        res.status(401).json({ error: "Unauthorized. Please supply valid API key" });
    }
});

// Get venues by field
app.get("/api/venues/findByField", async (req, res) => {
    // Extract optional query parameters from the request
    const { buildingName, campus, isClosed, timeSlots, venueCapacity, venueName, venueType } = req.query;
    let api_key = req.header("x-api-key"); // Fetches API key from request

    // Check for valid API key
    if (api_key === process.env.REACT_APP_API_KEY || api_key === process.env.EVENTS_API_KEY) {
        const venuesCollection = collection(db, "Venues"); 

        try {
            // Start building the query
            let venuesQuery = venuesCollection;

            // Apply filters if query parameters are provided
            if (buildingName) {
                venuesQuery = query(venuesQuery, where("buildingName", "==", buildingName));
            }

            if (campus) {
                venuesQuery = query(venuesQuery, where("campus", "==", campus));
            }

            if (isClosed !== undefined) { 
                const isClosedBool = isClosed === 'true';
                venuesQuery = query(venuesQuery, where("isClosed", "==", isClosedBool));
            }

            if (timeSlots) {
                const timeSlotsArray = timeSlots.split(',');
                venuesQuery = query(venuesQuery, where("timeSlots", "array-contains-any", timeSlotsArray));
            }

            if (venueCapacity) {
                venuesQuery = query(venuesQuery, where("venueCapacity", "==", parseInt(venueCapacity)));
            }

            if (venueName) {
                venuesQuery = query(venuesQuery, where("venueName", "==", venueName));
            }

            if (venueType) {
                venuesQuery = query(venuesQuery, where("venueType", "==", venueType));
            }

            // Execute the query
            const venuesSnapshot = await getDocs(venuesQuery);
            const venuesList = [];

            // Iterate over each document and push it to the list
            venuesSnapshot.forEach((doc) => {
                venuesList.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            // Send the filtered venues as a JSON response
            res.status(200).json(venuesList);
        } catch (error) {
            console.error("Error getting venues:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    } else {
        res.status(401).json({ error: "Unauthorized. Please supply a valid API key" });
    }
});

// Update a venue by ID
app.put('/api/venues/:id', async (req, res) => {
    const id = req.params.id;
    let api_key = req.header("x-api-key"); // Fetches API key from request
    if(api_key === process.env.REACT_APP_API_KEY){ // Checks if API key is valid
        const { buildingName, campus, isClosed, venueCapacity, venueName, venueType,timeSlots } = req.body;

        // Validate the required fields
        if (!buildingName && !campus && isClosed === undefined && !venueCapacity && !venueName && !venueType && !timeSlots) {
            return res.status(400).json({ error: "At least one field is required to update." });
        }

        // Validate timeSlots if provided
        if (timeSlots && (!Array.isArray(timeSlots) || !timeSlots.every(slot => typeof slot === 'string'))) {
            return res.status(400).json({ error: "timeSlots must be an array of strings." });
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
            if (timeSlots) updates.timeSlots = timeSlots;

            await updateDoc(venueDocRef, updates);

            res.status(200).json({ message: "Venue updated successfully" });
        } catch (error) {
            console.error("Error updating venue:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }else{
        res.status(401).json({ error: "Unauthorized. Please supply valid API key" });
    }
});

// Delete a venue by ID
app.delete('/api/venues/:id', async (req, res) => {
    const id = req.params.id;
    let api_key = req.header("x-api-key"); // Fetches API key from request
    if(api_key === process.env.REACT_APP_API_KEY){ // Checks if API key is valid
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
    }else{
        res.status(401).json({ error: "Unauthorized. Please supply valid API key" });
    }
});

// POST-create Admin Request 
app.post("/api/adminRequests/create", async (req, res) => {
    let api_key = req.header("x-api-key"); // Fetches API key from request
    if(api_key === process.env.REACT_APP_API_KEY){ // Checks if API key is valid
        const { requesterEmail, requestText, requestStatus } = req.body;
        // Validate required fields
        if (!requesterEmail || !requestText || !requestStatus) {
            // console.log(requesterEmail, requestText, requestStatus);
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
            // res.status(200).json({ message: "Booking created successfully", bookingID: newBookingRef.id });
            res.status(200).json({ message: "Request created successfully"});
        } catch (error) {
            console.error("Error creating booking:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }else{
        res.status(401).json({ error: "Unauthorized. Please supply valid API key" });
    }
});


//PUT
app.put("/api/adminRequests/:id", async (req, res) => {
    const adminRequestId = req.params.id;
    let api_key = req.header("x-api-key"); // Fetches API key from request
    if(api_key === process.env.REACT_APP_API_KEY){ // Checks if API key is valid
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
    }else{
        res.status(401).json({ error: "Unauthorized. Please supply valid API key" });
    }
});

// Get by field
app.get("/api/adminRequests/findByField", async (req, res) => {
    let api_key = req.header("x-api-key"); // Fetches API key from request
    if(api_key === process.env.REACT_APP_API_KEY){ // Checks if API key is valid
        try {
            const { requestStatus, requesterEmail, requestText} = req.query;
            const ReqCollectionRef = collection(db, 'AdminRequests');

            let requestsQuery = ReqCollectionRef;

            // Apply filters if query parameters are provided
            if (requestStatus) {
                requestsQuery = query(requestsQuery, where("requestStatus", "==", requestStatus));
            }

            if (requesterEmail) {
                requestsQuery = query(requestsQuery, where("requesterEmail", "==", requesterEmail));
            }

            if (requestText) {
                requestsQuery = query(requestsQuery, where("requestText", "==", requestText));
            }
            
            const requestSnapshot = await getDocs(requestsQuery);
            
            const requestsList = [];

            // Iterate over each document and push it to the list
            requestSnapshot.forEach((doc) => {
                requestsList.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

        
            res.status(200).json(requestsList);
        } catch (error) {
            console.error("Error retrieving requests:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }else{
        res.status(401).json({ error: "Unauthorized. Please supply valid API key" });
    }
});

//Get Requests
app.get("/api/adminRequests", async (req, res) => {
    let api_key = req.header("x-api-key"); // Fetches API key from request
    if(api_key === process.env.REACT_APP_API_KEY){ // Checks if API key is valid
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
    }else{
        res.status(401).json({ error: "Unauthorized. Please supply valid API key" });
    }
});





app.put("/api/reports/:id", async (req, res) => {
    const rID = req.params.id;
    let api_key = req.header("x-api-key"); // Fetches API key from request
    if(api_key === process.env.REACT_APP_API_KEY){ // Checks if API key is valid
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
    }else{
        res.status(401).json({ error: "Unauthorized. Please supply valid API key" });
    }
});



//Getting each report  type for Admin to filter reports by type
app.get("/api/reports/types", async (req, res) => {
    let api_key = req.header("x-api-key"); // Fetches API key from request
    if(api_key === process.env.REACT_APP_API_KEY){ // Checks if API key is valid
        try {
            const reportsCollectionRef = collection(db, 'Reports');
            const snapshot = await getDocs(reportsCollectionRef);

            //get unique report type
            const allReportTypes = snapshot.docs.map(doc => doc.data().reportType);

            const uniqueReportTypes = [...new Set(allReportTypes)];

            res.status(200).json(uniqueReportTypes);
        } catch (error) {
            console.error("Error retrieving unique report types:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }else{
        res.status(401).json({ error: "Unauthorized. Please supply valid API key" });
    }
});

app.get("/api/schedules", async (req, res) => {
    let api_key = req.header("x-api-key"); // Fetches API key from request
    if(api_key === process.env.REACT_APP_API_KEY || api_key === process.env.EVENTS_API_KEY){ // Checks if API key is valid
        try {
            
            const schedules = collection(db, 'Schedules');
            const snapshot = await getDocs(schedules);
            
            const entry = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
    res.status(200).json(entry);
        } catch (error) {
            console.error("Error retrieving Schedules:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }else{
        res.status(401).json({ error: "Unauthorized. Please supply valid API key" });
    }
});

// Get schedules by field API
app.get("/api/schedules/findByField", async (req, res) => {
    // Extract optional query parameters from the request
    const { venueID, bookingDay, bookingEndTime, bookingStartTime, venueBooker, bookingDescription} = req.query;
    let api_key = req.header("x-api-key"); // Fetches API key from request
    if(api_key === process.env.REACT_APP_API_KEY || api_key === process.env.EVENTS_API_KEY){ // Checks if API key is valid
        const schedulesCollection = collection(db, 'Schedules'); // Reference to the "Schedules" collection in Firestore

        try {
            // Start building the query
            let schedulesQuery = schedulesCollection;

            // Apply filters if query parameters are provided
            if (venueID) {
                schedulesQuery = query(schedulesQuery, where("venueID", "==", venueID));
            }

            if (bookingDay) {
                schedulesQuery = query(schedulesQuery, where("bookingDay", "==", bookingDay));
            }

            if (bookingEndTime) {
                schedulesQuery = query(schedulesQuery, where("bookingEndTime", "==", bookingEndTime));
            }

            if (bookingStartTime) {
                schedulesQuery = query(schedulesQuery, where("bookingStartTime", "==", bookingStartTime));
            }

            if (venueBooker) {
                schedulesQuery = query(schedulesQuery, where("venueBooker", "==", venueBooker));
            }

            if (bookingDescription) {
                schedulesQuery = query(schedulesQuery, where("bookingDescription", "==", bookingDescription));
            }

            // Execute the query
            const schedulesSnapshot = await getDocs(schedulesQuery);
            const schedulesList = [];

            // Iterate over each document and push it to the list
            schedulesSnapshot.forEach((doc) => {
                schedulesList.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            // Send the filtered schedules as a JSON response
            res.status(200).json(schedulesList);
        } catch (error) {
            console.error("Error getting schedules:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }else{
        res.status(401).json({ error: "Unauthorized. Please supply valid API key" });
    }
});

//POST- schedules , for reoccuring bookings
app.get("/api/schedules", async (req, res) => {
    let api_key = req.header("x-api-key"); // Fetches API key from request
    if(api_key === process.env.REACT_APP_API_KEY){ // Checks if API key is valid
        try {
            
            const schedules = collection(db, 'Schedules');
            const snapshot = await getDocs(schedules);
            
            const entry = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            res.status(200).json({ entry });
            } catch (error) {
                console.error("Error retrieving Schedules:", error);
                res.status(500).json({ error: "Internal Server Error" });
            }
    }else{
        res.status(401).json({ error: "Unauthorized. Please supply valid API key" });
    }
});


app.get("/api/schedules/:venueID", async (req, res) => {
    const venueID = req.params.venueID;
    let api_key = req.header("x-api-key"); // Fetches API key from request
    if(api_key === process.env.REACT_APP_API_KEY || api_key === process.env.EVENTS_API_KEY){ // Checks if API key is valid
        try {
            
            const schedules = collection(db, 'Schedules');
            const snapshot = await getDocs(schedules);

            const schedulesQuery = query(collection(db, 'Schedules'), where('venueID', '==', venueID));
            const schedulesSnapshot = await getDocs(schedulesQuery);
            const schedulesList = [];

            schedulesSnapshot.forEach(doc => {
                schedulesList.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            res.status(200).json(schedulesList);
        } catch (error) {
            console.error("Error retrieving Schedules:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }else{
        res.status(401).json({ error: "Unauthorized. Please supply valid API key" });
    }
});



app.post("/api/schedules/create", async (req, res) => {
    let api_key = req.header("x-api-key"); // Fetches API key from request
    if(api_key === process.env.REACT_APP_API_KEY){ // Checks if API key is valid
        const { venueBooker, bookingDescription ,venueID, bookingDay, bookingStartTime, bookingEndTime} = req.body;

        // make sure no fields are empty 
        if (!venueBooker || !venueID || !bookingDay || !bookingStartTime || !bookingEndTime || !bookingDescription) {
            return res.status(400).json({ error: "All fields are required." });
        }

        try {
            // adding an entry to the Schedules collection
            const newentry = doc(db, 'Schedules', `${venueID}-${bookingDay}-${bookingStartTime}`);//the document name/id is the venueID with the date and start time of the bookings
            const bookingData = {
                venueBooker,
                venueID,
                bookingDay,
                bookingStartTime,
                bookingEndTime,
                bookingDescription,
            
            };
            await setDoc(newentry, bookingData);

            res.status(200).json({ message: "Schedule entry created successfully", sID: newentry.id });
        } catch (error) {
            console.error("Error making entry:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }else{
        res.status(401).json({ error: "Unauthorized. Please supply valid API key" });
    }
});



app.put("/api/schedules/:id", async (req, res) => {
    const scheduleId = req.params.id;
    let api_key = req.header("x-api-key"); // Fetches API key from request
    if(api_key === process.env.REACT_APP_API_KEY){ // Checks if API key is valid
        const { venueBooker, venueID, bookingDay, bookingStartTime, bookingEndTime, bookingDescription } = req.body;

        if (!venueBooker && !venueID && !bookingDay && !bookingStartTime && !bookingEndTime && !bookingDescription) {
            return res.status(400).json({ error: "At least one field is required to update." });
        }

        try {
        
            const entrydoc = doc(db, 'Schedules', scheduleId);
            const sDoc = await getDoc(entrydoc);

            if (!sDoc.exists()) {
                return res.status(404).json({ error: "Entry not found" });
            }

            const updates = {};
            if (venueBooker) updates.venueBooker = venueBooker;
            if (venueID) updates.venueID = venueID;
            if (bookingDay) updates.bookingDay = bookingDay;
            if (bookingStartTime) updates.bookingStartTime = bookingStartTime;
            if (bookingEndTime) updates.bookingEndTime = bookingEndTime;
            if (bookingDescription) updates.bookingDescription = bookingDescription;

            //update the doc in Firestore
            await updateDoc(entrydoc, updates);
            res.status(200).json({ message: "Entry updated successfully", bookingID: scheduleId });
        } catch (error) {
            console.error("Error updating entry:", error.message);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }else{
        res.status(401).json({ error: "Unauthorized. Please supply valid API key" });
    }
});

// POST - create Notification
app.post("/api/notifications", async (req, res) => {
    let api_key = req.header("x-api-key"); // Fetches API key from request
    if(api_key === process.env.REACT_APP_API_KEY){ // Checks if API key is valid
        const { dateCreated, notificationMessage, notificationType, read, recipientEmail } = req.body;

        // make sure all the fields are entered 
        if (!dateCreated || !notificationMessage || !notificationType || read === undefined || !recipientEmail) {
            return res.status(400).json({ error: "All fields are required." });
        }

        try {
            // adding a document to the Notifications collection
            const newNotificationRef = doc(collection(db, 'Notifications'));
            const notificationData = {
                dateCreated,
                notificationMessage,
                notificationType,
                read,
                recipientEmail
            };

            // Save the notification data 
            await setDoc(newNotificationRef, notificationData);

            // Returns the ID of the newly created notification
            res.status(200).json({ message: "Notification created successfully", notificationID: newNotificationRef.id });
        } catch (error) {
            console.error("Error creating notification:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }else{
        res.status(401).json({ error: "Unauthorized. Please supply valid API key" });
    }
});

// GET - retrieve all notifications for a specific recipient
app.get("/api/notifications/:recipientEmail", async (req, res) => {
    const recipientEmail = req.params.recipientEmail;
    let api_key = req.header("x-api-key"); // Fetches API key from request
    if(api_key === process.env.REACT_APP_API_KEY || api_key === process.env.EVENTS_API_KEY){ // Checks if API key is valid
        try {
            const notificationsQuery = query(collection(db, 'Notifications'), where('recipientEmail', '==', recipientEmail));
            const notificationsSnapshot = await getDocs(notificationsQuery);
            const notificationsList = [];

            notificationsSnapshot.forEach(doc => {
                notificationsList.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            res.status(200).json(notificationsList);
        } catch (error) {
            console.error("Error getting notifications:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }else{
        res.status(401).json({ error: "Unauthorized. Please supply valid API key" });
    }
});
// PUT - update Notification
app.put("/api/notifications/:id", async (req, res) => {
    const notificationId = req.params.id;
    let api_key = req.header("x-api-key"); // Fetches API key from request
    if(api_key === process.env.REACT_APP_API_KEY){ // Checks if API key is valid
        const { dateCreated, notificationMessage, notificationType, read, recipientEmail } = req.body;

        // make sure all the fields are entered 
        if (!dateCreated || !notificationMessage || !notificationType || read === undefined || !recipientEmail) {
            return res.status(400).json({ error: "All fields are required." });
        }

        try {
            // Reference to the notification document
            const notificationRef = doc(db, 'Notifications', notificationId);
            
            // Check if the notification exists
            const notificationDoc = await getDoc(notificationRef);
            if (!notificationDoc.exists()) {
                return res.status(404).json({ error: "Notification not found." });
            }

            // Update the notification data
            const updatedNotificationData = {
                dateCreated,
                notificationMessage,
                notificationType,
                read,
                recipientEmail
            };

            // Save the updated notification data
            await setDoc(notificationRef, updatedNotificationData, { merge: true });

            res.status(200).json({ message: "Notification updated successfully" });
        } catch (error) {
            console.error("Error updating notification:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }else{
        res.status(401).json({ error: "Unauthorized. Please supply valid API key" });
    }
});
//image upload api
app.post('/api/upload-image', upload.single('image'), async (req, res) => {
    let api_key = req.header("x-api-key"); // Fetches API key from request
    if(api_key === process.env.REACT_APP_API_KEY){ // Checks if API key is valid
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }

            const image = req.file; // Get file from the request

            // Create a reference to the image file in Firebase Storage
            const storageRef = ref(storage, `images/${Date.now()}-${image.originalname}`);

            // Upload the file to Firebase Storage
            const snapshot = await uploadBytes(storageRef, image.buffer, {
                contentType: image.mimetype,
            });

            // Get the download URL after the upload is complete
            const downloadURL = await getDownloadURL(snapshot.ref);

            // You can store the download URL in Firestore if needed
            // Example: Storing the image URL in a "Images" collection
            const newImageRef = doc(collection(db, 'Images'));
            await setDoc(newImageRef, {
                imageUrl: downloadURL,
                uploadedAt: new Date(),
            });

            // Return the download URL in the response
            res.status(200).json({ message: 'Image uploaded successfully', downloadURL });
        } catch (error) {
            console.error('Error uploading image:', error);
            res.status(500).json({ error: 'Failed to upload image' });
        }
    }else{
        res.status(401).json({ error: "Unauthorized. Please supply valid API key" });
    }
});

/////////////////////////aws stuff///////////////////////////

const AWS = require('aws-sdk');
require('dotenv').config();
const rekognition = new AWS.Rekognition({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });
  app.post('/api/analyze-photos', upload.array('photos'), async (req, res) => {
    let api_key = req.header("x-api-key"); // Fetches API key from request

    if(api_key === process.env.REACT_APP_API_KEY || api_key === process.env.EVENTS_API_KEY || api_key === process.env.DINING_API_KEY){
    const photoBuffers = req.files.map(file => file.buffer);
    console.log(process.env.REACT_APP_API_KEY);
    console.log("this one")
    try {
      const promises = photoBuffers.map(buffer => {
        const params = {
          Image: {
            Bytes: buffer,
          },
          // Add additional parameters as needed, e.g., FeatureTypes: ['LABELS']
        };
        return rekognition.detectLabels(params).promise();
      });
  
      const results = await Promise.all(promises);
      res.status(200).json(results);
    } catch (error) {
      console.error('Error analyzing photos:', error);
      res.status(500).json({ error: 'Failed to analyze photos' });
    }
  }else{res.status(401).json({ error: "Unauthorized. Please supply valid API key" });
}});





// Left out for deployment
// Prints to console the port of the server
// app.listen(PORT, () => {
//     console.log(`Server listening on ${PORT}`);
// });

exports.api = onRequest(app);
