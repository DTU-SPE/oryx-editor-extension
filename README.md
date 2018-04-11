# oryx-editor-extension
* The Oryx Project: https://bpt.hpi.uni-potsdam.de/Oryx/WebHome
* oryx-editor on Google Code Archive: https://code.google.com/archive/p/oryx-editor/
* The base used in this project is the [upstream-vcs branch from koppor/oryx-editor](https://github.com/koppor/oryx-editor/tree/upstream-vcs) (latest commit: [817ef05](https://github.com/koppor/oryx-editor/commit/817ef053c09152dc87ebfa8d741410244d0ad585) / 7 Oct 2012)
* Related projects:
    * andreaswolf/oryx-editor (mirror  29 Jun 2010, changes): https://github.com/andreaswolf/oryx-editor
    * koppor/oryx-editor (mirror 7 Oct 2012): https://github.com/koppor/oryx-editor
    * code-d/oryx-editor (mirror 7 Oct 2012, less commit history, migrated issues): https://github.com/code-d/oryx-editor
    * tiku01/oryx-editor (mirror 7 Oct 2012, less commit history, changes): https://github.com/tiku01/oryx-editor
    * SINTEF-9012/oryx-neffics (mirror 15 Jun 2011, changes): https://github.com/SINTEF-9012/oryx-neffics
    * yuanqixun/oryx-editor (restructured): https://github.com/yuanqixun/oryx-editor
    * hcacha/angular-oryx-editor: https://github.com/hcacha/angular-oryx-editor
    * CrossOryx Editor: https://sites.google.com/site/crossoryxeditor/


## Installation
The subsections below cover the following installation steps:
* Prerequisites
* Build web apps
* Deploy web apps and database in {Docker,local} containers

### Prerequisites
* Set JAVA_HOME to the installation path of Oracle Java JDK {6,7,8} or OpenJDK 8 (other versions have not been tested)
* Java SE Development Kit 6u45: [download from Oracle's Java SE 6 Downloads page](http://www.oracle.com/technetwork/java/javase/downloads/java-archive-downloads-javase6-419409.html)
    * NB - This JDK is currently included as a Debian package in *docker/packages/oracle-java6-jdk_6u45_amd64.deb* following this guide: https://wiki.debian.org/JavaPackage. For security reasons the package should probably be replaced.
* packages: ant, graphviz, subversion and postgresql-client
* Tomcat 6 with JRE 6 (available as Docker container)
* PostgreSQL 8.4 with PL/Python (available as Docker container)
* [OPTIONAL] Docker Community Edition (CE) (Docker Engine 1.13.1+)
    * ./docker-compose.yml, ./Dockerfile (Tomcat 6) and ./poem-jvm/Dockerfile (PostgreSQL 8.4) included

### Build web apps
* In ./build.properties change *java-home* to the installation path (JAVA_HOME) of *Java SE Development Kit 6u45*
* `$ cd /path/to/workspace/oryx-editor-extension`
* `$ ant build-all`

### Deploy web apps and database
Expected result: after a successful deployment, the following sites are available in the browser:
* Oryx Repository: http://localhost:9090/backend/poem/repository
* Oryx Editor: http://localhost:9090/oryx/editor

#### Deploy web apps and database in Docker containers
* `$ cd /path/to/workspace/oryx-editor-extension`
* `$ docker-compose -f docker-compose.yml up`
* Log entry indicating that the web server is initialized: `web_1  | INFO: Server startup in 1094 ms`
* Log entry indicating that the database is initialized: `db_1   | LOG:  database system is ready to accept connections`
* In a separate terminal: `$ cd /path/to/workspace/oryx-editor-extension`
* `$ ant create-schema`
* `$ docker cp war/. oryxeditorextension_web_1:/usr/local/tomcat/web apps`

#### Deploy web apps and database in local containers
##### Deploy web apps in local Tomcat 6 container
* Documentation: https://tomcat.apache.org/tomcat-6.0-doc/
* In ./build.properties change *deploymentdir* to the web apps directory of your tomcat installation
* `$ cd /path/to/workspace/oryx-editor-extension`
* `$ ant deploy-all`

##### Deploy database in local PostgreSQL 8.4 container
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
* NB - the default hostname in the property with name="connection.url is *database* to accomodate the Docker setup. Change to the hostname of your postgres server (same for postgresql-hostname in ./build.properties)
* Then run ./poem-jvm/data/database/db_schema.sql for that url/username/password

## Debugging
### Java application
The web container needs the following Java options (*address* and the port used later must be equal):
```
JAVA_OPTS="-Xdebug -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=8000"`
```
#### Eclipse (Oxygen)
* Select "Run" -> "Debug Configurations..."
* Right-click "Remote Java Application" -> Select "New"
* "Connection Properties":
    * Host: localhost
    * Port: 8000
* Select "Apply" -> "Debug"
* Select "Window" -> "Show View" -> "Debug"
