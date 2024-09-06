const { getDoc, setDoc, updateDoc, doc, deleteDoc, getDocs, collection, query, where } = require('firebase/firestore');
const { initializeApp } = require('firebase/app');
const { getFirestore } = require("firebase/firestore");
const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.json());

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

// Get all venues
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

// Get bookings by field API
app.get("/bookings/findByField", async (req, res) => {
    // Extract optional query parameters from the request
    const { venueID, bookingDate, bookingEndTime, bookingStartTime, venueBooker, bookingDescription} = req.query;
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
});


//Prints to console the port of the server
app.listen(PORT, () => {
console.log(`Server listening on ${PORT}`);
});