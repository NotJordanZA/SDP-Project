export const createNotification = async (notificationData) => {
    try {
        // Send notification to the server
        const notificationResponse = await fetch('/api/notifications', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.REACT_APP_API_KEY,
            },
            body: JSON.stringify(notificationData),
            });

            if (!notificationResponse.ok) {
            throw new Error('Failed to create notification');
            }

            console.log('Notification created successfully');
    } catch (error) {
        console.log('Error:', error);
    }
}
