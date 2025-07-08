const { Pool } = require('pg');

exports.handler = async function(event, context) {
  // Only allow POST requests from your form
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Get the data from the form submission
    const { fullName, email, phone } = JSON.parse(event.body);

    // Get your secret database URL from Netlify's settings
    const connectionString = process.env.DATABASE_URL;

    // Connect to the database
    const pool = new Pool({
      connectionString: connectionString,
    });

    // The SQL command to insert a new row into a table called "applications"
    // IMPORTANT: You must create this table in your Neon database first.
    const query = 'INSERT INTO applications(full_name, email, phone) VALUES($1, $2, $3)';
    const values = [fullName, email, phone];

    // Run the command
    await pool.query(query, values);
    await pool.end();

    // Send a success response back to the form
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Application submitted successfully!" }),
    };
  } catch (error) {
    console.error('Error:', error);
    // Send an error response back to the form
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error submitting application." }),
    };
  }
};