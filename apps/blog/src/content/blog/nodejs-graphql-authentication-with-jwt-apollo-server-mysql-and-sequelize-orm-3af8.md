---
title: "Nodejs GraphQl Authentication with JWT, Apollo-server, MySql and Sequelize ORM."
description: "For past few years we have witnessed the growth of Microservice architecture at a whole different..."
pubDate: "2022-07-24"
heroImage: "./_assets/devto/nodejs-graphql-authentication-with-jwt-apollo-server-mysql-and-sequelize-orm-3af8/cover.webp"
tags: ["node", "javascript", "mysql", "graphql"]
category: "engineering"
---

> Originally published on [Dev.to](https://dev.to/foxy17/nodejs-graphql-authentication-with-jwt-apollo-server-mysql-and-sequelize-orm-3af8).

For past few years we have witnessed the growth of Microservice architecture at a whole different level.It focuses on developing software systems that tries to focus on building single-function modules with well-defined interfaces and operations. Along with it we have also seen a massive growth of Agile, Devops and APIs. Until few years back REST APIs were the industry standard and hot topic but in 2015 Facebook introduced GraphQL and in 2018 they released the first stable version of it.

Github Repo - [GraphQL Authentication](https://github.com/foxy17/GraphQl-Authentication)

In this article, we’ll focus on local authentication with JWT token.For database you can use any MySql database.Apollo-server is an open-source GraphQL server that is compatible with any kind of GraphQL client.I will use apollo to expose the API insted of express.

We will be making a simple authentication in which a user will have a first name, last name, email, password, company and unique employeeId. Company will be stored on another table so that we can explore fetching associations with GraphQL. Lets install the necessary packages first:

`npm i apollo-server bcrpytjs dotenv jsonwebtoken sequelize mysql2 graphql`

`npm i -D sequelize-cli nodemon`

```
const getUser = token => {
    try {
        if (token) {
            return jwt.verify(token, JWT_SECRET)
        }
        return null
    } catch (error) {
        return null
    }
}
```

This is the first line after the imports, this is how we have defined out JWT middle-ware which will verify if our JWT token is valid.

```
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
        const token = req.get('Authorization') || ''
        return { user: getUser(token.replace('Bearer', ''))}
    },
    introspection: true,
    playground


: true
})
server.listen({ port: PORT || 8080 }).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
```

After this we define our Apollo server which we have to pass an object which contains:

1. *typeDefs*: which is the schema for the graphQL API, it defined the query and mutations we can call on the API.

2. *resolvers*: these are functions which are responsible for returning a result for respective API calls.

3. *context*: it is an object shared by all the resolvers of a specific execution.This is where we retrieve the JWT token from header and run the getUser function we defined earlier to check if its valid and store the result in user variable which can be accessed by any resolver.

4. *introspection*: it defines whether we can query the schema for information about what queries it supports and their structure.(usually false in production)

5. *playground*: is a graphical, interactive, in-browser GraphQL IDE we can use to run queries.

Lets checkout our typeDefs or Schema.
```
const typeDefs = gql`
    input Pagination {
        page: Int!
        items: Int!
    }
    input UserFilter {
        employeeId: Int
        firstName: String
        lastName: String
    }
    type User {
        employeeId: Int!
        firstName: String!
        lastName: String!
        password: String!
        email: String!
        company: String!
    }
    type AuthPayload {
        token: String!
        user: User!
    }
    type Query {
        getUserList(search:UserFilter, pagination:Pagination, sort:String): [User]
    }
    type Mutation {
        registerUser(firstName: String!, lastName: String!, employeeId: Int!, email: String!, password: String!, company: String!): AuthPayload!
        login (email: String!, password: String!): AuthPayload!
    }
`
```

The `gql` template literal tag can be used to concisely write a GraphQL query that is parsed into a standard GraphQL [AST](https://stackoverflow.com/questions/46163036/what-is-ast-in-graphql/46164403). `type` defines a object with its parameters. The `!` mark means that the parameters are compulsory and cannot be undefined or null. There are two distinct types, query and mutation. In simple words the query is SELECT statement and mutation is INSERT Operation.
![Breaking down a mutaion](./_assets/devto/nodejs-graphql-authentication-with-jwt-apollo-server-mysql-and-sequelize-orm-3af8/image-1.webp)

Apart from scalar types of `String, Int, Float, Boolean, and ID` which we can directly assign as a type to argument or parameter we can have our own defined complex types as input. For that we use the input tag. The `UserFilter` input is a custom input which is being passed to get user list query. The `[User]` means that an array of type Users will be returned.

All this was the main crust of GraphQL whats left now is the database models which will change according to your database choice and the resolver functions which are just like functions you define for REST API on a specific route.Lets look at the sequelize models.

```
//User.js
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        firstName: { type: DataTypes.STRING, allowNull: true },
        lastName: { type: DataTypes.STRING, allowNull: true },
        email: { type: DataTypes.STRING, allowNull: false, unique: true },
        password: {type: DataTypes.STRING,allowNull: false},
        employeeId:{ type: DataTypes.INTEGER, allowNull: false, primaryKey: true, unique: true },
    }, {timestamps: false,
        hooks: {
            beforeCreate: async (user) => {
             if (user.password) {
              const salt = await bcrypt.genSaltSync(10, 'a');
              user.password = bcrypt.hashSync(user.password, salt);
             }
            },
            beforeUpdate:async (user) => {
             if (user.password) {
              const salt = await bcrypt.genSaltSync(10, 'a');
              user.password = bcrypt.hashSync(user.password, salt);
             }
            }
           }
    });
    User.associate = function (models) {
        User.hasOne(models.Company, { foreignKey: "employeeId" });
      };
    User.validPassword = async (password, hash) => {
        return await bcrypt.compareSync(password, hash);
       }
    return User;
  };
//Company.js
module.exports = (sequelize, DataTypes) => {
    const Company = sequelize.define('Company', {
        company: {type: DataTypes.STRING,allowNull: false},
        employeeId:{ type: DataTypes.INTEGER, allowNull: false, primaryKey: true, unique: true },
    }, {
      timestamps: false,
      freezeTableName: true,
    });
    Company.associate = function (models) {
        Company.belongsTo(models.User, { foreignKey: "employeeId" });
      };
    return Company;
  };
```

`beforeCreate` is a hook is called when create query is being called. The hook contains logic to hash the password with a salt so that we don’t store un-encrypted password in database. `beforeUpdate` this hook is called when update query is being called on user table. Just as before it hashesh the updated password. `User.validPassword` is a class Methods which users bcrypt to compare the hash stored in db against a string to check if both are same. `User.associate` is one-to-one association with company table with employeeId foreign key.`Timestamp:false` by default sequelize includes a `createdAt` and `updateAt` record in SQL table but this sets that to false. `freezeTableName` by defaults sequelize makes the table name plural which results in errors unless we have them set like that by default. Since I am not doing that `freezeTableName` helps me keep the table names exactly what I have defined and not changed the **User to Users** or **Company to Companies**. Index.js is just the default seqelize files to connect to database. It also takes all the models defined in the models folder, and it applies them to the “db” object.

```
const resolvers = {
    Query: {
        async getUserList(root, args, { user }) {
            try {
                if(!user) throw new Error('You are not authenticated!')
                const {search,pagination,sort} =args;
                var query={
                    offset:0,
                    limit:5,
                    raw: true,
                    //this is done to flaten out the join command
                    attributes: ['firstName','lastName','email','employeeId','Company.company',],
                    include: [{ model: models.Company,attributes:[]}]
                    }
                    //by defaults query is paginated to limit 5 items
                if(pagination){
                    query.limit=pagination.items;
                    query.offset=pagination.items*(pagination.page-1)
                }
                if(search){
                    query.where={
                        [Op.or]: [
                            search.firstName?{ firstName: search.firstName }:null,
                            search.lastName?{ lastName: search.lastName}:null,
                            search.employeeId?{ employeeId: search.employeeId}:null
                        ] 
                    }
                }
                if(sort){
                    query.order= [
                        [sort, 'ASC'],
                    ];
                }
                return await models.User.findAll(query);
            } catch (error) {
                throw new Error(error.message)
            }
        }
    },

    Mutation: {
        async registerUser(root, { firstName, lastName, email, password, employeeId,company }) {
            try {
                const userCheck = await models.User.findOne({ 
                    where: { 
                        [Op.or]: [
                            { email: email },
                            { employeeId: employeeId }
                    ] 
                }})
                if (userCheck) {
                    throw new Error('Email or Employee id already exists')
                }
                const user = await models.User.create({
                    firstName,
                    lastName,
                    employeeId,
                    email,
                    password
                })
                const companyModel = await models.Company.create({
                    employeeId,
                    company
                })
                const token = jsonwebtoken.sign(
                    { employeeId: user.employeeId, email: user.email},
                    process.env.JWT_SECRET,
                    { expiresIn: '1y' }
                )
                let createdUser={
                    company:companyModel.company,
                    employeeId: user.employeeId,
                    firstName: user.firstName, 
                    lastName: user.lastName, 
                    email: user.email
                }

                return {
                    token, user:createdUser, message: "Registration succesfull"
                }
            } catch (error) {
                throw new Error(error.message)
            }
        },

        async login(_, { email, password }) {
            try {
                const user = await models.User.findOne({ where: { email }})

                if (!user) {
                    throw new Error('No user with that email')
                }
                const isValid = await models.User.validPassword(password, user.password)
                if (!isValid) {
                    throw new Error('Incorrect password')
                }

                // return jwt
                const token = jsonwebtoken.sign(
                    { employeeId: user.employeeId, email: user.email},
                    process.env.JWT_SECRET,
                    { expiresIn: '1d'}
                )
                
                return {
                   token, user
                }
            } catch (error) {
                throw new Error(error.message)
            }
        }

    },
}
```
Resolvers contain the functions that are called for respective query and mutation. They take in 4 arguments
1. `root` contains the result returned from the resolver on the parent field.
2. `args` arguments passed into the field in the query.
3. `context` object shared by all resolvers in a particular query.
4. `info` contains information about the execution state of the query.

The `query` object in `getUserList` is a dynamic object which changes values based on arguments passed to the query. All arguments are optional. All queries require an Authorization header with valid jwt token. This is being validated by the
`if(!user) throw new Error(‘You are not authenticated!’)`

This is user variables is being retrieved from context which we passes earlier in server.js. If we don’t want a route to be authenticated we just have to get rid of this line. Lets get the basic query explained. `offset` and `limit` are the pagination parameters. `raw` is used to return a JSON object instead of a sequelize object so that it is easier to parase. Attributes lets us define what columns we want to be returned from SQL. Include is how we apply join between Company and User table so that we cant fetch the company name for a particular user. You will notice that we have set the attributes for include as empty. This means although they will be returned in query they will not be displayed. They would look something like this if returned `{Company.company:"name",Company.employeeId:2}` and this throws and error when we try to parase it using graphQL schema since there we have defined the User to have company key and not `Company.company` as the key. Thus to solve this we select `’Company.company’` as an attribute of user which gets mapped to the company.

```
{
“Authorization”:”eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZUlkIjoyLCJlbWFpbCI6ImJAZ21haWwuY29tIiwiaWF0IjoxNjIyNTMwNTAyLCJleHAiOjE2MjI2MTY5MDJ9.3qQOHPzhKOjM6r5JNRWoMsvyt2IzwX8aa7Bj7s1zEZw”
}
```
