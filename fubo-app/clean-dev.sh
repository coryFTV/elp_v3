#!/bin/bash

# Find and kill any Next.js processes
echo "Checking for existing Next.js processes..."

# Find processes listening on common Next.js ports
for port in 3000 3001 3002 3003; do
  PID=$(lsof -i :$port -t 2>/dev/null)
  if [ ! -z "$PID" ]; then
    echo "Killing process on port $port (PID: $PID)"
    kill -9 $PID 2>/dev/null
  fi
done

# Alternative approach: Find processes by command name
NODE_PIDS=$(ps aux | grep "[n]ode.*next" | awk '{print $2}')
if [ ! -z "$NODE_PIDS" ]; then
  echo "Killing Next.js processes: $NODE_PIDS"
  kill -9 $NODE_PIDS 2>/dev/null
fi

# Give processes time to fully terminate
sleep 1

# Start development server
echo "Starting Next.js development server..."
cd "$(dirname "$0")"
npm run dev:next 