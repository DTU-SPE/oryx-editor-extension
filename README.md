# oryx-editor-extension
Starting point is a git mirror of https://github.com/andreaswolf/oryx-editor which is a git mirror of the Oryx project http://code.google.com/p/oryx-editor/

## Installation (Docker) in Linux
* nb: the installation has not been attempted on Windows systems which requires some additional setup: https://blog.docker.com/2017/09/preview-linux-containers-on-windows/
* Install Docker Community Edition (CE) (Docker Engine 1.13.1+)
* `$ cd /path/to/workspace`
* `$ git clone https://github.com/DTU-SE/oryx-editor-extension.git`
* `$ cd oryx-editor-extension`
* `$ docker-compose -f docker-compose.yml up`
* The composition of containers is active after the message "Attaching to oryxeditorextension_db_1, oryxeditorextension_web_1"
* Build and deploy web applications:
    * `$ cd /path/to/oryx-editor-extension`
    * `$ docker exec oryxeditorextension_web_1 ant build-all`
    * `$ docker exec oryxeditorextension_web_1 ant deploy-all`
* Available sites:
    * Oryx Repository: http://localhost:9090/backend/poem/repository
    * Oryx Editor: http://localhost:9090/oryx/editor
