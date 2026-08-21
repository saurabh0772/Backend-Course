import { connectDB } from "./config/database.js"
import { Job } from "./models/job.model.js"


const getJobs = async () => {
    await connectDB();

    // Experiment 1
    // total scanned = 12, returned = 4, COLLSCAN
    // const result = await Job.find({
    //     location : "Delhi"
    // }).explain('executionStats')


    //Experiment 2 
    // total scanned = 4, returned = 4, FETCH (why it should show IXSCAN)
    // const result = await Job.find({
    //     location : "Delhi"
    // }).explain("executionStats")
    
    
    // Experiment 3
    // without indexing at salary - 
    // results  = 8 returned, 12 examined, collscan
    // with indexing at salary
    // results = 8 retured, 8 examinded, Fetch(not showing ixscan also)
    // const result = await Job.find({
    //     salary : {
    //         $gte : 20000
    //     }
    // }).explain("executionStats")


    //Experiment 4
    // without multikey indexing at skills
    // results = 5 returned, 12 examined, colscan
    // with multikey indexing at skills
    // results = 5 returned, 5 examined, fetch
    // const result = await Job.find({
    //     skills : "Node.js"
    // }).explain("executionStats")
    

    //Experiment 5 
    // without compound indexing at location and salary
    // results = 2 returned, 12 examined, collscan
    // with compound indexing at location and salary
    // results = 2 returned, 4 examined, 12 keyexamined, fetch
    // const result = await Job.find({
    //     location : "Delhi",
    //     salary : {
    //         $gte : 20000
    //     }
    // }).explain("executionStats")



    //Experiment 6
    // without indexing at salary
    // results = 12 returned, 12 examined, stage - sort, work = 26, needtime = 13
    // with indexing at salary
    // results = 12 returned, 12 examined, stage - fetch, work = 13, needTime = 0 (maybe faster coz it takes less time)
    const result = await Job.find({}).sort({
        salary : 1
    }).explain("executionStats")



    
    // await Job.cleanIndexes()
    // await Job.collection.dropIndex('salary_1')
    // console.log(await Job.collection.getIndexes())
    
    
    console.dir(result, { depth: null });
}

getJobs();