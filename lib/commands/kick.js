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
                if (isStaff) return util.error(message, "You can't kick a staff member!");
                args.shift();
                const reason = args.join(" ") || "No reason";
                try {
                    await util.dm(bot, user.id, "You were kicked: " + reason + "\nhttps://discord.gg/" + await message.channel.createInvite({ unique: true }));
                } catch (e) {
                    console.log(e);
                }
                member.kick(args.join(" ")).then(() => {
                    util.success(message, `Successfully kicked ${user.tag}`);
                    util.log(bot, config.channels.moderationLogs, `**<@${message.member.id}> kicked ${user.tag} for ${reason}**`);
                }).catch(err => {
                    util.error(message, 'I was unable to kick the member');
                });
            } else {
                util.error(message, "That user isn't in this server!");
            }
        } else {
            util.error(message, "You didn't mention the user to kick!");
        }
    },
    description: "Kicks a user from the server.",
    usage: "kick <user ID or mention> <reason>"
};
