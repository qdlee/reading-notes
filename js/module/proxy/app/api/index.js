const Koa = require('koa');
const https = require('https');
const querystring = require('querystring');

const app = new Koa();

const host = 'testapi.blkee.com';

function request(path, params, method = 'POST') {
  return new Promise((resolve, reject) => {
    const postData = querystring.stringify(params);
    const options = {
      host,
      path,
      method,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData),
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1 MicroMessenger/6.10.5'
      }
    };
    const req = https.request(options, res => {
      resolve(res);
    });
    req.on('error', e => {
      reject(e);
    });
    req.write(postData);
    req.end();
  });
}

app.use(async (ctx, next) => {
  const res = await request(ctx.path, ctx.request.body);
  ctx.set('Content-Type', 'application/json;charset=utf-8');
  ctx.body = res;
});

module.exports = app;
