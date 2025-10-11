#!/bin/bash

if [ ! -d /opt/maxkb/logs ]; then
    mkdir -p /opt/maxkb/logs
    chmod 700 /opt/maxkb/logs
fi
if [ ! -d /opt/maxkb/local ]; then
    mkdir -p /opt/maxkb/local
    chmod 700 /opt/maxkb/local
fi
mkdir -p /opt/maxkb/python-packages

rm -f /opt/maxkb-app/tmp/*.pid
# 启动所有后台服务（Gunicorn, Celery, Scheduler等）
python /opt/maxkb-app/main.py start

# IMPORTANT: 使用 exec tail -f /dev/null 替换当前的 shell 进程，并保持容器在前台运行
exec tail -f /dev/null