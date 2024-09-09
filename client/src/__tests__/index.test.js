const request = require('supertest');
const express = require('express');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc } = require('firebase/firestore');
const app = express();

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

app.use(express.json());

// Mock the Firestore functions
jest.mock('firebase/firestore', () => {
    const originalModule = jest.requireActual('firebase/firestore');
    return {
        ...originalModule,
        collection: jest.fn(),
        getDocs: jest.fn(),
        doc: jest.fn(),
        getDoc: jest.fn(),
        setDoc: jest.fn(),
        updateDoc: jest.fn(),
        deleteDoc: jest.fn(),
    };
});

// Define the /venues route
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

// Define the /venues/:id route
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

// Define the /venues route
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

// Define the /venues/:id route
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

// Define the /venues/:id route
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

describe('API Tests', () => {
    describe('GET /venues', () => {
        it('should return a list of venues', async () => {
            const mockVenues = [
                { id: '1', buildingName: 'Building A', campus: 'Campus A', isClosed: false, venueCapacity: 100, venueName: 'Venue A', venueType: 'Type A' },
                { id: '2', buildingName: 'Building B', campus: 'Campus B', isClosed: true, venueCapacity: 200, venueName: 'Venue B', venueType: 'Type B' },
            ];

            getDocs.mockResolvedValue({
                forEach: (callback) => mockVenues.forEach(callback),
            });

            const response = await request(app).get('/venues');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockVenues);
        });

        it('should return a 500 error if there is an internal server error', async () => {
            getDocs.mockRejectedValue(new Error('Internal Server Error'));

            const response = await request(app).get('/venues');

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Internal Server Error' });
        });
    });

    describe('GET /venues/:id', () => {
        it('should return a single venue by ID', async () => {
            const mockVenue = { id: '1', buildingName: 'Building A', campus: 'Campus A', isClosed: false, venueCapacity: 100, venueName: 'Venue A', venueType: 'Type A' };

            getDoc.mockResolvedValue({
                exists: () => true,
                id: mockVenue.id,
                data: () => mockVenue,
            });

            const response = await request(app).get('/venues/1');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockVenue);
        });

        it('should return a 404 error if the venue is not found', async () => {
            getDoc.mockResolvedValue({
                exists: () => false,
            });

            const response = await request(app).get('/venues/1');

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: 'Venue not found' });
        });

        it('should return a 500 error if there is an internal server error', async () => {
            getDoc.mockRejectedValue(new Error('Internal Server Error'));

            const response = await request(app).get('/venues/1');

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Internal Server Error' });
        });
    });

    describe('POST /venues', () => {
        it('should create a new venue', async () => {
            const newVenue = { buildingName: 'Building C', campus: 'Campus C', isClosed: false, venueCapacity: 300, venueName: 'Venue C', venueType: 'Type C' };

            setDoc.mockResolvedValue();

            const response = await request(app)
                .post('/venues')
                .send(newVenue);

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('Venue created successfully');
        });

        it('should return a 400 error if required fields are missing', async () => {
            const newVenue = { buildingName: 'Building C', campus: 'Campus C' }; // Missing required fields

            const response = await request(app)
                .post('/venues')
                .send(newVenue);

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('All fields are required.');
        });

        it('should return a 500 error if there is an internal server error', async () => {
            setDoc.mockRejectedValue(new Error('Internal Server Error'));

            const newVenue = { buildingName: 'Building C', campus: 'Campus C', isClosed: false, venueCapacity: 300, venueName: 'Venue C', venueType: 'Type C' };

            const response = await request(app)
                .post('/venues')
                .send(newVenue);

            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Internal Server Error');
        });
    });

    describe('PUT /venues/:id', () => {
        it('should update an existing venue', async () => {
            const updates = { buildingName: 'Updated Building' };

            getDoc.mockResolvedValue({
                exists: () => true,
            });
            updateDoc.mockResolvedValue();

            const response = await request(app)
                .put('/venues/1')
                .send(updates);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Venue updated successfully');
        });

        it('should return a 400 error if no fields are provided for update', async () => {
            const response = await request(app)
                .put('/venues/1')
                .send({});

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('At least one field is required to update.');
        });

        it('should return a 404 error if the venue is not found', async () => {
            getDoc.mockResolvedValue({
                exists: () => false,
            });

            const response = await request(app)
                .put('/venues/1')
                .send({ buildingName: 'Updated Building' });

            expect(response.status).toBe(404);
            expect(response.body.error).toBe('Venue not found');
        });

        it('should return a 500 error if there is an internal server error', async () => {
            getDoc.mockRejectedValue(new Error('Internal Server Error'));

            const response = await request(app)
                .put('/venues/1')
                .send({ buildingName: 'Updated Building' });

            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Internal Server Error');
        });
    });

    describe('DELETE /venues/:id', () => {
        it('should delete an existing venue', async () => {
            getDoc.mockResolvedValue({
                exists: () => true,
            });
            deleteDoc.mockResolvedValue();

            const response = await request(app).delete('/venues/1');

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Venue deleted successfully');
        });

        it('should return a 404 error if the venue is not found', async () => {
            getDoc.mockResolvedValue({
                exists: () => false,
            });

            const response = await request(app).delete('/venues/1');

            expect(response.status).toBe(404);
            expect(response.body.error).toBe('Venue not found');
        });

        it('should return a 500 error if there is an internal server error', async () => {
            getDoc.mockRejectedValue(new Error('Internal Server Error'));

            const response = await request(app).delete('/venues/1');

            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Internal Server Error');
        });
    });
});