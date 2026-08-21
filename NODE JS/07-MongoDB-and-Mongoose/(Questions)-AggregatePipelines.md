# MongoDB Aggregation Pipeline Questions

Use this Job schema:

```text
title
company
location
salary
skills[]
experience
isActive
```

## Basic

### 1. Count Total Jobs

**Question:** Find the total number of jobs in the collection.

**Expected output:**

```json
{ "totalJobs": 12 }
```

### 2. Average Salary

**Question:** Find the average salary of all jobs.

**Expected output:**

```json
{ "averageSalary": 24583.33 }
```

### 3. Highest Salary

**Question:** Find the highest salary offered among all jobs.

**Expected output:**

```json
{ "highestSalary": 30000 }
```

### 4. Lowest Salary

**Question:** Find the lowest salary offered among all jobs.

**Expected output:**

```json
{ "lowestSalary": 10000 }
```

### 5. Jobs by Location

**Question:** Count how many jobs are available in each location.

**Expected output:**

```json
[
  { "location": "Delhi", "totalJobs": 4 },
  { "location": "Mumbai", "totalJobs": 3 },
  { "location": "Bangalore", "totalJobs": 3 },
  { "location": "Pune", "totalJobs": 2 }
]
```

## Intermediate

### 6. Average Salary by Location

**Question:** Find the average salary offered in each location.

**Expected output:**

```json
[
  { "location": "Delhi", "averageSalary": 25000 },
  { "location": "Mumbai", "averageSalary": 27000 },
  { "location": "Bangalore", "averageSalary": 28000 }
]
```

### 7. Highest Salary by Company

**Question:** Find the highest salary offered by each company.

**Expected output:**

```json
[
  { "company": "ABC Technologies", "highestSalary": 30000 },
  { "company": "Google", "highestSalary": 28000 },
  { "company": "Microsoft", "highestSalary": 29000 }
]
```

### 8. Active Jobs by Location

**Question:** Find the number of active jobs available in each location.

**Expected output:**

```json
[
  { "location": "Delhi", "activeJobs": 3 },
  { "location": "Mumbai", "activeJobs": 2 },
  { "location": "Bangalore", "activeJobs": 2 }
]
```

### 9. Jobs with Salary Greater Than 20,000

**Question:** Find how many jobs have a salary greater than ₹20,000.

**Expected output:**

```json
{ "totalJobs": 8 }
```

### 10. Average Salary of Active Jobs

**Question:** Find the average salary of only active jobs.

**Expected output:**

```json
{ "averageSalary": 26750 }
```

### 11. Locations Sorted by Number of Jobs

**Question:** Find the number of jobs in each location and sort locations from most jobs to least jobs.

**Expected output:**

```json
[
  { "location": "Delhi", "totalJobs": 5 },
  { "location": "Mumbai", "totalJobs": 4 },
  { "location": "Bangalore", "totalJobs": 2 },
  { "location": "Pune", "totalJobs": 1 }
]
```

## `$unwind` Practice

### 12. Count Jobs by Skill

**Question:** Find how many jobs require each skill.

**Expected output:**

```json
[
  { "skill": "Node.js", "totalJobs": 7 },
  { "skill": "MongoDB", "totalJobs": 6 },
  { "skill": "Express", "totalJobs": 5 },
  { "skill": "React", "totalJobs": 4 }
]
```

### 13. Most Demanded Skill

**Question:** Find the single most demanded skill.

**Expected output:**

```json
{ "skill": "Node.js", "totalJobs": 7 }
```

### 14. Average Salary by Skill

**Question:** Find the average salary of jobs requiring each skill.

**Expected output:**

```json
[
  { "skill": "Node.js", "averageSalary": 27500 },
  { "skill": "MongoDB", "averageSalary": 26800 },
  { "skill": "React", "averageSalary": 25000 }
]
```

### 15. Skills by Company

**Question:** For each company, find all unique skills required by its jobs.

**Expected output:**

```json
[
  {
    "company": "ABC Technologies",
    "skills": ["Node.js", "Express", "MongoDB"]
  },
  {
    "company": "Google",
    "skills": ["Python", "React", "Node.js"]
  }
]
```

