const evt = require('../events');



  evt.addCommand({pattern: 'start$', fromMe: true, deleteCommand: false, desc: "ping pong 📨"}, (async (message, match) => {

 await message.client.sendMessage(message.jid, { text: 'hi hello' }) 

}));
//conn.user.id
