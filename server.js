'use strict';
let koa = require('koa'),
  router = require('koa-router'),
  serve = require('koa-static'),
  parse = require('co-body'),
  views = require('co-views'),
  jwt = require('jsonwebtoken');

let app = koa();

let render = views(__dirname + '/views/', { default: 'jade' });

let secret = 'GREYSTONE';

app.use(serve(__dirname + '/public'));

app.use(function* auth(next) {

  let authHeader, token, elements, scheme;
  authHeader = this.get('Authorization');

  if (authHeader) {

    elements = authHeader.split(' ');
    if (elements.length === 2) {

      scheme = elements[0];
      if (scheme === 'Bearer') {

        token = elements[1];
        try {

          this.user = jwt.verify(token, secret);

        } catch(err){

        }

      }

    }

  }
  yield next;
});

app.use(router(app));

function isAuth() {

  return function*(next) {

    if (this.user && this.user.userid > 0) {
      yield next;
    } else {
      this.throw(401, 'Must be logged in to see this!')
    }

  }

}
// changed from /logs to /api/logs.  Page refresh at url /logs shouldn't hit
// this endpoint
app.get('/api/logs', isAuth(), function* logs() {

  this.body = [{
    id: 1,
    description: 'Started Job Process!',
    date: new Date() - 60000 * 50
  }, {
    id: 2,
    description: 'Completed Job Process!',
    date: new Date
  }];

});

// changed from /api to /api/authenticate.  to be consistent w/ logs endpoint
app.post('/api/authenticate', function* authenticate() {

  let body, claim;

  body = yield parse(this);

  if (body.username === 'james' && body.password === '123456') {

    claim = {
      userid: 1
    };
    this.body = {
      token: jwt.sign(claim, secret)
    };

  }
  else {
    this.throw(401, 'Wrong username or password!');
  }

});

app.get(/^.*$/, function* index() {
  // yield send(this, __dirname + '/index.html');
  this.body = yield render('index');
})

app.listen(4000);
