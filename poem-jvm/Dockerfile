FROM postgres:8.4

RUN apt-get update
RUN apt-get upgrade -y

# Package required by the schema in the Oryx backend (poem-jvm)
RUN apt-get install -y postgresql-plpython-8.4
