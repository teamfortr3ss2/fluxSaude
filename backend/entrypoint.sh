#!/bin/sh
set -e

echo "Aguardando banco de dados..."
php artisan migrate --force

if [ "$RUN_SEEDS" = "true" ]; then
  php artisan db:seed --force
fi

php artisan serve --host=0.0.0.0 --port=8000