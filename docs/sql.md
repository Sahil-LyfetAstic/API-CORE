
# SQL Databases

[Back to docs](./index.md)


## Config

- Set SQL database config as env variables. *Eg: add below env variables to .env file (Not recommended in production)*
  - ``` DATABASE_HOST=localhost ```
  - ``` DATABASE_PORT=3306 ``` 
  - ``` DATABASE_USERNAME=root ``` 
  - ``` DATABASE_PASSWORD= ``` 
  - ``` DATABASE_NAME=db_name ``` 
- Additional config can be done in ``` libs\sql\src\sql.config.ts ```
  - Enable query logs -  ``` logging: true ``` OR add env ``` DATABASE_LOGGING=Y ```
  - Create tables automatically -  ``` synchronize: true ``` 
  - Alter tables with field changes *(Not recommended in production)* -  ``` sync.alter: true ``` OR add env ``` DATABASE_ALTER_SYNC=Y ```  

## References
- <a target="_blank" href="https://sequelize.org/master/">Sequelize (SQL ORM)</a>
- <a target="_blank" href="https://github.com/RobinBuschmann/sequelize-typescript">Sequelize TypeScript</a>
- <a target="_blank" href="https://docs.nestjs.com/techniques/database#sequelize-integration">Sequelize Nest JS</a>