// Import everything.
const Discord = require("discord.js");
const config = require("../config.json");
const util = require("../util.js");
const canvasModule = require("../canvas.js");

let captchas = [];

module.exports = {
    run: function(bot, message, args) {
        if (message.member.roles.cache.some(r => r.id === "945135765824876594") || message.channel.id !== "945137923005751357") return util.unauth(message);
        if (args.length) {
            const captcha = captchas[message.member.id];
            if (!captcha) return util.error(message, "You must run `>verify` before you can input a code!");
            if (args[0] !== captcha) {
                message.channel.createInvite({unique: true}).then(invite => {
                    util.dm(bot, message.author.id, "You input the wrong code. Please rejoin to try again.\nhttps://discord.gg/" + invite).then(() => message.member.kick("Failed captcha."));
                });
                return util.info(message, "The user failed the captcha, and was kicked.");
            }
            util.success(message, "You've been verified.");
            message.member.roles.add(message.guild.roles.cache.find(r => r.name === "Verified")).catch(e => util.error(message, "I was unable to add the role to the user!"));
            return;
        }
        message.channel.send("Working...").then(function(msg) {
            newMessage = msg;
            const result = canvasModule.createCaptcha(message);
            captchas[message.author.id] = result.text;
            newMessage.delete();
            const embed = new Discord.MessageEmbed()
                .setColor(0x8abc3f)
                .setTitle("Your Challenge")
                .setAuthor(`Requested by ${message.guild.member(message.author).user.tag}`)
                .addFields({
                    name: "The answer to this is CASE SENSITIVE",
                    value: "The difference between `a` and `A` is important",
                    inline: true
                }, {
                    name: "The answer to this has NO SPACES",
                    value: "EX: `qWer1Ty7`",
                    inline: true
                }, {
                    name: "If you answer wrong, you will be kicked and will have to try again",
                    value: "The bot will DM you with an invite",
                    inline: false
                }, {
                    name: `Please run \`${config.prefix}verify <your answer>\``,
                    value: `EX \`${config.prefix}verify qWer1Ty7\``,
                    inline: true
                })
                .setTimestamp()
                .attachFiles(result.image)
                .setImage('attachment://captcha.png')
                .setFooter('Powered by Discord.js', 'https://i.imgur.com/wSTFkRM.png');
            message.channel.send(embed);
        });
    },
    description: "Verifies a user.",
    usage: "verify [code (only put this argument when you have a captcha ready.)]"
};
