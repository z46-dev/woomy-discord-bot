// Import everything.
try {
    require("./env.js");
} catch(e) {}
const Discord = require("discord.js");
require('discord-reply');
const config = require("./lib/config.json");
const util = require("./lib/util.js");

// Create the bot.
const bot = new Discord.Client();

// When our bot is online, we set it's activity.
bot.on("ready", async function() {
    bot.user.setActivity(`for commands (${config.prefix})`, {
        type: "WATCHING"
    });

    // Now we log that we started up in our logs channel.
    util.log(bot, config.channels.statusLogs, "Discord bot active.");
    //require("./lib/slashCommands.js")(bot);
});

// We use folders for our commands so that it is all simple and split up.
let commands = {};
for (let command of [
    "ping",
    "verify",
    "poll",
    "selfrole",
    "mute",
    "unmute",
    "kick",
    "ban",
    "purge",
    "eval"
]) {
    let module = require(`./lib/commands/${command}.js`);
    commands[command] = module;
}

commands.help = (function() {
    let fields = [];
    for (let name in commands) {
        let command = commands[name];
        fields.push({
            name: name,
            value: `Description: **${command.description}**\nUsage: \`${config.prefix + command.usage}\``
        });
    }
    return {
        run: function(bot, message, args) {
            const embed = new Discord.MessageEmbed()
                .setTitle("Help:")
                .setColor(0x8abc3f)
                .addFields(...fields)
                .setDescription("Here is a list of all commands that are usable:");
            message.channel.send(embed);
        },
        description: "Lists commands.",
        usage: config.prefix + "help"
    }
})();

async function messageEvent(message) {
    if (!message.content.startsWith(config.prefix)) return;
    if (message.author.bot) return;
    let args = message.content.split(" ");
    let command = args.shift().slice(1);
    if (commands[command]) return commands[command].run(bot, message, args);
    util.error(message, "That command doesn't exist!");
};

bot.on("message", messageEvent);

/*bot.on("messageDelete", async function(message) {
    if (message.author.bot) return;
    util.log(bot, config.channels.privateLogs, `<@!${message.author.id}> deleted a message in <#${message.channel.id}>.\nContent: \`\`\`${message.content}\`\`\``, "#FF0000");
});

bot.on("messageUpdate", async function(oldMessage, newMessage) {
    if (oldMessage.author.bot) return;
    util.log(bot, config.channels.privateLogs, `<@!${oldMessage.author.id}> edited a message in <#${oldMessage.channel.id}>.\nOld Content: \`\`\`${oldMessage.content}\`\`\`New Content: \`\`\`${newMessage.content}\`\`\``, "#FFBE00");
});*/

bot.on("error", console.log);

bot.login(process.env.DISCORD_TOKEN);
