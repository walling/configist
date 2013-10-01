# Easy deployment configuration

With **configist** you get the possibility to configure your application in various ways (in precedence order):

 * `config` in `package.json`
 * `config:{environment}` in `package.json`
 * environment variables
 * command line arguments
 * custom objects

Let's say the configuration is like this:

```javascript
// package.json
{
  "config": {
    "listen": "127.0.0.1:5000"
  },
  "config:development": {
    "db": "mongodb://localhost"
  },
  "config:production": {
    "listen": "0.0.0.0:80",
    "db": "mongodb://db1.example.net:2500"
  }
}
```

Basic usage:

```javascript
var config = require('configist')().use(require('./package.json'));

console.log(config);
```

Output when NODE_ENV=development (or not given):

```
{ listen: '127.0.0.1:5000',
  db: 'mongodb://localhost',
  env: 'development' }
```

Output when NODE_ENV=production:

```
{ listen: '0.0.0.0:80',
  db: 'mongodb://db1.example.net:2500',
  env: 'production' }
```

You can change the configuration dynamically. The commands are all equivalent and sets the `listen` parameter:

```bash
node . --listen=:3000
npm start --listen=:3000
LISTEN=:3000 node .
LISTEN=:3000 npm start
```

You can load multiple configurations:

```javascript
var configist = require('configist')();

configist.use(null, {
  base_url: 'http://example.com'
});
configist.use(require('./package.json'));
configist.use(require('./client-side/package.json'));
configist.use('development', {
  shared_secret: 'sg4lWb15Lt7OZYR/yyly3S1HrVou1xMN'
});

console.log(configist);
```
