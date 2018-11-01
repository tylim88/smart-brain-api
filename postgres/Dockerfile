FROM postgres

ADD /tables/ /docker-entrypoint-initdb.d/tables/
# add table folder to entry point
# docker-entrypoint-initdb.d is standard naming, check the documentation

ADD /seed/ /docker-entrypoint-initdb.d/seed/

ADD deploy_schemas.sql /docker-entrypoint-initdb.d/
# add this file to main folder