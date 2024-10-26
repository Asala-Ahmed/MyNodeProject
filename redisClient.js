import redis from "redis";

// Create a Redis client
const client = redis.createClient();

// Handle Redis connection errors
client.on("error", (err) => {
    console.error("Redis error: ", err);
});

// Connect to Redis
client.connect();

export default client;
