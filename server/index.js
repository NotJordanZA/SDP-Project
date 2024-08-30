const { getDoc, setDoc, addDoc, doc } = require('firebase/firestore');
const { initializeApp } = require('firebase/app');
const { getFirestore } = require("firebase/firestore");
const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.json());
// app.use(express.urlencoded());

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

// app.use(express.static(path.resolve(__dirname, '../build')));

app.get("/users/:userEmail", async (req, res) => {
    let userEmail = req.params.userEmail;
    
    //fetch the document from the users collection about the current user
    const userDocRef = doc(db, "Users", userEmail);
    // For fetching all user info
    try {
        const userDocData = await getDoc(userDocRef);
        
        if (userDocData.exists()) {
            // Send the user data back as JSON
            res.json(userDocData.data());
        } else {
            // Handle the case where the document does not exist
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        console.error("Error fetching user document:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post("/users", async (req, res) => {
    const {userEmail, firstName, lastName, isStudent, isLecturer, isAdmin} = req.body;
    // let userEmail = req.query.userEmail;
    // let firstName = req.query.firstName;
    // let lastName = req.query.lastName;
    // let isStudent = req.query.isStudent;
    // let isLecturer = req.query.isLecturer;
    // let isAdmin = req.query.isAdmin;
    
    console.log(req.body);

    let query = {};
    
    query.userEmail = userEmail ? userEmail : undefined;
    query.firstName = firstName ? firstName : undefined;
    query.lastName = lastName ? lastName : undefined;
    query.isStudent = isStudent ? isStudent : undefined;
    query.isLecturer = isLecturer ? isLecturer : undefined;
    query.isAdmin = isAdmin ? isAdmin : undefined;

    // console.log(query);

    Object.keys(query).forEach((key) => {
        if (query[key] === undefined) {
            return res.status(400).json({ error: "Bad Request" });
        }
    });

    const userDocRef = doc(db, "users", userEmail);

    try {
        const userDocData = await getDoc(userDocRef);
            
        if (userDocData.exists()) {
            res.status(403).json({ error: "User already exists" });
        }else{
            const userData = {
                email: userEmail,
                firstName: firstName,
                lastName: lastName,
                isStudent: isStudent,
                isLecturer: isLecturer,
                isAdmin: isAdmin
                };
            const newUserRef = await addDoc(userDocRef, userData);
            res.status(200).json({ message: "User created successfully" });
        }
    } catch (error) {
        console.error("Error fetching user document:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.put("/users/:userEmail", async (req, res) => {
    let userEmail = req.params.userEmail;
    let firstName = req.query("firstName");
    let lastName = req.query("lastName");
    let isStudent = req.query("isStudent");
    let isLecturer = req.query("isLecturer");
    let isAdmin = req.query("isAdmin");
    
    const userDocRef = doc(db, "users", userEmail);

    try {
        const userDocData = await getDoc(userDocRef);
            
        if (userDocData.exists()) {
            res.status(403).json({ error: "User already exists" });
        }else{
            const userData = {
                email: userEmail,
                firstName: firstName,
                lastName: lastName,
                isStudent: isStudent,
                isLecturer: isLecturer,
                isAdmin: isAdmin
                };
            const newUserRef = await addDoc(userDocRef, userData);
            res.status(200).json({ message: "User created successfully" });
        }
    } catch (error) {
        console.error("Error fetching user document:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
  
app.listen(PORT, () => {
console.log(`Server listening on ${PORT}`);
});