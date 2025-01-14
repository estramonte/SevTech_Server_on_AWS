# SevTech Ages Minecraft Server on AWS EC2

## Project Description

This project sets up a SevTech Ages Minecraft server on an AWS EC2 instance.

## Main Goals

- Launch an EC2 instance (Ubuntu, t3.large) with OpenJDK 8 installed.
- Zip my SevTech server folder from home.
- Transfer it to EC2 via scp or S3.
- Unzip and run the server on port 25565.
- Open that port in my Security Group.

## Step-by-Step Process

1. **Launch the EC2 Instance**

   - Choose an Ubuntu AMI.
   - Set the Security Group to allow port 22 (SSH) and 25565 (TCP).

2. **SSH into the Instance and Install Java 8**

   ```bash
   ssh -i "your-key.pem" ubuntu@your-ec2-public-dns
   sudo apt update
   sudo apt install openjdk-8-jdk
   java -version
   ```

3. **Zip and Transfer SevTech Server Folder**

   - Zip your SevTech server folder on your local machine.
   - Use `scp` to transfer the zip file to your EC2 instance.

   ```bash
   scp -i "your-key.pem" SevTechServer.zip ubuntu@your-ec2-public-dns:~
   ```

4. **Unzip and Run the Server**

   ```bash
   unzip SevTechServer.zip
   cd SevTechServer
   echo "eula=true" > eula.txt
   ```

   - Follow the instructions in the server's README.txt file to prepare and run the server.

5. **(Optional) Add Scripts for Backups or Set Up IAM Role for S3 Backups**
   - Consider creating scripts for regular backups.
   - Set up an IAM role if using S3 for backups.

## Note on .gitignore

Ensure that large files, such as server jars and mods, are not committed to the repository.

# On-demand SevTech Ages server on AWS with a Discord bot

## Project Description

This project sets up an on-demand SevTech Ages Minecraft server on an AWS EC2 instance, controlled via a Discord bot. It includes an idle-stop script to automatically stop the server when no players are online.

## Step-by-Step Setup Instructions

1. **Set up the AWS EC2 Instance**

   - Launch a t3.large instance.
   - Configure the security group to allow port 25565 for Minecraft.

2. **Install Java and Upload SevTech Server Files**

   - Follow the existing steps in the project documentation.

3. **Configure the Discord Bot**

   - Create a Discord app and obtain a bot token.
   - Copy `.env.example` to `.env` and fill in `DISCORD_BOT_TOKEN`, AWS credentials, instance ID, region, etc.

4. **Run the Discord Bot**

   - Execute `node index.js` to start the bot.

5. **Set up the Idle-Check Script**
   - Deploy `idle-check.sh` on the server and configure it with a cron job or systemd to stop the instance if no players are online for 10–15 minutes.

## Note

- Do not commit real credentials. Use `.env` for sensitive information and `.env.example` as a template.

## Usage Example

- In Discord, type `!startSevTech` to start the server, `!stopSevTech` to stop it, and `!status` to check the server status.
