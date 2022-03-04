// Import everything.
const Discord = require("discord.js");
const config = require("../config.json");
const util = require("../util.js");

module.exports = {
    run: function(bot, message, args) {
        if (util.checkPermissions(message) < 2) return util.unauth(message);
        const amount = args[0];
        if (!amount || isNaN(amount) || amount < 2 || amount > 100) return util.error(message, "Please specify an amount to delete between 2 and 100.");
        message.delete().then(() => message.channel.bulkDelete(+amount).then(() => {
            util.info(message, `I have deleted ${amount} messages!`).then(msg => msg.delete({
                timeout: 3000
            }));
            util.log(bot, config.channels.moderationLogs, `**<@${message.member.id}> purged ${amount} messages in <#${message.channel.id}>**`);
        }));
    },
    description: "Deletes x messages from a channel.",
    usage: "purge <messages>"
};