## Advanced

### 16. Highest-paying Job in Each Location

**Question:** Find the highest-paying job from each location. Return the complete job document.

**Expected output:**

```json
[
  {
    "location": "Delhi",
    "job": {
      "title": "Senior Backend Developer",
      "company": "ABC Technologies",
      "salary": 30000,
      "experience": 3
    }
  },
  {
    "location": "Mumbai",
    "job": {
      "title": "Full Stack Developer",
      "company": "XYZ",
      "salary": 29000,
      "experience": 2
    }
  }
]
```

### 17. Company with Highest Average Salary

**Question:** Find the company whose jobs have the highest average salary.

**Expected output:**

```json
{ "company": "Microsoft", "averageSalary": 29250 }
```

### 18. Locations with Average Salary Greater Than ₹25,000

**Question:** Find only those locations where the average job salary is greater than ₹25,000.

**Expected output:**

```json
[
  { "location": "Bangalore", "averageSalary": 28000 },
  { "location": "Mumbai", "averageSalary": 27000 }
]
```

### 19. Complete Jobs Grouped by Location

**Question:** Group jobs by location and keep the complete job documents inside an array for each location.

**Expected output:**

```json
[
  {
    "location": "Delhi",
    "jobs": [
      {
        "title": "Backend Developer",
        "company": "ABC",
        "salary": 25000
      },
      {
        "title": "Frontend Developer",
        "company": "XYZ",
        "salary": 22000
      }
    ]
  }
]
```

**Hint:** `$$ROOT`

### 20. Salary Statistics by Company

**Question:** For every company, find:

- Total jobs
- Average salary
- Highest salary
- Lowest salary

**Expected output:**

```json
[
  {
    "company": "ABC Technologies",
    "totalJobs": 5,
    "averageSalary": 26000,
    "highestSalary": 30000,
    "lowestSalary": 20000
  },
  {
    "company": "Google",
    "totalJobs": 3,
    "averageSalary": 28000,
    "highestSalary": 30000,
    "lowestSalary": 25000
  }
]
```

## Challenge — Don’t Look at the Solution

### 21. Most Common Job Title

**Question:** Find the job title that appears the most times.

**Expected output:**

```json
{ "title": "Backend Developer", "totalJobs": 5 }
```

### 22. Location with Highest Average Salary

**Question:** Find the location with the highest average salary.

**Expected output:**

```json
{ "location": "Bangalore", "averageSalary": 28500 }
```

### 23. Company with Most Different Skills

**Question:** Find the company that uses the highest number of unique skills.

**Expected output:**

```json
{ "company": "ABC Technologies", "totalUniqueSkills": 6 }
```

### 24. Most Experienced Job per Location

**Question:** Find the job requiring the most experience in each location.

**Expected output:**

```json
[
  {
    "location": "Delhi",
    "title": "Senior Backend Developer",
    "experience": 5
  },
  {
    "location": "Mumbai",
    "title": "Tech Lead",
    "experience": 6
  }
]
```

### 25. Complete Analytics

**Question:** Create one API result that provides:

- **Overall:** total jobs, average salary, highest salary, and lowest salary.
- **Location:** total jobs and average salary per location.
- **Company:** total jobs and average salary per company.
- **Skills:** total jobs and average salary per skill, plus unique skills per company.

**Expected structure:**

```json
{
  "overall": {
    "totalJobs": 12,
    "averageSalary": 24583,
    "highestSalary": 30000,
    "lowestSalary": 10000
  },
  "byLocation": [
    {
      "location": "Delhi",
      "totalJobs": 5,
      "averageSalary": 25000
    }
  ],
  "byCompany": [
    {
      "company": "ABC Technologies",
      "totalJobs": 5,
      "averageSalary": 26000
    }
  ],
  "bySkill": [
    {
      "skill": "Node.js",
      "totalJobs": 7,
      "averageSalary": 27500
    }
  ]
}
```

> Work through questions 1–15 first, then attempt questions 16–25 without looking up the solution. This gives better aggregation practice than memorizing `$group` syntax.
