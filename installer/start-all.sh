#!/bin/bash

# 确保所有后台进程都使用 'exec' 启动的主进程作为其父进程
set -e

# --- 1. v1 升级检查 (保留) ---
if [ -f "/opt/maxkb/PG_VERSION" ] || [ -f "/var/lib/postgresql/data/PG_VERSION" ]; then
  echo -e "\033[1;31mFATAL ERROR: Upgrade from v1 to v2 is not supported.\033[0m"
  echo -e "\033[1;31mThe process will exit.\033[0m"
  exit 1
fi

# --- 2. 内部 PostgreSQL 启动 (保留) ---
# 注意：当 MAXKB_DB_HOST=m-postgres 时，此块会被跳过
if [ "$MAXKB_DB_HOST" = "127.0.0.1" ]; then
  echo -e "\033[1;32mPostgreSQL starting...\033[0m"
  /usr/bin/start-postgres.sh &
  wait-for-it 127.0.0.1:5432 --timeout=120 --strict -- echo -e "\033[1;32mPostgreSQL started.\033[0m"
fi

# --- 3. 内部 Redis 启动 (保留) ---
# 注意：当 MAXKB_REDIS_HOST 为外部地址时，此块会被跳过
if [ "$MAXKB_REDIS_HOST" = "127.0.0.1" ]; then
  echo -e "\033[1;32mRedis starting...\033[0m"
  /usr/bin/start-redis.sh &
  wait-for-it 127.0.0.1:6379 --timeout=60 --strict -- echo -e "\033[1;32mRedis started.\033[0m"
fi

# --- 4. 外部依赖检查 (新增 - 可选但建议) ---
# 如果是外部依赖，确保它们可用，避免 MaxKB 启动失败
if [ "$MAXKB_DB_HOST" != "127.0.0.1" ]; then
  echo -e "\033[1;32mWaiting for external PostgreSQL at $MAXKB_DB_HOST:$MAXKB_DB_PORT...\033[0m"
  # 假设 MAXKB_DB_PORT 是 5432
  wait-for-it "$MAXKB_DB_HOST:$MAXKB_DB_PORT" --timeout=60 --strict -- echo -e "\033[1;32mExternal PostgreSQL is ready.\033[0m"
fi

# --- 5. MaxKB 启动 (关键修改) ---
echo -e "\033[1;32mMaxKB starting...\033[0m"
# 使用 'exec' 来启动主应用进程，取代当前的 shell 脚本，成为 PID 1 
# 这样，MaxKB (gunicorn) 退出时，容器也会退出，并且 Docker 信号传递更可靠。
exec /usr/bin/start-maxkb.sh
# 注意：由于使用了 exec，脚本在这一行会停止执行，后续代码不会被执行。