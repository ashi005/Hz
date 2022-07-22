/* Copyright (C) 2021 TENUX-Neotro.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
NEOTROX - TEENUHX
*/

const Neotro = require('../events');
const Heroku = require('heroku-client');
const Config = require('../config');
const config = require('../config');
const cosec = require('../cosec');
const {MessageType} = require('@adiwajshing/baileys');
const got = require('got');
const fs = require('fs');
const Db = require('./sql/plugin');
const Language = require('../language');
const Lang = Language.getString('_plugin');
const NLang = Language.getString('updater');

let msg = Config.LANG == 'SI' || Config.LANG == 'AZ' ? '*අනුමත කරනලද ප්ලගීනයකි..!* ✅' : '*Approved plugin.* ✅'
let inmsg = Config.LANG == 'SI' || Config.LANG == 'AZ' ? '*අනුමත නොකරණ ලද ප්ලගීනකි..!* ❌' : '*Not Approved Plugin.* ❌'

const heroku = new Heroku({
    token: cosec.HEROKU.API_KEY
});


let baseURI = '/apps/' + cosec.HEROKU.APP_NAME;

Neotro.addCommand({pattern: 'install ?(.*)', fromMe: true, desc: Lang.INSTALL_DESC, warn: Lang.WARN}, (async (message, match) => {
    if (match[1] === '') return message.client.sendMessage(config.LOG, { text:Lang.NEED_URL + '.install https://gist.github.com/Neotro23/4232b1c8c4734e1f06c3d991149c6fbd'})
    try {
        var url = new URL(match[1]);
    } catch {
        return message.client.sendMessage(config.LOG, { text:Lang.INVALID_URL});
    }
    
    if (url.host === 'gist.github.com') {
        url.host = 'gist.githubusercontent.com';
        url = url.toString() + '/raw'
    } else {
        url = url.toString()
    }

    var response = await got(url);
    if (response.statusCode == 200) {
        // plugin adı
        var plugin_name = response.body.match(/addCommand\({.*pattern: ["'](.*)["'].*}/);
        if (plugin_name.length >= 1) {
            plugin_name = "." + plugin_name[1];
        } else {
            plugin_name = "." + Math.random().toString(36).substring(8);
        }

        fs.writeFileSync('./plugins/' + plugin_name + '.js', response.body);
        try {
            require('./' + plugin_name);
        } catch (e) {
            fs.unlinkSync('/root/queendianamd/plugins/' + plugin_name + '.js')
            return message.client.sendMessage(config.LOG, { text:Lang.INVALID_PLUGIN + ' ```' + e + '```'});
        }

        //await Db.installPlugin(url, plugin_name);
        message.client.sendMessage(config.LOG, { text: Lang.INSTALLED});
        if (!match[1].includes('Neotro23')) {
            await new Promise(r => setTimeout(r, 400));
            await message.client.sendMessage(config.LOG, { text: Lang.UNOFF});
        }
    }
}));
