#!/bin/bash

gosu postgres postgres --single -jE < /docker-entrypoint-initdb.d/db_schema.sql
echo
