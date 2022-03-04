const startTime = new Date().getTime();

let commands = [];

let helpCommand = {
  data: {
    name: "help",
    description: "Displays the valid `/` commands you can use."
  },
  interaction: (bot, interaction, member, command, args) => reply(bot, interaction, "", [{
      title: "ACC Bot Slash (/) Commands Help List:",
      color: 0x0055ff,
      fields: (function() {
          console.log(member);
          let output = [];
          for (let command of commands) {
              if (command.data.name !== "help") {
                  output.push({
                      name: command.data.name,
                      value: command.data.description
                  });
              }
          }
          return output;
      })(),
      footer: {
          text: "Powered by dicord.js"
      }
  }])
};
commands.push(helpCommand);

function reply(bot, interaction, content, embeds = []) {
  bot.api.interactions(interaction.id, interaction.token).callback.post({
    data: {
      type: 4,
      data: { content: content, embeds: embeds }
    }
  });
}

function parseCommand(bot, interaction) {
  const command = interaction.data.name.toLowerCase();
  const args = interaction.data.options;
  const member = interaction.member;
  if (commands.find(r => r.data.name === command) == undefined) return reply(bot, interaction, "That is an invalid command! Do `/help` to see what you can do!");
  commands[commands.indexOf(commands.find(r => r.data.name === command))].interaction(bot, interaction, member, command, args);
};

function init(bot) {
  commands.forEach(command => bot.api.applications(bot.user.id).guilds("945134461622812692").commands.post({ data: command.data }));
  bot.ws.on('INTERACTION_CREATE', async interaction => parseCommand(bot, interaction));
};

module.exports = init;
