# Instagram Stories Clone

The frontend is an improvement over kayue/vue-story-example, with Vuetify and Vuex on top, and a Laravel backend (in progress).

## Initial Setup

### 1. Install Packages and Initialize Laravel

```
composer install
npm install
php artisan key:generate

php artisan storage:link
```

### 2. Edit .env

Make sure to edit DB details and APP_URL. You will need to setup a local database and have MySQL up and running on your local machine.

### 3. Initialize DB

```
php artisan migrate:fresh
```

