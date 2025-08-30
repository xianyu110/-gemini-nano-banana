#!/bin/bash
# 停止开发服务器脚本

echo "正在停止 Next.js 开发服务器..."
pkill -f "next dev"
echo "服务器已停止"