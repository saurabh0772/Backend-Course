Quick Cheat Sheet

| Operator | Meaning                   | Example                 |
| -------- | ------------------------- | ----------------------- |
| `$in`    | Any of these values       | Delhi OR Mumbai         |
| `$nin`   | None of these values      | NOT Delhi/Mumbai        |
| `$and`   | All conditions true       | Active AND salary > 50k |
| `$or`    | Any condition true        | Delhi OR salary > 1L    |
| `$gte`   | `>=`                      | salary >= 50k           |
| `$lte`   | `<=`                      | salary <= 80k           |
| `$all`   | Array contains ALL values | Node.js AND MongoDB     |












runValidators: true 
in updation, it does not validate inputs again as per schema, so to do this , put runvalidators at the end