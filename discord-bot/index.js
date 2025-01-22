require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const AWS = require("aws-sdk");
const { exec } = require("child_process");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Configure AWS SDK
AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
const ec2 = new AWS.EC2();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", async (message) => {
  console.log("messageCreate event triggered");
  console.log(`Received message: "${message.content}"`);

  if (message.author.bot) {
    console.log("Message is from a bot, ignoring.");
    return;
  }

  console.log("Message is not from a bot, processing.");
  console.log("Message content:", message.content);

  if (message.content.trim() === "!startSevTech") {
    console.log("Command detected: !startSevTech");
    try {
      await message.channel.send("Starting Minecraft server...");
      exec(
        `bash ${process.env.MINECRAFT_SERVER_PATH}/ServerStart.sh`,
        (error, stdout, stderr) => {
          if (error) {
            message.channel.send(`Error starting Minecraft server: ${stderr}`);
            return;
          }
          message.channel.send("Minecraft server is starting up!");
        }
      );
    } catch (error) {
      console.error("Error starting server:", error);
      message.channel.send(`Error: ${error.message}`);
    }
  } else if (message.content.trim() === "!stopSevTech") {
    console.log("Command detected: !stopSevTech");
    try {
      await message.channel.send("Stopping Minecraft server...");
      exec(
        `bash ${process.env.MINECRAFT_SERVER_PATH}/Stop.sh`,
        (error, stdout, stderr) => {
          if (error) {
            message.channel.send(`Error stopping Minecraft server: ${stderr}`);
            return;
          }
          message.channel.send("Minecraft server is stopping.");
        }
      );
    } catch (error) {
      console.error("Error stopping server:", error);
      message.channel.send(`Error: ${error.message}`);
    }
  } else if (message.content.trim() === "!status") {
    console.log("Command detected: !status");
    try {
      exec(
        `mcrcon -H ::1 -P 25575 -p IloveCocoa "list"`,
        (error, stdout, stderr) => {
          if (error) {
            message.channel.send(`Error checking server status: ${stderr}`);
            return;
          }
          message.channel.send(`Server status:\n${stdout}`);
        }
      );
    } catch (error) {
      console.error("Error checking status:", error);
      message.channel.send(`Error: ${error.message}`);
    }
  } else {
    console.log("No matching command found.");
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
