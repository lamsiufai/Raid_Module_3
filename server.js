// server.js

const express = require('express');
const redis = require('redis');

const app = express();
const port = 5001;

// Use environment variables to configure Redis connection
const redisHost = process.env.REDIS_HOST || 'localhost';  // Default to 'localhost' if not provided
const redisPort = process.env.REDIS_PORT || 6379;

// Connect to the Redis server using the service name defined in docker-compose.yml
//const client = redis.createClient({
//   host: 'redis', // Use the service name defined in docker-compose.yml
// host: redisHost, // Use the environment variable  
// port: redisPort
//	url: "redis://redis:6379",
//});

const client = redis.createClient(
  process.env.DOCKER_CONTAINER === "true"
    ? {
        url: "redis://redis:6379",
      }
    : { url: "redis://localhost:6379" }
);

client.on('error', (err) => {
    console.error('Error connecting to Redis', err);
});

//client.on('connect', () => {
//    console.log('Connected to Redis');
//});

(async () => {
   await client.connect();
})();

// Endpoint to track visitors
app.get('/', async (req, res) => {
    try {
        const count = await client.incr('visitor_count');
        res.send(`You are the ${count}th visitor.`);
    } catch (err) {
        console.error('Error incrementing counter:', err);
        res.status(500).send('Error incrementing counter');
    }
});

// Graceful shutdown
process.on('SIGINT', async () => {
    await client.quit();
    process.exit(0);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
