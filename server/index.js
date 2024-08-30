const { getDoc, setDoc, updateDoc, doc, deleteDoc } = require('firebase/firestore');
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