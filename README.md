# Instagram Stories Clone

## Initial Setup

### 1. Install Packages and Initialize Laravel

```
composer install
npm install
php artisan key:generate
```

### 2. Edit .env

Make sure to edit DB details and APP_URL. You will need to setup a local database and have MySQL up and running on your local machine.

### 3. Initialize DB

```
php artisan migrate:fresh
```

