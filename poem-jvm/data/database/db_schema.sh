#!/bin/sh

psql -U poem -d poem -a -f db_schema.sql
