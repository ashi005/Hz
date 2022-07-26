//const evt = require('../events');
const // Config = require('../config');
const got = require('got');
const fs = require('fs');
//const Db = require('./sql/plugin');
const Language = require('../language');
const Lang = Language.getString('_plugin');
//var Plugdb = require('./sql/plugindb')
//let json = require('jsonfile');


/*

async function installlplugin( plugin_name , url){
try {

if (fs.existsSync('./sql/pluginbase.json')){
const pdl = require('./sql/pluginbase')
const plugindb = { 'name': plugin_name ,'url' : url } 
pdl.Plugins.push(plugindb);
json.writeFile('./sql/pluginbase.json', pdl);

}else{
  
const plugindb = { 'name': plugin_name ,'url' : url } 
Plugdb.Plugins.push(plugindb);
json.writeFile('./sql/pluginbase.json', Plugdb);
        
}

}catch{
    
const plugindb = { 'name': plugin_name ,'url' : url } 
Plugdb.Plugins.push(plugindb);
json.writeFile('./sql/pluginbase.json', Plugdb);
    
if (fs.existsSync('./sql/pluginbase.json')){
const pdl = require('./sql/pluginbase')
const plugindb = { 'name': plugin_name ,'url' : url }
 pdl.Plugins.push(plugindb);
json.writeFile('./sql/pluginbase.json', pdl);

}else{ 
  const plugindb = { 'name': plugin_name ,'url' : url }
  Plugdb.Plugins.push(plugindb);
  json.writeFile('./sql/pluginbase.json', Plugdb);
}
}

}

*/


evt.addCommand({pattern: 'pkg ?(.*)', fromMe: true, desc: "install plugins", usage: '.install https://gist.github.com/Quiec/cd5af0c153a613ba55c24f8c6b6f5565'}, (async (message, match) => {
    if (match[1] === '') return await message.client.sendMessage(message.jid , { text : '```Need url .install https://gist.github.com/Quiec/cd5af0c153a613ba55c24f8c6b6f5565```'})
    try {
        var url = new URL(match[1]);
    } catch {
        return await message.client.sendMessage(message.jid , { text : "invalid url🥲"});
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
        var plugin_name = response.body.match(/getCMD\({.*pattern: ["'](.*)["'].*}/);
        if (plugin_name.length >= 1) {
            plugin_name = "__" + plugin_name[1];
        } else {
            plugin_name = "__" + Math.random().toString(36).substring(8);
        }

        fs.writeFileSync('./plugins/' + plugin_name + '.js', response.body);
       try {
            require('./' + plugin_name);
        } catch (e) {
            fs.unlinkSync('./' + plugin_name);
            return await message.client.sendMessage(message.jid , { text : "Invalid plugin \n" + ' ```' + e + '```'});
        }

      
      //  await installlplugin( plugin_name , url)
       
         await message.client.sendMessage(message.jid,  { text:  'plugin add to data base' });
       await message.client.sendMessage(message.jid, { text: 'plugin installed' });
                   console.log('plugin add to data base')                                      
     
       
    }
}));
