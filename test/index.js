'use strict';

const Lab = require('lab');
const Code = require('code');
const Server = require('../server');
let server;

// test shortcuts
const lab = exports.lab = Lab.script();
const before = lab.before;
const after = lab.after;
const describe = lab.describe;
const expect = Code.expect;
const it = lab.it;

// test data
const mockUsers = [
  {
    username: 'sricarde',
    events: [],
    gists: [],
  },
];

async function cleanDatabase(db) {

  await db.collection('users').remove({});
}

describe('Git4nStats API', () => {

  before(async () => {

    server = await Server.init();
    const db = server.app.db;

    // clean DB
    await cleanDatabase(db);

    // insert test data
    await db.collection('users').insertMany(mockUsers);
  });

  after(async () => {

    if (!server) {
      return;
    }

    await server.stop();
  });

  it('GET /users/', async () => {

    const response = await server.inject({
      method: 'GET',
      url: '/users'
    });

    expect(response.statusCode).to.equal(200);
    expect(response.result).to.equal(mockUsers);
  });
});