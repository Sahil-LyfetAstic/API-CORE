
# MongoDB

[Back to docs](./index.md)


## Config

- Set mongo db config as env variables. *Eg: add below env variables to .env file (Not recommended in production)*
  - ``` MONGO_URI=mongodb://localhost/db_name ```
  - Enable query logging ``` MONGO_LOGGING=Y ``` 
- Additional config can be done in ``` libs\mongo\src\mongo.config.ts ```


## References
- <a target="_blank" href="https://mongoosejs.com/">Mongoose (MongoDB)</a>
- <a target="_blank" href="https://docs.nestjs.com/techniques/mongodb">Mongoose Nest JS</a>