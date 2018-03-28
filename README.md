# oryx-editor-extension
Starting point is a git mirror of https://github.com/andreaswolf/oryx-editor which is a git mirror of the Oryx project http://code.google.com/p/oryx-editor/

## Installation (Docker)
* Install Docker Community Edition (CE) (Docker Engine 1.13.1+)
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
