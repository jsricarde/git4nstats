const Hapi = require('hapi');
const MongoClient = require('mongodb').MongoClient;
const Boom = require('boom');
var fetch = require("node-fetch");


const GITHUB_URL = 'https://api.github.com/';

const server = Hapi.server({
  port: 3000,
  debug: {
    request: [ '*' ]
  }
});
const routes = [
  {
    method: 'POST',
    path: '/users',
    handler: async (request, h) => {

      const db = server.app.db;
      const usersCollection = db.collection('users');

      let documents = []
      documents = await getData(request);
      usersCollection.insertMany(documents, (err, result) => {
        if (err) {
          console.log(err);
          return Boom.internal('Internal MongoDB error', err)
        };
      });
      return documents;
    }
  },
];

async function getGithubInfo(user) {
  const userData = { username: user };
  userData.events = await getEvent(user)
  userData.gists = await getGist(user)
  return userData;
}

async function getData(request) {
  const { payload } = request;
  let data = payload.users.map(await getGithubInfo);
  data = Promise.all(data)
  return data
}


async function getEvent(user) {
  return new Promise(async (resolve, reject) => {
    try {
      var res = await fetch(`${GITHUB_URL}users/${user}/events`);

      if (res && res.ok) {
        let records = await res.json();
        resolve(cutList(records, 5))
      }
    }
    catch (err) {
      reject(err)
    }
  });
}



async function getGist(user) {
  return new Promise(async (resolve, reject) => {
    try {
      var res = await fetch(`${GITHUB_URL}users/${user}/gists`);

      if (res && res.ok) {
        let records = await res.json();
        resolve(cutList(records, 3))
      }
    }
    catch (err) {
      reject(err)
    }
  });
}

function cutList(list = [], number = 0) {
  return JSON.stringify(list.slice(0, number));
}

const init = async () => {

  // connect to DB
  //     url: "mongodb://dbuser:12345678Aa@ds263590.mlab.com:63590/picx_db",

  const url = 'mongodb://dbuser:12345678Aa@ds263590.mlab.com:63590/picx_db';
  const client = new MongoClient(url, { useNewUrlParser: true });
  await client.connect();

  const db = client.db();
  server.app.db = db;

  console.log("Connected successfully to mongo");

  // routes configuration
  server.route(routes);

  try {
    if (!module.parent) {
      await server.start();
    }
    else {
      await server.initialize();
    }
    return server;
  }
  catch (error) {
    console.error(error);
    process.exit(1);
  }
};

process.on('unhandledRejection', (err) => {

  console.log(err);
  process.exit(1);
});

void async function () {
  if (!module.parent) {
    await init();
  }
}();

module.exports = {
  init
}