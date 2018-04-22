const config = require("./config.json");

// Init Discord.js client instance
const djs = require("discord.js");
const bot = new djs.Client();
bot.login(config.token);

bot.on("ready", () => {
    process.stdout.write("Bot is ready!\n");
});

bot.on("message", (msg) => {
    const message = msg.content;
    if (!message.startsWith(config.prefix)) return;

    const command = message.split(" ")[0].replace(config.prefix, "");

    if (command === "find") {

    } else if (command === "help" || command === "info") {
        msg.send([
            `Use \`${config.prefix}help\`to bring up this message.`,
            `Use \`${config.prefix}find\` to search for a given emoji using the keywords given.`,
            "This bot is not open-source yet.",
        ].join("\n"));
    }
});