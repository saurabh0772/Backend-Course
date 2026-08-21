import { Job } from "../models/job.model.js"


export const getStats = async (req, res) => {
    const result = await Job.aggregate([{
        $group : {
            _id : null,
            totalJobs : {
                $sum : 1
            },
            averageSalary : {
                $avg : "$salary"
            },
            highestSalary : {
                $max : "$salary"
            },
            lowestSalary : {
                $min : "$salary"
            }
        }
    },{
        $project : {
            _id : 0,
            totalJobs : '$totalJobs',
            averageSalary : "$averageSalary",
            highestSalary : "$highestSalary",
            lowestSalary : "$lowestSalary"
        }
    }]);

    const jobsByLocation = await Job.aggregate([ {
            $group : {
                _id : "$location",
                jobTitles : {
                    $push : "$title"
                }
            }
        }, {
            $project : {
                _id : 0,
                location : "$_id",
                jobTitles : "$jobTitles"
            }
    }]);

    const jobsByCompany = await Job.aggregate([
        {
            $group : {
                _id : "$company",
                jobTitles : {
                    $push : "$title"
                }
            }
        }, {
            $project : {
                _id : 0,
                companyName : "$_id",
                jobTitles : "$jobTitles"
            }
        }
    ]);


    const jobsBySkill = await Job.aggregate([
        {
            $unwind : "$skills"
        }, {
            $sort : {
                title : 1
            }
        }, {
            $group : {
                _id : "$skills",
                jobTitles : {
                    $push : "$title"
                }
            } 
        }, {
            $project : {
                _id : 0,
                skills : "$_id",
                jobTitles : "$jobTitles"
            }
        }, {
            $sort : {
                skills : 1
            }
        }, 
    ])

    res.json({
        result,
        jobsByLocation,
        jobsByCompany,
        jobsBySkill
    })
}

export const allJobs = async (req, res) => {
    const jobs = await Job.find();

    res.json({
        jobs
    })
}

