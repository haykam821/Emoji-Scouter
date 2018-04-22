const config = require("./config.json");

// Init Discord.js client instance
const djs = require("discord.js");
const bot = new djs.Client();
bot.login(config.token);

const rq = require("request-promise-native");

// Build an emojiCache
const emojiCache = [];
rq("https://discordemoji.com/api").then(data => {
    emojiCache.push(JSON.parse(data));
    process.stdout.write("Got data from DiscordEmoji.com!\n");
});

bot.on("ready", () => {
    process.stdout.write("Bot is ready!\n");
});

bot.on("message", (msg) => {
    const message = msg.content;
    if (!message.startsWith(config.prefix)) return;

    const command = message.split(" ")[0].replace(config.prefix, "");
    const args = message.split(" ");
    args.splice(0, 1);

    if (command === "find") {
        if (args.length < 1) {
            msg.channel.send(":upside_down_face: Try adding some keywords, like `banana`.");
        } else if (emojiCache.length < 1) {
            msg.channel.send(":beetle: Emoji data is still being fetched.")
        } else {
            msg.channel.send(emojiCache.filter(item => {
                return args.some(value => item.slug.indexOf(value) > -1);
            })[0].slug);
        }
    } else if (command === "help" || command === "info") {
        msg.channel.send([
            `Use \`${config.prefix}help\`to bring up this message.`,
            `Use \`${config.prefix}find\` to search for a given emoji using the keywords given.`,
            "This bot is not open-source yet.",
        ].join("\n"));
    }
});