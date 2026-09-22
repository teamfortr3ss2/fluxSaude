FROM php:8.4-cli

# Dependências do sistema + extensões PHP necessárias (incluindo pgsql)
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libpq-dev \
    libzip-dev \
    && docker-php-ext-install pdo pdo_pgsql pgsql zip \
    && rm -rf /var/lib/apt/lists/*

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copia primeiro só os arquivos de dependência (melhora cache do build)
COPY composer.json composer.lock ./
RUN composer install --no-scripts --no-autoloader --prefer-dist

# Agora copia o resto do código
COPY . .
RUN composer dump-autoload --optimize

EXPOSE 8000

CMD ["sh", "entrypoint.sh"]