# oryx-editor-extension
* Starting point: mirror of https://github.com/andreaswolf/oryx-editor (mirror of http://code.google.com/p/oryx-editor/)
* The Oryx Project: https://bpt.hpi.uni-potsdam.de/Oryx/WebHome
* oryx-editor on Google Code Archive: https://code.google.com/archive/p/oryx-editor/
* Other extensions of oryx-editor:
    * CrossOryx Editor: https://sites.google.com/site/crossoryxeditor/

## Installation via Docker
nb: the installation has not been attempted on Windows systems which requires some additional setup: https://blog.docker.com/2017/09/preview-linux-containers-on-windows/
* Prerequisite: Docker Community Edition (CE) (Docker Engine 1.13.1+)
* `$ cd /path/to/workspace`
* `$ git clone https://github.com/DTU-SE/oryx-editor-extension.git`
* `$ cd oryx-editor-extension`
* `$ docker-compose -f docker-compose.yml up`
* Log entry that the web server is initialized: `web_1  | INFO: Server startup in 1094 ms`
* Log entry that the database is initialized: `db_1   | LOG:  database system is ready to accept connections`
* Build and deploy web applications in a separate terminal:
    * `$ cd /path/to/workspace/oryx-editor-extension`
    * `$ docker exec oryxeditorextension_web_1 ant build-all`
    * `$ docker exec oryxeditorextension_web_1 ant deploy-all`
* Available sites:
    * Oryx Repository: http://localhost:9090/backend/poem/repository
    * Oryx Editor: http://localhost:9090/oryx/editor
