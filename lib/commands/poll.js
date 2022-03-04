// Import everything.
const Discord = require("discord.js");
const config = require("../config.json");
const util = require("../util.js");

let polls = {};

module.exports = {
    run: function(bot, message, args) {
        if (util.checkPermissions(message) < 2) return util.unauth(message);
        switch (args.shift()) {
            case "init": {
                polls[message.author.id] = {
                    title: args.join(" "),
                    options: [],
                    id: null
                };
                util.info(message, "Poll successfully initiated. You may add up to 10 options. Run `>poll option <your option>` to add an option. You need at least two options.");
            } break;
            case "option": {
                if (!polls[message.author.id]) return util.error(message, "Please run `>poll init <Poll title>` first!");
                if (polls[message.author.id].options.length === 10) return util.error(message, "You already have the maximum amount of options. Please run `>poll publish` to publish the poll in " + `<#${config.channels.pollChannel}>`);
                polls[message.author.id].options.push(args.join(" "));
                util.info(message, "Option added. When you have added all your options, run `>poll publish` to publish it in " + `<#${config.channels.pollChannel}>`);
            } break;
            case "publish": {
                if (!polls[message.author.id]) return util.error(message, "Please run `>poll init <Poll title>` first!");
                if (polls[message.author.id].options.length < 2) return util.error(message, "You need at least two options. Run `>poll option <option>` to add an option.");
                let id = 0;
                const embed = new Discord.MessageEmbed()
                    .setTitle(polls[message.author.id].title)
                    .setDescription("Requested by " + message.author.tag)
                    .setColor(0xAAAADD)
                    .addFields(...polls[message.author.id].options.map(option => {
                        return {
                            name: option,
                            value: `:${["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"][id++]}:`
                        }
                    }));
                bot.channels.cache.get(config.channels.pollChannel).send(embed).then(msg => {
                    polls[message.author.id].id = msg.id;
                    for (let i = 0; i < polls[message.author.id].options.length; i ++) {
                        setTimeout(() => {
                            msg.react(["0️⃣", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣",
"6️⃣", "7️⃣", "8️⃣", "9️⃣"][i]);
                        }, 1000 * i);
                    }
                    util.success(message, `Your poll has been published! The poll ID is \`${msg.id}\`. To close this poll, run \`>poll close ${msg.id}\``);
                });
            } break;
            case "close": {
                    bot.channels.cache.get(config.channels.pollChannel).messages.fetch(args[0]).then(response => {
                        let sort = [];
                        const reactions = ["0️⃣", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣",
"6️⃣", "7️⃣", "8️⃣", "9️⃣"];
                        for (let i = 0; i < poll.options.length; i ++) {
                            sort.push({
                                text: poll.options[i],
                                count: response.reactions.cache.get(reactions[i]).count - 1,
                                reaction: reactions[i]
                            });
                        }
                        sort = sort.sort((a, b) => b.count - a.count);
                        let graph = [];
                        for (let thing of sort) graph.push({
                            name: `***${thing.text}***`,
                            value: `${thing.reaction} - ${"█".repeat(((thing.count / sort[0].count) * 10) | 0)}${"░".repeat(10 - ((thing.count / sort[0].count) * 10) | 0)} (${(thing.count / sort[0].count * 100) | 0}%, ${thing.count} votes)`
                        });
                        util.info({ channel: bot.channels.cache.get(config.channels.pollChannel) }, `${response.url}\nThis poll has been closed. I'm too lazy to get the results. Figure it out yourself.`, graph);
                    }).catch(error => message.reply("Unable to find the poll! Was it deleted? Make sure you're running $poll close <poll id>"));
            } break;
        }
    },
    description: "Manages a poll.",
    usage: "i'm not typing all of this out"
};
