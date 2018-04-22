const config = require("config.json");

// Init Discord.js client instance
const djs = require("discord.js");
const bot = new djs.Client();
bot.login(config.token);