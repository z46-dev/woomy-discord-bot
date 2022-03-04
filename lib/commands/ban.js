// Import everything.
const Discord = require("discord.js");
const config = require("../config.json");
const util = require("../util.js");

module.exports = {
    run: async function(bot, message, args) {
        if (util.checkPermissions(message) < 1) return util.unauth(message);
        const user = message.mentions.users.first();
        if (user) {
            const member = message.guild.member(user);
            if (member) {
                let isStaff = member.roles.cache.some(r => [config.roles.moderator, config.roles.admin].includes(r.id));
                if (isStaff) return util.error(message, "You can't ban a staff member!");
                args.shift();
                const reason = args.join(" ") || "No reason";
                try {
                    await util.dm(bot, user.id, "You were banned: " + reason);
                } catch (e) {
                    console.log(e);
                }
                member.ban({
                    reason: args.join(" ")
                }).then(() => {
                    util.success(message, `Successfully banned ${user.tag}`);
                    util.log(bot, config.channels.moderationLogs, `**<@${message.member.id}> banned ${user.tag} for ${reason}**`);
                }).catch(err => {
                    util.error(message, 'I was unable to ban the member');
                });
            } else {
                util.error(message, "That user isn't in this server!");
            }
        } else {
            util.error(message, "You didn't mention the user to ban!");
        }
    },
    description: "Bans a user from the server.",
    usage: "ban <user ID or mention> <reason>"
};
