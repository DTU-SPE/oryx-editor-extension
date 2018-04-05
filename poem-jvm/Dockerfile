FROM postgres:8.4

RUN apt-get update

# Package required by the schema in the Oryx backend (poem-jvm)
RUN apt-get install -y postgresql-plpython-8.4

COPY data/database/db_schema.sh /docker-entrypoint-initdb.d/
COPY data/database/db_schema.sql /docker-entrypoint-initdb.d/
