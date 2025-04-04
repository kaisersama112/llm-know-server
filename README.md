## 一. 安装ollama 部署模型
```bash
# linux
curl -fsSL https://ollama.com/install.sh | sh
```

## 二. 安装pgvector
```bash
docker run --name m-postgres  -e POSTGRES_USER=root -e POSTGRES_PASSWORD=123456
  -e POSTGRES_DB=maxkb -p 5433:5432 -d pgvector/pgvector:0.8.0-pg16

```
```bash
docker exec -it m-postgres psql -U root -d maxkb -c "CREATE EXTENSION vector;"
```

## 三. 项目启动
这边通过编写docker打包为一个独立的隔离环境(不需要格外的操作)
1. 拉取源码
```bash
git clone https://github.com/kaisersama112/llm-know-server.git
```
2. 打包部署
```bash
docker build -t llm-know-app:v1.0 -f installer/Dockerfile .
```
3. 镜像启动
```bash
docker run -d --name llm-know-container-v2 -p 8080:8080 llm-know-app:v2.0 
```

### 四. 项目环境配置

1. python==3.11
2. pip install poetry
3. poetry install

### 五. 启动项目

#### 1. 启动服务端

```bash
python main.py dev
```

#### 2. 启动前端

```bash
npm run dev
```

#### 3. 启动本地模型服务

```bash
python main.py dev local_model
```

#### 4. 启动异步服务

```bash
python main.py dev celery
```


## 数据导出
```bash
docker cp 8d984bd0cae9:/opt/maxkb/app/data /root/llm-know-server-v3/exported_data
```
## 数据导入

```bash
docker cp /root/llm-know-server-v3/exported_data/. 97ed576f9dc2:/opt/maxkb/app/data/
```