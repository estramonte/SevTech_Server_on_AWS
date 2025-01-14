require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const AWS = require("aws-sdk");
const { exec } = require("child_process");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
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
  if (message.author.bot) return;

  if (message.content === "!startSevTech") {
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
      message.channel.send(`Error: ${error.message}`);
    }
  } else if (message.content === "!stopSevTech") {
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
      message.channel.send(`Error: ${error.message}`);
    }
  } else if (message.content === "!status") {
    try {
      const data = await ec2
        .describeInstances({ InstanceIds: [process.env.INSTANCE_ID] })
        .promise();
      const state = data.Reservations[0].Instances[0].State.Name;
      message.channel.send(`EC2 instance is currently ${state}.`);

      exec("pgrep -f 'java -jar server.jar'", (error, stdout, stderr) => {
        if (stdout) {
          message.channel.send("Minecraft server is currently running.");
        } else {
          message.channel.send("Minecraft server is not running.");
        }
      });
    } catch (error) {
      message.channel.send(`Error: ${error.message}`);
    }
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
