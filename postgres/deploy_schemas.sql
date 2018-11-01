-- Deploy fresh database tables
--run this sql command in container
\i '/docker-entrypoint-initdb.d/tables/users.sql' 
\i '/docker-entrypoint-initdb.d/tables/login.sql' 
\i '/docker-entrypoint-initdb.d/seed/seed.sql'