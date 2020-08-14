const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');

const secret = require('./token.json');

var prefix = '!';
var currentHelp = String(fs.readFileSync('./help.txt'));
var btd6maps = String(fs.readFileSync('./btd6maps.txt')).split('\n');
var btd6difficulties = String(fs.readFileSync('./btd6difficulties.txt')).split('\n');
var btd6standard = ["Easy", "Medium", "Hard"]
var isShamed = false;
var roomChannels = [];

client.on('ready', async () => {
    await client.user.setActivity('Type !help for a list of commands.');
});
client.on("message", msg => {
    if(msg.content.startsWith(':green_circle:')) return;
    if(roomChannels.indexOf(msg.channel) > -1) {
        roomChannels.forEach((room) => {if(room !== msg.channel) room.send(`:green_circle: ${client.users.cache.get(msg.author.id).username}: ${msg.content}`)});
    }
})
client.on('message', msg => {
    if (msg.author.bot) return;
    if (!msg.content.startsWith(prefix)) return;
    command = msg.content.slice(prefix.length).toLowerCase();
    if (command === "help") msg.channel.send(currentHelp);
    if (command === "bruh") msg.channel.send("bruhball");
    if (command === "tetris" && msg.guild && msg.guild.member('455460848635346975')) msg.channel.send("<@455460848635346975>, play Tetris!");
    if (command === "latin" && msg.guild && msg.guild.member('236326912195166208')) msg.channel.send("<@236326912195166208>, learn Latin!");
    if (/(^randombtd\s([A-Z])*)|(^randombtd\s?$)/.test(command)) {
        if (command.split(/\s/)[1]) var option = command.split(/\s/)[1].trim();
        if (option === "standard") msg.channel.send(`Random Bloons TD 6 Challenge (Standard Modes Only): ${btd6maps[Math.floor(btd6maps.length * Math.random())].trim()} ${btd6standard[Math.floor(btd6standard.length * Math.random())].trim()}`);
        else if (option === "chimps") msg.channel.send(`Random Bloons TD 6 CHIMPS Challenge: ${btd6maps[Math.floor(btd6maps.length * Math.random())].trim()} CHIMPS`);
        else msg.channel.send(`Random Bloons TD 6 Challenge: ${btd6maps[Math.floor(btd6maps.length * Math.random())].trim()} ${btd6difficulties[Math.floor(btd6difficulties.length * Math.random())].trim()}`);
    }
    if (/^publicshame\s[A-Z]*|^publicshame/.test(command) && !isShamed) {
        if (!msg.guild) msg.channel.send("You cannot shame a member in direct messages or groups.")
        else if (command === "publicshame") msg.channel.send("Usage: !publicshame (user)");
        else {
            memberID = command.split(/\s/)[1].trim().slice(3, -1);
            if (msg.guild.member(memberID)) {
                isShamed = true;
                var user = client.users.cache.get(memberID);
                client.user.setActivity(`${user.username} is an egg!`);
                user.send("You've been shamed!");
                setTimeout(() => { client.user.setActivity('Type !help for a list of commands.'), isShamed = false;}, 10000);
                }
            else {
                msg.channel.send("Not a valid user!")
            }
        }
    }
    else if (isShamed) msg.channel.send("Another person is being shamed right now.");
    if(command ==="entertheroom")
    {
        if(roomChannels.indexOf(msg.channel) < 0) msg.channel.send(":green_circle: This channel is now in the room."), roomChannels.push(msg.channel);
        else msg.channel.send("This channel is already in the room!");
    }
    if(command ==="leavetheroom") {
        if(roomChannels.indexOf(msg.channel) > -1) roomChannels.splice(roomChannels.indexOf(msg.channel),1), msg.channel.send(":red_circle: This channel is no longer in the room.");
        else msg.channel.send("This channel is not in the room!");
    }
    if(/^colorme\s[A-Z]*|^colorme/.test(command)) {
        if(!command.split(/\s/)[1]) msg.channel.send("Usage: !colorme (color code)");
        else {
            var colorNum = parseInt(`0x${command.split(/\s/)[1].toUpperCase()}`);
            try {
                var role = msg.guild.roles.create({data: {color: colorNum, position: msg.guild.member(msg.author.id).roles.highest.position+1}}).then(role =>msg.guild.member(msg.author.id).roles.add(role));
            }
            catch(err) {
                msg.channel.send("Not a valid color!");
            }
    }
    }
});
client.login(secret.token);
console.log('Bot is up and running.');