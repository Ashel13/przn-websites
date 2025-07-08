const { Pool } = require('pg');

exports.handler = async function(event) {
    console.log("Function started."); // Log 1: Confirms the function ran

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { fullName, email, phone } = JSON.parse(event.body);
        console.log("Received data:", { fullName, email, phone }); // Log 2: Shows the data received from the form

        const connectionString = process.env.DATABASE_URL;
        if (!connectionString) {
            console.error("Database URL is not set.");
            throw new Error("Database URL environment variable is not set.");
        }
        
        console.log("Connecting to the database..."); // Log 3: Confirms it's about to connect
        const pool = new Pool({ connectionString });

        const query = 'INSERT INTO applications(full_name, email, phone) VALUES($1, $2, $3)';
        const values = [fullName, email, phone];

        await pool.query(query, values);
        console.log("Data successfully inserted into database."); // Log 4: Confirms data was saved

        return { statusCode: 200, body: JSON.stringify({ message: "Success" }) };
    } catch (error) {
        // This will now log the specific database error
        console.error('A critical error occurred:', error);
        return { statusCode: 500, body: JSON.stringify({ message: "Error" }) };
    }
};