const {
  Client,
  Collection
} = require("discord.js");
const client = new Client({
  fetchAllMembers:true,
  disableMentions:"everyone"
});
const {
  readdir,
  readdirSync
} = require("fs");
const {
  blue,
  red,
  green
} = require("chalk");
const moment = require("moment");
moment.locale("tr");

const config = (client.config = require("./settings/config"));

client.commands = new Collection();
client.aliases = new Collection();

readdir("./src/commands", async(err, files) => {
  if(err) console.error(err);
  log(`${files.length} tane komut yüklenecek.`);
  files.forEach(async file => {
    const cmd = require(`./commands/${file}`);
    if(!cmd) console.log(red("[Error] Komut dosyasında bir hata var ile karşılaşıldı!"))
    client.commands.set(cmd.help.name, cmd);
    cmd.help.aliases.forEach(alias => client.aliases.set(alias, cmd.help.name));
  })
})

client.on("ready", async() => {
  client.user.setPresence({
    status:"idle",
    activity:{
      name:`${config.prefix}yardım`,
      type:"WATCHING"
    }
  })
  log("Bot hazır!");
})
client.on("message", async(message) => {
const botPrefix = config.prefix;
if (message.author.bot && message.channel.type === "dm") return;
if(!message.content.startsWith(botPrefix)) return;
if (message.content.startsWith(botPrefix)) {
const command = message.content.split(' ')[0].slice(botPrefix.length);
const args = message.content.slice(botPrefix.length).trim().split(/ +/g);
let cmd;
if (client.commands.has(command)) {
  cmd = client.commands.get(command);
} else if (client.aliases.has(command)) {
  cmd = client.commands.get(client.aliases.get(command));
}
if (cmd) {
  cmd.execute(client, message, args);
}
}
})

client.login(config.token).catch(error => console.log(red(error)));

function log(text){
  console.log(blue(`(${moment().format('YYYY-MM-DD HH:mm:ss')}) ${text}`))
}
