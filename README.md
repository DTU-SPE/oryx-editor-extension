# oryx-editor-extension
* Starting point: mirror of https://github.com/andreaswolf/oryx-editor (mirror of http://code.google.com/p/oryx-editor/)
* The Oryx Project: https://bpt.hpi.uni-potsdam.de/Oryx/WebHome
* oryx-editor on Google Code Archive: https://code.google.com/archive/p/oryx-editor/
* Other extensions of oryx-editor:
    * CrossOryx Editor: https://sites.google.com/site/crossoryxeditor/

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
