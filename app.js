const { createClient } = require('oicq')
const request = require('request');
const fs = require('fs');
const path = require('path')

app_config = {
    log_level: "info",
    platform: 5,
    auto_server: true,
    ignore_self: true,
    resend: true,
    cache_group_member: true,
    reconn_interval: 5,
    data_dir: path.join(process.cwd(), "data"),
}

const config_file = fs.readFileSync('config.json');
const config = JSON.parse(config_file);
const client = createClient(config.account, app_config)

if(config.password === "none") {
    client.on("system.login.qrcode", function (e) {
        //扫码后按回车登录
        process.stdin.once("data", () => {
          this.login()
        })
    }).login()
    client.on("system.online", () => console.log("Logged in!"))
}
else {
    client.on("system.login.slider", function (e) {
        console.log("输入ticket：")
        process.stdin.once("data", ticket => this.submitSlider(String(ticket).trim()))
    }).login(config.password)
}

client.on("message", msg => {
    message = msg.toString()
    if(message[0] === '!') {
        message.replace('!', ' ')
        request.post({url: 'https://cialloo.com/api/chatgpt', body: {'message': message}, json: true}, (err, res, body) => {
            let temp = ""
            for(let i = 2; i < body.message.length; i++)
                temp += body.message[i]
            msg.reply(temp, true)
        })
    }
})