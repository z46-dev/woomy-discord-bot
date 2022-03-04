/*
* Utility functions that help us out a lot.
* These functions range from simple logs to permission checks.
*/

// General Requires
const Discord = require("discord.js");
const config = require("./config.json");

// Basic logging. Needs the bot to reference, channel ID and a message to send.
function log(bot, channelID, message, color = "#999999") {
    const channel = bot.channels.cache.get(channelID);
    console.log(new Date() + " : " + message);
    if (!channel) {
        console.log("Unable to get channel:", channelID);
        return;
    }
    const embed = new Discord.MessageEmbed()
        .setTitle(new Date())
        .setColor(+(`0x${color.replace("#", "")}`))
        .setDescription(message)
    return channel.send(embed);
};

// Util functions that work for messages.

function unauth(message) {
    const embed = new Discord.MessageEmbed()
        .setTitle("Unauthorized!")
        .setColor(0xC8C800)
        .setDescription("You are unauthorized to use this command.")
        .setFooter('Powered by Discord.js', 'https://i.imgur.com/wSTFkRM.png');
    return message.channel.send(embed);
};

function error(message, errorText) {
    const embed = new Discord.MessageEmbed()
        .setTitle("Uh, Oh!")
        .setColor(0xC80000)
        .setDescription(errorText)
        .setFooter('Powered by Discord.js', 'https://i.imgur.com/wSTFkRM.png');
    return message.channel.send(embed);
};

function success(message, content) {
    const embed = new Discord.MessageEmbed()
        .setTitle("Success!")
        .setColor(0x8abc3f)
        .setDescription(content)
        .setFooter('Powered by Discord.js', 'https://i.imgur.com/wSTFkRM.png');
    return message.channel.send(embed);
};

function info(message, content, fields = []) {
    const embed = new Discord.MessageEmbed()
        .setTitle("Info:")
        .setColor(0x8abc3f)
        .setDescription(content)
        .addFields(fields)
        .setFooter('Powered by Discord.js', 'https://i.imgur.com/wSTFkRM.png');
    return message.channel.send(embed);
};

// Gets the permission integer for the user who sent the message.
function checkPermissions(message) {
    let roles = message.member.roles.cache;
    for (let role in config.rolePermissions) {
        let permissions = config.rolePermissions[role];
        if (roles.some(r => r.id === role)) return permissions;
    }
    return 0;
};

function dm(bot, id, content) {
    const channel = bot.users.cache.get(id);
    const embed = new Discord.MessageEmbed()
        .setTitle("Info:")
        .setColor(0x8abc3f)
        .setDescription(content)
        .setFooter('Powered by Discord.js', 'https://i.imgur.com/wSTFkRM.png');
    return channel.send(embed);
};

module.exports = {
    log,
    error,
    checkPermissions,
    unauth,
    error,
    success,
    info,
    dm
};
