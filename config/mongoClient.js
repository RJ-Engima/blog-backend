// Function to connect to the MongoDB cluster
async function connectToDatabase() {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        // Connect to the MongoDB cluster
        await client.connect();
        console.log('Connected to MongoDB cluster');

        // Access your database and collection
        const database = client.db('<database_name>');
        const collection = database.collection('<collection_name>');

        // Now you can perform operations on your collection
        // For example, inserting a document
        await collection.insertOne({ name: 'John Doe', age: 30 });

    } catch (error) {
        console.error('Error connecting to MongoDB cluster:', error);
    } finally {
        // Ensure the client is closed when you're done with it
        await client.close();
    }
}

// Call the function to connect to the MongoDB cluster
connectToDatabase();