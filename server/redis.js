import { createClient } from "redis";

const redisClient = createClient({
  url: "redis://default:tS4SxxT5fPISK6oRlLGCfkAlnuLsHgNJ@wax-juniper-iron-10160.db.redis.io:13921",
});

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

await redisClient.connect();

console.log("Connected to Redis!");

export default redisClient;
