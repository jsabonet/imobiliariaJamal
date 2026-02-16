# syntax=docker/dockerfile:1

FROM python:3.12-slim
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
WORKDIR /app

# System deps (opcional, mantido mínimo)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    fontconfig \
    fonts-dejavu-core \
    && rm -rf /var/lib/apt/lists/*

# Python dependencies
COPY requirements.txt ./
# Instalar cryptography primeiro para garantir versão compatível
RUN pip install --no-cache-dir cryptography==41.0.7
RUN pip install --no-cache-dir -r requirements.txt
# Forçar reinstalar cryptography na versão correta (caso pywebpush tenha atualizado)
RUN pip install --force-reinstall --no-deps cryptography==41.0.7

# App code
COPY . .

# Entrypoint
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Create non-root user and set permissions
RUN useradd -m django && mkdir -p /app/static /app/media && chown -R django:django /app
USER django

ENV DJANGO_SETTINGS_MODULE=ijps_api.settings
EXPOSE 8000
ENTRYPOINT ["/entrypoint.sh"]
CMD ["gunicorn", "ijps_api.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3", "--timeout", "120"]
