
# Form Validations

[Back to docs](./index.md)

### Basic validations

- [class-validator](https://github.com/typestack/class-validator#usage)
  ```js
  @Table
  export class Demo {
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(200)
    num_field: number;
    
    @IsString()
    name: string;

    ...
  } 
  ```

- ValidateIf (Ignore the validators on a property when the provided condition function returns false)
  ```js
  @Table
  export class Demo {
    @IsString()
    type: string;

    @ValidateIf((o) => o.type === 'message') // body object can be accessed from first argument
    @IsString()
    message: string;

    @ValidateIf((o, v) => o.type === 'image' && typeof v !== 'undefined') // second argument will be the value of active field
    @IsString()
    image: string;

    ...
  }
  ```

### Custom validations
- Validate by comparing another field value
  ```js
  import { IsEqual, IsGreaterThan, IsGreaterThanEqual } from 'src/core/decorators/validation.decorator';

  @Table
  export class Demo {
    // validate min and max number fields
    @IsInt()
    @IsPositive()
    min_amount: number;

    @IsInt()
    @IsPositive()
    @IsGreaterThan('min_amount', {
      message: 'Maximum amount should be greater than minimum amount',
    })
    max_amount: number;

    // validate start and end dates
    @IsDateString()
    start_date: Date;

    @IsDateString()
    @IsGreaterThanEqual('start_date')
    end_date: Date;

    // validate confirm password
    @IsString()
    password: string;

    @IsString()
    @IsEqual('password', {
      message: 'Passwords doesn\'t match',
    })
    confirm_password: string;

    ...
  }
  ```

### Unique field validations
- Unique value for a field
  ```js
  import { IsUnique } from '@core/sql/sql.unique-validator';
  // OR 
  // import { IsUnique } from '@core/mongo/mongo.unique-validator';

  @Table
  export class User {
    // unique field
    @IsString()
    @IsEmail()
    @IsUnique('User')
    email: string;
    ...
  }
  ```
- Unique value for a field (custom options)
  ```js
  import { IsUnique } from '@core/sql/sql.unique-validator';
  // OR 
  // import { IsUnique } from '@core/mongo/mongo.unique-validator';

  @Table
  export class Product {
    // unique field
    @IsString()
    @IsUnique({
      modelName: 'Product',
      options: {
        paranoid: false, // also include deleted records
        ... // other find options
      },
    })
    name: string;
    ...
  }
  ```
- Unique value for a field (combination with another field)
  ```js
  import { IsUnique } from '@core/sql/sql.unique-validator';
  // OR 
  // import { IsUnique } from '@core/mongo/mongo.unique-validator';

  @Table
  export class Product {
    // unique field
    @IsString()
    @IsUnique({
      modelName: 'Product',
      options(args: ValidationArguments) {
        const product = args.object as Product;
        return {
          where: {
            name: product.name,
            category_id: product.category_id, // check if same `name` with same `category_id` exists
          },
          ... // other find options
        };
      },
    })
    name: string;

    @IsString()
    category_id: number;
    ...
  }
  ```

### References
- <a target="_blank" href="https://github.com/typestack/class-validator">class-validator</a>
- <a target="_blank" href="https://docs.nestjs.com/techniques/validation">Nest JS validation</a>