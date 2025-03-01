## 安装pgvector
```bash
docker run --name m-postgres  -e POSTGRES_USER=root -e POSTGRES_PASSWORD=123456
  -e POSTGRES_DB=maxkb -p 5433:5432 -d pgvector/pgvector:0.8.0-pg16

```
```bash
docker exec -it m-postgres psql -U root -d maxkb -c "CREATE EXTENSION vector;"
```

## 项目启动
```bash
docker build -t llm-know-app:v1.0 -f installer/Dockerfile .
```
### 项目环境配置

1. python==3.11
2. pip install poetry
3. poetry install

### 启动项目

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
