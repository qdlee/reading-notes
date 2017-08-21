const https = require('https');
const fs = require('fs');
const zlib = require('zlib');
const cheerio = require('cheerio');

const communityList = [];
let page = 1;
const maxPage = 116;

function getCommunity() {
  const path = `/community/p${page}/`;
  https
    .get(
      {
        host: 'jinan.anjuke.com',
        path,
        headers: {
          cookie: 'lps=http%3A%2F%2Fjinan.anjuke.com%2Fcommunity%2F%7C; ctid=23; sessid=D84098A4-1125-3E17-ABD2-18DCC3B24C06; __xsptplusUT_8=1; als=0; aQQ_ajkguid=E243179B-B5ED-7852-5870-166159448E01; twe=2; __xsptplus8=8.1.1501652530.1501652754.7%234%7C%7C%7C%7C%7C%23%23ry5zghONdO0hn4P51iy0CKu0yixl6Bk8%23; 58tj_uuid=252a8d20-c437-4aee-ba17-e2f249ad5398; new_session=0; init_refer=; new_uv=1',
          accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
          'accept-encoding': 'gzip, deflate, br',
          'accept-language': 'zh-CN,zh;q=0.8',
          referer: 'https://jinan.anjuke.com/community/p12/',
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36'
        }
      },
      res => {
        const code = res.statusCode;
        const bufs = [];
        res.on('data', d => {
          bufs.push(d);
        });

        res.on('end', () => {
          const buf = Buffer.concat(bufs);
          const dd = zlib.gunzipSync(buf);
          const $ = cheerio.load(dd);

          $('.li-itemmod .li-info').each((i, item) => {
            const name = $(item).find('h3 a').text();
            const address = $(item).find('address').text();
            communityList.push({
              name,
              address
            });
          });
          page += 1;
          console.log(page, communityList.length);
          if (page > maxPage) {
            fs.writeFileSync('./result.json', JSON.stringify(communityList));
            console.log('已完成');
          } else {
            getCommunity();
          }
        });
      }
    )
    .on('error', error => {
      console.log(error.message);
    });
}

getCommunity();
