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
   java -Xmx4G -Xms2G -jar forge-1.12.2-14.23.5.2854-universal.jar nogui
   ```

5. **(Optional) Add Scripts for Backups or Set Up IAM Role for S3 Backups**
   - Consider creating scripts for regular backups.
   - Set up an IAM role if using S3 for backups.

## Note on .gitignore

Ensure that large files, such as server jars and mods, are not committed to the repository.
