# oryx-editor-extension
* Starting point: mirror of https://github.com/andreaswolf/oryx-editor (mirror of http://code.google.com/p/oryx-editor/)
* The Oryx Project: https://bpt.hpi.uni-potsdam.de/Oryx/WebHome
* oryx-editor on Google Code Archive: https://code.google.com/archive/p/oryx-editor/
* Other extensions of oryx-editor:
    * CrossOryx Editor: https://sites.google.com/site/crossoryxeditor/

## Installation
NB - the installation has not been attempted on Windows systems which requires some additional setup: https://blog.docker.com/2017/09/preview-linux-containers-on-windows/
* Clone this repository

### Prerequisites
* Set JAVA_HOME to the installation path of Oracle Java JDK {6,7,8} or OpenJDK 8 (other versions have not been tested)
* Java SE Development Kit 6u45: [download from Oracle's Java SE 6 Downloads page](http://www.oracle.com/technetwork/java/javase/downloads/java-archive-downloads-javase6-419409.html)
    * NB - This JDK is currently included as a Debian package in *docker/packages/oracle-java6-jdk_6u45_amd64.deb* following this guide: https://wiki.debian.org/JavaPackage. For security reasons the package should probably be replaced.
* packages: ant, graphviz, subversion and postgresql-client
* Tomcat 6 powered by Java SE Development Kit 6u45 (available as Docker container)
* PostgreSQL 8.4 with PL/Python (available as Docker container)
* [OPTIONAL] Docker Community Edition (CE) (Docker Engine 1.13.1+)
    * ./docker-compose.yml, ./Dockerfile (Tomcat 6) and ./poem-jvm/Dockerfile (PostgreSQL 8.4) included

### Build webapps
* In ./build.properties change *java-home* to the installation path of *Java SE Development Kit 6u45*
* `$ cd /path/to/workspace/oryx-editor-extension`
* `$ ant build-all`

## Deploying webapps and database
Expected result: after a successful deployment, the following sites are available in the browser:
* Oryx Repository: http://localhost:9090/backend/poem/repository
* Oryx Editor: http://localhost:9090/oryx/editor

### Deploying webapps and database in Docker containers
* `$ cd /path/to/workspace/oryx-editor-extension`
* `$ docker-compose -f docker-compose.yml up`
* Log entry indicating that the web server is initialized: `web_web-target-java-1.6_1  | INFO: Server startup in 1094 ms`
* Log entry indicating that the database is initialized: `db_web-target-java-1.6_1   | LOG:  database system is ready to accept connections`
* `$ ant create-schema` (new terminal session)
* `$ docker cp dist/. oryxeditorextension_web-target-java-1.6_1:/usr/local/tomcat/webapps`

### Deploying webapps and database in local containers
#### Deploying webapps in local Tomcat 6 container
* Documentation: https://tomcat.apache.org/tomcat-6.0-doc/
* In ./build.properties change *deploymentdir* to the webapps directory of your tomcat installation
* `$ cd /path/to/workspace/oryx-editor-extension`
* `$ ant deploy-all`

#### Deploying database in local PostgreSQL 8.4 container
* Documentation: https://www.postgresql.org/docs/8.4/static/
* In ./poem-jvm/etc/hibernate.cfg.xml modify the following lines:
    * `<property name="connection.url">jdbc:postgresql://database/poem</property>`
    * `<property name="connection.username">poem</property>`
    * `<property name="connection.password">poem</property>`
* In ./build.properties modify the following lines:
    * `postgresql-hostname = localhost`
    * `postgresql-username = poem`
    * `postgresql-port = 5432`
    * `postgresql-bin-dir = /usr/bin`
* NB - the default hostname in the property with name="connection.url is *database* to accomodate the Docker setup. Change to the hostname of your postgres server
* Then run ./poem-jvm/data/database/db_schema.sql for that url/username/password
