const { port } = require('./config');
const path = require('path');

const app = require('fastify')({
  logger: true,
});

app.register(require('fastify-static'), {
  root: path.join(__dirname, '../public'),
  prefix: '/view/', // optional: default '/'
});

app.register(require('fastify-cookie'), {
  secret: 'my-secret', // for cookies signature
  parseOptions: {}, // options for parsing cookies
});

app.get('/', async (req, res) => {
  // res.header('Set-Cookie', 'name=demo-user; HttpOnly;');
  res.redirect('/view/');
});

/**
 * ============= Demo SameSite #1 ====================
 */

app.post('/demo/login', async (req, res) => {
  const { user = '' } = req.body;
  switch (user.toLowerCase()) {
    case 's1':
      res.header('Set-Cookie', 'name=User S1; HttpOnly;');
      break;
    case 's2':
      res.header('Set-Cookie', 'name=User S2; HttpOnly; SameSite=Strict;');
      break;
    case 's3':
      res.header('Set-Cookie', 'name=User S3; HttpOnly; SameSite=Lax;');
      break;
    case 's4':
      res.header('Set-Cookie', 'name=User S4; HttpOnly; SameSite=None; Secure;');
      break;
  }

  res.redirect('/demo');
});

app.get('/demo', async (req, res) => {
  const { name } = req.cookies;
  if (name) {
    return res.code(200).send({ message: `Welcome ${name} !!!` });
  }

  return res.code(401).send({ message: '401 Unauthorized' });
});

/////////////////////////////////////////////////////////

/**
 * ============= Demo SameSite #1 ====================
 */

app.post('/demo/s2/login', async (req, res) => {
  res.header('Set-Cookie', 'name=user-s1; HttpOnly;');
  res.redirect('/demo/s1');
});

app.get('/demo/s2', async (req, res) => {
  const { name } = req.cookies;
  if (name) {
    return res.code(200).send({ message: `Welcome ${name} !!!` });
  }

  return res.code(401).send({ message: '401 Unauthorized' });
});

/////////////////////////////////////////////////////////

app.listen(port, (err, address) => {
  if (err) throw err;
  app.log.info(`server listening on ${address}`);
});
