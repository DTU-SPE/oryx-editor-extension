# oryx-editor-extension
* Starting point: mirror of https://github.com/andreaswolf/oryx-editor (mirror of http://code.google.com/p/oryx-editor/)
* The Oryx Project: https://bpt.hpi.uni-potsdam.de/Oryx/WebHome
* oryx-editor on Google Code Archive: https://code.google.com/archive/p/oryx-editor/
* Other extensions of oryx-editor:
    * CrossOryx Editor: https://sites.google.com/site/crossoryxeditor/

## Installation via Docker
* nb: the installation has not been attempted on Windows systems which requires some additional setup: https://blog.docker.com/2017/09/preview-linux-containers-on-windows/
* Prerequisite: Docker Community Edition (CE) (Docker Engine 1.13.1+)
* Clone this repository
* `$ cd oryx-editor-extension`
* `$ docker-compose -f docker-compose.yml up`
* The composition of containers is active after the message "Attaching to oryxeditorextension_db_1, oryxeditorextension_web_1"
* Enter db container (verify container name: `$ docker ps`):
    * `$ docker exec -it oryxeditorextension_db_1 /bin/bash`
    * `# psql -U poem`
    * `poem=# create language plpythonu;`
    * `poem=# \q`
    * `# exit`
* Enter web container
    * `$ docker exec -it oryxeditorextension_web_1 /bin/bash`
    * `# cd /opt/oryx-editor`
    * `# ant create-schema` (password prompt, see ./docker-compose.yml)
    * `# ant build-all`
    * `# ant deploy-all`
    * `# exit`
* Available sites:
    * Oryx Repository: http://localhost:9090/backend/poem/repository
    * Oryx Editor: http://localhost:9090/oryx/editor
