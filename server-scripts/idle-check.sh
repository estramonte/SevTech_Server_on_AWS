#!/usr/bin/env bash

# Requirements:
# - apt-get install mcrcon (or build from source)
# - awscli installed and configured (or use instance role)
# - Cron job to run this script every 5 mins

RCON_HOST="localhost"
RCON_PASS="mysecret"
CHECK_FILE="/tmp/mc_idle_count"
INSTANCE_ID="i-02c1edb3e096f6e8c"
REGION="us-east-2"

# If the file doesn't exist, create it and set count to 0
if [ ! -f "$CHECK_FILE" ]; then
  echo 0 > "$CHECK_FILE"
fi

IDLE_COUNT=$(cat "$CHECK_FILE")

PLAYERS=$(mcrcon -H $RCON_HOST -p $RCON_PASS "list" | grep -oE "[0-9]+(?= players online)")

if [ "$PLAYERS" == "0" ]; then
  # Increase idle count
  IDLE_COUNT=$((IDLE_COUNT+1))
else
  # Reset idle count
  IDLE_COUNT=0
fi

echo $IDLE_COUNT > "$CHECK_FILE"

# For example, if IDLE_COUNT hits 2 and each run is 5 minutes => 10 minutes of idle
if [ "$IDLE_COUNT" -ge 2 ]; then
  echo "No players for 10 minutes, stopping Minecraft server..."
  bash /home/ubuntu/SevTechServer/SevTechServer/Stop.sh
  echo 0 > "$CHECK_FILE"
fi

exit 0
