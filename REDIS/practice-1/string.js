import client from './client.js'

const init = async () => {
    // await client.set("name:6", "Saurabh Kumar", "NX")
    // // await client.expire("name:6", 10); //10 seconds
    // const result = await client.get('name:6')
    // console.log('Result : ', result);


    // await client.lpush("messages", "hello");
    // await client.rpush("messages", "r hello");


    // LISTS
    // lpush rpush lpop rpop llen move trim
    // blpop
    // lrange KEY_NAME start(0) end(-1)
    // KEY

    // SETS
    // sadd
    // srem
    // sismember
    // sinter

    // HASH SET - hset
    // hset 
    // hget
    // hmget
    // hIncrBy
    // performance??

    // SORTED SET
    // zadd
    // zrange
    // zrevrange
    // zrank


    // STREAMS

    //GEOSPATIAL


    // pub sub
    //subscribe






    // await client.sadd("ip", 1);/

}

init();