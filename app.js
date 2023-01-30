const { createClient } = require('oicq')
const request = require('request');
const fs = require('fs');

const config_file = fs.readFileSync('config.json');
const config = JSON.parse(config_file);
const client = createClient(config.account)

client.on("system.login.qrcode", function (e) {
    //扫码后按回车登录
    process.stdin.once("data", () => {
      this.login()
    })
}).login()
client.on("system.online", () => console.log("Logged in!"))

client.on("message.group", msg => {
    message = msg.toString()
    if(message[0] = '!') {
        message.replace('!', ' ')
        request.post({url: 'https://cialloo.com/api/chatgpt', body: {'message': message}, json: true}, (err, res, body) => {
            let temp = ""
            for(let i = 2; i < body.message.length; i++)
                temp += body.message[i]
            msg.reply(temp, true)
        })
    }
})