var express = require('express');
var router = express.Router();
const { Zalo, LoginQRCallbackEventType } = require('zca-js');
const zalo = new Zalo();


let qr = null;
let api = null;

const listenMessage = (api) => {
  console.log('gọi hàm listenMessage');
  api.listener.on("message", (msg) => {
    console.log('có tin nhắn >>', msg);
    /* if (typeof msg.data.content == "string") {
      api
        .sendMessage(msg.data.content, msg.threadId, msg.type)
        .catch(console.error);
    } */
  });
}

const sendMessage = (api, msg) => {
  console.log('send message');
  api.sendMessage(msg.content, msg.threadId);
}

const hanldeLoginQR = async () => {
  api = await zalo.loginQR({}, (e) => {
    if (e.type === 0) {
      //base64
      qr = e.data.image;
    }

    if (e.type === LoginQRCallbackEventType.GotLoginInfo) {
      console.log("Đã đăng nhập!");
    }
    if (e.type === LoginQRCallbackEventType.QRCodeExpired) {
      console.log("qr hết hạn!");
      e.actions.retry();
    }
  });
  listenMessage(api);


  api.listener.start();
}

hanldeLoginQR();


/* GET home page. */
router.get('/', async function (req, res, next) {
  res.render('layout', { content: 'index' });
});


router.get('/loginqr', async function (req, res, next) {
  if (qr) {
    res.render('layout', { title: 'login QR', content: 'loginQR', qrImage: qr });
  }
  else
    res.send('chưa có qr');
})

router.post('/send-message', function (req, res, next) {
  /* const data = req['msg'];
  sendMessage(api, msg); */
  const { text } = req.body;
  console.log(text);
  const msg = {
    content: text,
    threadId: '8352540126248858899',
  };
  sendMessage(api, msg);
  res.send('gửi thành công');

})

module.exports = router;
