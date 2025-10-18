const redisClient = require("../config/redisClient");


async function setCache(key, ttl = 40, data1 = "", data2 = "", data3 = ""){
 let data = [data1, data2, data3];
return await redisClient.set(key, JSON.stringify(data), "EX", ttl);
}

async function getCache(key) {
try {
 return await redisClient.get(key)
} catch (err) {
console.log('error in get cache',err);
return null
}
}

async function makeKey(pageName, extra = "") {
   return `${pageName}:${extra}`;
}

module.exports = {
    setCache,
    getCache,
    makeKey
}