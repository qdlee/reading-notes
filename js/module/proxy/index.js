const Koa = require('koa');
const mount = require('koa-mount');
const body = require('koa-body');
const Router = require('koa-router');
const log4js = require('log4js');
const session = require('koa-session2');
const fs = require('fs');
const path = require('path');
const PassThrough = require('stream').PassThrough;
const send = require('koa-send');
const serve = require('koa-static');

const config = require('./app/utils/config');

const router = new Router();

const api = require('./app/api');

log4js.configure({
  appenders: [
    {
      type: 'file',
      filename: 'logs/cat.log',
      category: 'cat'
    }
  ]
});

const logger = log4js.getLogger('cat');
logger.setLevel('ERROR');

router.post('/echo', (ctx, next) => {
  ctx.body = ctx.request.body;
});
router.get('/echo', (ctx, next) => {
  ctx.body = ctx.request.query;
});

const app = new Koa();

app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  ctx.set('Access-Control-Allow-Headers', 'accept, Content-Type');
  await next();
});

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    logger.error('server error', err);
    ctx.body = { message: err.message };
    ctx.status = err.status || 500;
  }
});

app.use(
  body({
    multipart: true,
    formidable: {
      uploadDir: path.resolve(__dirname, 'files')
    }
  })
);

app.use(router.routes());
app.use(router.allowedMethods());
app.use(mount('/api', api));
app.use(async ctx => {
  if ('/' == ctx.path) {
    ctx.path = '/index.html';
  }
  await send(ctx, ctx.path, { root: __dirname + '/views' });
});
app.on('error', function(err, ctx) {
  logger.error('server error', err);
});

app.listen(config.server.port);
console.log('listening port ', config.server.port);
