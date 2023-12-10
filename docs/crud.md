
# CRUD

[Back to docs](./index.md)


## Query Parameters

- ### ```offset``` 
  (```integer```) - No of records to skip
  - ```offset: 0```  default
  - ```offset: 25```  skip first 25 records

- ### ```limit``` 
  (```integer```) - No of records to fetch
  - ```limit: 10```  default
  - ```limit: 25```  fetch 25 records
  - ```limit: -1```  fetch all records (Max 1000)

- ### ```search``` 
  (```string```) - Query string to search
  - ```search: 'search text'```  return records matching search keywords
  
- ### ```select``` 
  (```JSON string - Array```) - Specify fields to select
  - Select id and name fields, ignore other fields
    ```json
    ["id", "name"]
    ```
  - Specify select fields from populated tables
    ```json
    ["id", "name", "table1.id", "table1.title"]
    ```
  
- ### ```where``` 
  (```JSON string - Object```) - Filters for where conditions
  - Basic filters
    ```json
    {
      "field_1": "value",
      "field_2": true,
      "field_3": null
    }
    ```
  - Advanced filters
    ```json
    {
      "field_1": { "$ne": "value" },
      "field_2": { "$gte": 5, "$lte": 10 },
      "field_3": { "$in": [1, 2], "$nin": [3, 4] }
    }
    ```
  - Filters on joined tables 
    ```json
    {
      "$table_1.field_1$": "value",
      "$table_1.field_2$": { "$gte": 5, "$lte": 10 },
      "$table_2.field_3$": { "$in": [1, 2] }
    }
    ```

- ### ```populate``` 
  (```JSON string - Array```) - Associations to include/join
  - Direct relations
    ```json
    ["table_1", "table_2"]
    ```
  - Nested relations
    ```json
    ["table_1", "table_1.child_table_1", "table_1.child_table_2"]
    ```
  - Required relations (suffix ```*```) - return only if relation also exist
    ```json
    ["table_1*"]
    ```
  - Include soft deleted relations (prefix ```+```) - return relation even if deleted
    ```json
    ["+table_1", "+table_2*"]
    ```
  - Fetch relation using separate query  (prefix ```-```) - use separate query to fetch relations (works only for hasMany relation)
    ```json
    ["-table_1", "+-table_1"]
    ```

- ### ```sort``` 
  (```JSON string - Array```) - field(s) to sort the results
  - Sort by single field
    ```json
    ["field_1"]
    ```
  - Sort by multiple fields
    ```json
    ["field_1", "field_2"]
    ```
  - Sort direction
    ```json
    [["field_1", "desc"], ["field_2", "asc"]]
    ```
  - Sort by association table's field
    ```json
    [["table_1", "field_1", "desc"]]
    ```