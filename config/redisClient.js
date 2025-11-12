const  Redis = require("ioredis");
const redis = new Redis("rediss://default:AUuHAAIncDIxOWU0ZmFiMDUzYzg0YzRhYjNhMzZiNzk2MWY3MjYyZXAyMTkzMzU@stable-seasnail-19335.upstash.io:6379", {maxRetriesPerRequest: null})


redis.on('connect', () => console.log('Connected to Upstash Redis'));
redis.on('ready', () => console.log('Redis is ready to use'));
redis.on('error', (err) => console.error('Redis Error:', err));
redis.on('close', () => console.log('Redis connection closed'));
redis.on('reconnecting', () => console.log('Redis reconnecting...'));

module.exports = redis





