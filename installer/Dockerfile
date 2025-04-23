FROM ghcr.io/1panel-dev/maxkb-vector-model:v1.0.1 AS vector-model
FROM node:18-alpine3.18 AS web-build
COPY ui ui
RUN cd ui && \
    npm install && \
    npm run build && \
    rm -rf ./node_modules

# 使用不包含 PostgreSQL 的基础镜像
FROM python:3.11-slim AS stage-build

ARG DEPENDENCIES="python3-pip ca-certificates libpq-dev"

RUN apt-get update && \
    apt-get install -y --no-install-recommends $DEPENDENCIES && \
    apt-get clean all  && \
    rm -rf /var/lib/apt/lists/*

COPY . /opt/maxkb/app
RUN mkdir -p /opt/maxkb/app /opt/maxkb/model /opt/maxkb/conf && \
    rm -rf /opt/maxkb/app/ui

COPY --from=web-build ui /opt/maxkb/app/ui
WORKDIR /opt/maxkb/app
RUN python3 -m venv /opt/py3

# 测试虚拟环境
RUN /opt/py3/bin/pip --version

# 安装 Poetry
RUN /opt/py3/bin/pip install poetry==1.8.5 --break-system-packages

# 配置 Poetry
RUN /opt/py3/bin/poetry config virtualenvs.create false

# 处理 torch 依赖
RUN if [ "$(uname -m)" = "x86_64" ]; then \
    sed -i 's/^torch.*/torch = {version = "^2.2.1+cpu", source = "pytorch"}/g' pyproject.toml; \
    fi

# 安装依赖
RUN /opt/py3/bin/poetry install --no-interaction

# 编译消息
RUN export MAXKB_CONFIG_TYPE=ENV && \
    /opt/py3/bin/python3 /opt/maxkb/app/apps/manage.py compilemessages

FROM python:3.11-slim
ARG DOCKER_IMAGE_TAG=dev \
    BUILD_AT \
    GITHUB_COMMIT

ENV MAXKB_VERSION="${DOCKER_IMAGE_TAG} (build at ${BUILD_AT}, commit: ${GITHUB_COMMIT})" \
    MAXKB_CONFIG_TYPE=ENV \
    MAXKB_DB_NAME=maxkb \
    MAXKB_DB_HOST=m-postgres \
    MAXKB_DB_PORT=5432 \
    MAXKB_DB_USER=root \
    MAXKB_DB_PASSWORD=123456 \
    MAXKB_DB_MAX_OVERFLOW=80 \
    MAXKB_EMBEDDING_MODEL_NAME=/opt/maxkb/model/embedding/shibing624_text2vec-base-chinese \
    MAXKB_EMBEDDING_MODEL_PATH=/opt/maxkb/model/embedding \
    MAXKB_SANDBOX=1 \
    LANG=en_US.UTF-8 \
    PATH=/opt/py3/bin:$PATH \
    PIP_TARGET=/opt/maxkb/app/sandbox/python-packages \
    PYTHONPATH=/opt/maxkb/app/sandbox/python-packages \
    PYTHONUNBUFFERED=1

WORKDIR /opt/maxkb/app
COPY --from=stage-build /opt/maxkb /opt/maxkb
COPY --from=stage-build /opt/py3 /opt/py3
COPY --from=vector-model /opt/maxkb/app/model /opt/maxkb/model

RUN chmod 755 /opt/maxkb/app/installer/run-maxkb.sh && \
    cp -r /opt/maxkb/model/base/hub /opt/maxkb/model/tokenizer && \
    cp -f /opt/maxkb/app/installer/run-maxkb.sh /usr/bin/run-maxkb.sh && \
    curl -L --connect-timeout 120 -m 1800 https://resource.fit2cloud.com/maxkb/ffmpeg/get-ffmpeg-linux | sh && \
    mkdir -p /opt/maxkb/app/sandbox/python-packages &&  \
    find /opt/maxkb/app -mindepth 1 -not -name 'sandbox' -exec chmod 700 {} + && \
    chmod 755 /tmp && \
    useradd --no-create-home --home /opt/maxkb/app/sandbox sandbox -g root && \
    chown -R sandbox:root /opt/maxkb/app/sandbox && \
    chmod g-x /usr/local/bin/* /usr/bin/* /bin/* /usr/sbin/* /sbin/* && \
    chmod g+x /usr/local/bin/python* /bin/sh

# 移除 PostgreSQL 初始化文件
RUN rm -f /docker-entrypoint-initdb.d/init.sql

EXPOSE 8080

ENTRYPOINT ["bash", "-c"]
CMD ["/usr/bin/run-maxkb.sh"]