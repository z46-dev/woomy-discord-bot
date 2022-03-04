// General Requires
const Discord = require("discord.js");
const config = require("./config.json");
const util = require("./util.js");

function load(bot, id) {
    return new Promise((resolve, reject) => {
        bot.channels.cache.get(id).messages.fetch().then(response => {
            let output = [];
            response.forEach(message => {
                if (message.member.id === bot.user.id) {
                    output.push({
                        id: message.id,
                        content: message.content
                    });
                }
            });
            resolve(output);
        });
    });
}

function deleteEntry(bot, channel, id) {
    return new Promise((resolve, reject) => {
        bot.channels.cache.get(channel).messages.delete(id).then(() => resolve(true)).catch(reject);
    });
}

function makeEntry(bot, channel, content) {
    bot.channels.cache.get(channel).send(content);
}

module.exports = {
    load,
    deleteEntry,
    makeEntry
}
