const config = require("./config.json");

// Init Discord.js client instance
const djs = require("discord.js");
const bot = new djs.Client();
bot.login(config.token);

const rq = require("request-promise-native");

// Build an emojiCache
let emojiCache = [];
rq("https://discordemoji.com/api").then(data => {
    emojiCache = emojiCache.concat(JSON.parse(data).map(item => {
        return {
            name: item.slug,
            externalName: `DiscordEmoji.com`,
            externalIcon: `https://discordemoji.com/assets/img/ogicon.png`,
            url: `https://discordemoji.com/assets/emoji/${item.slug}.png`,
        }
    }));
    process.stdout.write("Got data from DiscordEmoji.com!\n");
});

function sendError(message, channel, client = bot, useEmbed = true) {
    if (channel.permissionsFor(client.user).has("EMBED_LINKS") && useEmbed) {
        channel.send("", {
            embed: {
                title: "Error",
                description: message,
                color: 0xCC0000,
            }
        });
    } else {
        channel.send(message);
    }
}

bot.on("ready", () => {
    process.stdout.write("Bot is ready!\n");
    emojiCache = emojiCache.concat(bot.emojis.array());
});

bot.on("message", async (msg) => {
    const message = msg.content;
    if (!message.startsWith(config.prefix)) return;

    const command = message.split(" ")[0].replace(config.prefix, "");
    const args = message.split(" ");
    args.splice(0, 1);

    if (command === "find") {
        if (args.length < 1) {
            sendError(":upside_down_face: You must add some keywords to search for, such as `banana`.", msg.channel, bot);
        } else if (emojiCache.length < 1) {
            sendError(":beetle: Emoji data is still being fetched.", msg.channel, bot);
        } else {
            const filtered = emojiCache.filter(item => {
                return args.some(value => {
                    return item.name.indexOf(value) > -1;
                });
            });
            if (filtered.length < 1) {
                sendError(":sweat_smile: There aren't any results for that.", msg.channel, bot);
            } else {
                const femoji = filtered[0];
                const provicon = femoji.externalIcon ? femoji.externalIcon : (femoji.guild ? femoji.guild.iconURL : null);

                await msg.channel.send("", {
                    embed: {
                        title: `\`${femoji.name}\``,
                        description: `This is the first result of ${filtered.length} emoji in the database.`,
                        thumbnail: {
                            url: femoji.url,
                        },
                        author: {
                            name: femoji.externalName ? femoji.externalName : (femoji.guild ? femoji.guild.name : "Unknown Source"),
                            icon_url: provicon,
                        },
                        color: 0xFFCC4D,
                    },
                });

            }
        }
    } else if (command === "help" || command === "info") {
        msg.channel.send([
            `Use \`${config.prefix}help\`to bring up this message.`,
            `Use \`${config.prefix}find\` to search for a given emoji using the keywords given.`,
            "This bot is not open-source yet.",
        ].join("\n"));
    }
});