export const stats = async (req, res) => {

    // BASIC

    // 1. count total jobs
    // const result = await Job.aggregate([
    //     {
    //         $group : {
    //             _id : null,
    //             totalJobs : {
    //                 $sum : 1
    //             }
    //         }
    //     }
    // ])

    // 2. average salary
    // const result = await Job.aggregate([
    //     {
    //         $group : {
    //             _id : null,
    //             averageSalary : {
    //                 $avg : "$salary"
    //             }
    //         }
    //     }
    // ])

    // 3. and 4. highest salary and lowest salary
    // const result = await Job.aggregate([
    //     {
    //         $group : {
    //             _id : null,
    //             high : {
    //                 $max : "$salary"
    //             },
    //             low : {
    //                 $min : "$salary"
    //             }
    //         }
    //     }
    // ])

    // 5. jobs by location
    // const result = await Job.aggregate([
    //     {
    //         $group : {
    //             _id : "$location",
    //             totalJobs : {
    //                 $sum : 1
    //             }
    //         }
    //     }, {
    //         $project : {
    //             _id : 0,
    //             location : "$_id",
    //             totalJobs : "$totalJobs"
    //         }
    //     }
    // ])


    // INTERMEDIATE

    // 6. average salary by location
    // const result = await Job.aggregate([
    //     {
    //         $group : {
    //             _id : "$location",
    //             averageSalary : {
    //                 $avg : "$salary"
    //             }
    //         }
    //     }
    // ])

    // 7. highest salary by company
    // const result = await Job.aggregate([
    //     {
    //         $group : {
    //             _id : "$company",
    //             highestSalary : {
    //                 $max : "$salary" 
    //             }
    //         }
    //     }
    // ])

    // 8. active jobs by location
    // const result = await Job.aggregate([
    //     {
    //         $match : {
    //             isActive : true
    //         }
    //     }, {
    //         $group : {
    //             _id : "$location",
    //             activeJobs : {
    //                 $sum : 1
    //             }
    //         }
    //     }
    // ])

    // 9 jobs with salary greater than 20000
    // const result = await Job.aggregate([
    //     {
    //         $match : {
    //             salary : {
    //                 $gte : 25000
    //             }
    //         }
    //     }, {
    //         $group : {
    //             _id : null,
    //             totalJobs : {
    //                 $sum : 1
    //             }
    //         }
    //     }
    // ])

    // 10. average salary of active jobs
    // const result = await Job.aggregate([
    //     {
    //         $match : {
    //             isActive : true
    //         }
    //     }, {
    //         $group : {
    //             _id : null,
    //             averageSalary : {
    //                 $avg : "$salary"
    //             }
    //         }
    //     }
    // ])

    // 11. locations sorted by numbers of jobs
    // const result = await Job.aggregate([
    //     {
    //         $group : {
    //             _id : "$location",
    //             totalJobs : {
    //                 $sum : 1
    //             }
    //         }
    //     }, {
    //         $sort : {
    //             totalJobs : -1
    //         }
    //     }
    // ])

    // 12. count jobs by skill
    // const result = await Job.aggregate([
    //     {
    //         $unwind : "$skills"
    //     }, {
    //         $group : {
    //             _id : "$skills",
    //             totalJobs : {
    //                 $sum : 1
    //             }
    //         }
    //     }
    // ])

    // 13. most demanded skill
    // const result = await Job.aggregate([
    //     {
    //         $unwind : "$skills"
    //     }, {
    //         $group : {
    //             _id : "$skills",
    //             totalJobs : {
    //                 $sum : 1
    //             }
    //         }
    //     }, { 
    //         $sort : {
    //             totalJobs : -1
    //         } 
    //     }, {
    //         $limit : 1
    //     }
    // ])

    // 14. average salary by skills
    // const result = await Job.aggregate([
    //     {
    //         $unwind : "$skills"
    //     }, {
    //         $group : {
    //             _id : "$skills",
    //             averageSalary : {
    //                 $avg : "$salary"
    //             }
    //         }
    //     }
    // ])

    // 15. skills by company 
    // const result = await Job.aggregate([
    //     {
    //         $unwind : "$skills"
    //     }, {
    //         $group : {
    //             _id : "$company",
    //             skills : {
    //                 $addToSet : "$skills"
    //             }
    //         }
    //     }
    // ]) 


    // ADVANCED

    // 16. highest paying job in each location
    // const result = await Job.aggregate([
    //     {
    //         $sort : {
    //             salary : -1
    //         }
    //     }, {
    //         $group : {
    //             _id : "$location",
    //             job : {
    //                 $first : {
    //                     title : "$title",
    //                     company : "$company",
    //                     salary : "$salary",
    //                     experience : "$experience"
    //                 }
    //             }              
    //         }
    //     }
    // ])

    // 17. company with highest average salary
    // const result = await Job.aggregate([
    //     {
    //         $group : {
    //             _id : '$company',
    //             averageSalary : {
    //                 $avg : "$salary"
    //             }
    //         }
    //     }, { 
    //         $sort : {
    //             averageSalary : -1
    //         }
    //     }, {
    //         $limit : 1
    //     }, {
    //         $project : {
    //             _id : 0,
    //             company : "$_id",
    //             averageSalary : "$averageSalary"
    //         }
    //     }
    // ])

    // 18. locations with average salary greater tha 25000
    // const result = await Job.aggregate([
    //     {
    //         $group : {
    //             _id : "$location",
    //             averageSalary : {
    //                 $avg : "$salary"
    //             }
    //         }
    //     }, {
    //         $match : {
    //             averageSalary : {
    //                 $gt : 25000
    //             }
    //         }
    //     }, {
    //         $project : {
    //             _id : 0,
    //             location : "$_id",
    //             averageSalary : "$averageSalary"
    //         }
    //     }
    // ])

    // 19. complete jobs grouped by location
    // const result = await Job.aggregate([
    //     {
    //         $group : {
    //             _id : "$location",
    //             jobs : {
    //                 $push : "$$ROOT"
    //             }
    //         }
    //     }, {
    //         $project : {
    //             _id : 0,
    //             location : "$_id",
    //             "jobs.title" : 1,
    //             "jobs.company" : 1,
    //             "jobs.salary" : 1
    //         }
    //     }
    // ])

    // 20. salary statistics by company
    // const result = await Job.aggregate([
    //     {
    //         $group : {
    //             _id : "$company",
    //             totalJobs : {
    //                 $sum : 1
    //             },
    //             averageSalary : {
    //                 $avg : "$salary"
    //             },
    //             highestSalary : {
    //                 $max : "$salary"
    //             },
    //             lowestSalary : {
    //                 $min : "$salary"
    //             }
    //         }
    //     }, {
    //         $project : {
    //             _id : 0,
    //             company : "$_id",
    //             totalJobs : "$totalJobs",
    //             averageSalary : "$averageSalary",
    //             highestSalary : "$highestSalary",
    //             lowestSalary : "$lowestSalary"
    //         }
    //     }
    // ])

    // 21. most common job title
    // const result = await Job.aggregate([
    //     {
    //         $group : {
    //             _id : "$title",
    //             totalJobs : {
    //                 $sum : 1
    //             }
    //         }
    //     }, {
    //         $sort : {
    //             totalJobs : -1
    //         }
    //     }, {
    //         $limit : 1
    //     }
    // ])

    // 22. location with highest average salary
    // const result = await Job.aggregate([
    //     {
    //         $group : {
    //             _id : "$location",
    //             averageSalary : {
    //                 $avg : "$salary"
    //             }
    //         }
    //     }, { 
    //         $sort : {
    //             averageSalary : -1
    //         }
    //     }, { 
    //         $limit : 1
    //     }
    // ])

    // 23. company with most different skills
    // const result = await Job.aggregate([
    //     {
    //         $unwind : "$skills"
    //     }, {
    //         $group : {
    //             _id : "$company",
    //             skills : {
    //                 $addToSet : "$skills"
    //             }
    //         }
    //     },{
    //         $project : {
    //             _id : 0,
    //             company : "$_id",
    //             totalUniqueSkills : {
    //                 $size : "$skills"
    //             }
    //         }
    //     }, {
    //         $sort : {
    //             totalUniqueSkills : -1
    //         }
    //     }, {
    //         $limit : 1
    //     }
    // ])

    // 24. most experienced job per location
    // const result = await Job.aggregate([
    //     {
    //         $sort : {
    //             experience : -1
    //         }
    //     }, {
    //         $group : {
    //             _id : '$location',
    //             title : {
    //                 $first : "$title"
    //             },
    //             experience : {
    //                 $first : "$experience"
    //             }
    //         }
    //     },  {
    //         $project : {
    //             _id : 0,
    //             location : "$_id",
    //             title : 1,
    //             experience : 1
    //         }
    //     }
    // ])

    // 25. complete analytics
    const overall = await Job.aggregate([
        {
            $group : {
                _id : null,
                totalJobs : {
                    $sum : 1
                }, 
                averageSalary : {
                    $avg : "$salary"
                },
                highestSalary : {
                    $max : "$salary"
                },
                lowestSalary : {
                    $min : "$salary"
                }
            }
        }, {
            $project : {
                _id : 0,
                totalJobs : "$totalJobs",
                averageSalary : "$averageSalary",
                highestSalary : "$highestSalary",
                lowestSalary : "$lowestSalary"
            }
        }
    ]);

    const byLocation = await Job.aggregate([
        {
            $group : {
                _id : "$location",
                totalJobs : {
                    $sum : 1
                },
                averageSalary : {
                    $avg : "$salary"
                }
            }
        }, {
            $project : {
                _id : 0,
                location : "$_id",
                totalJobs : "$totalJobs",
                averageSalary : "$averageSalary"
            }
        }
    ]);

    const byCompany = await Job.aggregate([
        {
            $group : {
                _id : "$company",
                totalJobs : {
                    $sum : 1 
                },
                averageSalary : {
                    $avg : "$salary"
                }
            }
        }, {
            $project : {
                _id : 0,
                company : "$_id",
                totalJobs : "$totalJobs",
                averageSalary : "$averageSalary"
            }
        }
    ]);

    const bySkill = await Job.aggregate([
        {
            $unwind : "$skills"
        }, {
            $group : {
                _id : "$skills",
                totalJobs : {
                    $sum : 1
                },
                averageSalary : {
                    $avg : "$salary"
                }
            }
        }, {
            $project : {
                _id : 0,
                skill : "$_id",
                totalJobs : "$totalJobs",
                averageSalary : "$averageSalary"
            }
        }
    ])


    res.json({
        overall,
        byLocation,
        byCompany,
        bySkill
    })
}