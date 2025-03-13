#!/bin/bash

# Find and kill all Next.js related processes on macOS
echo "Finding and killing Next.js development servers..."

# Kill processes on specific ports
for port in 3000 3001 3002 3003 3004 3005; do
  lsof -i :$port | grep LISTEN | awk '{print $2}' | xargs kill -9 2>/dev/null
  echo "Checked port $port"
done

# Kill any node processes running Next.js
ps aux | grep "[n]ode.*next" | awk '{print $2}' | xargs kill -9 2>/dev/null

echo "Done. All Next.js processes should be terminated." 