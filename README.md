# git4nstats
test for s4n

## Setup

This project needs Node (version >= 8) installed on your machine.

- Download this project to your computer
- run `npm i`
- run `npm test`

Thanks and happy coding!

## Run
To run the server use the follow command
```sh
$ node server.js
```
You can use curl or postman to access of the POST(application/json) endpoint [http://localhost:3000/users] and send an object with a users property and set an array with the github users to request:

```sh
$ curl -d '{"users": [ "jsricarde" ] }' -H "Content-Type: application/json" -X POST http://localhost:3000/users
```

## Framework and APIs reference

- Hapi:

    https://hapijs.com/tutorials

    https://hapijs.com/api
    
- MongoDB driver for Node:

    http://mongodb.github.io/node-mongodb-native/3.1/quick-start/quick-start/
    
    
[http://localhost:3000/users]: <http://localhost:3000/users>
