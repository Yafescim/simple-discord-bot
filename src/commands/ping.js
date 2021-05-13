const Discord = require("discord.js");
module.exports.execute = async(client, message, args) => {
message.reply(`Pong! **${client.ws.ping}**`)
}
module.exports.help = {
    name:"ping",
    aliases:["delay"],
    usage:"ping",
    description:"Bot delay."
}