FROM tomcat:6

ENV JAVA_HOME /usr/lib/jvm/oracle-java6-jdk-amd64
ENV ORYX_HOME /opt/oryx-editor
ENV TOMCAT_WEBAPPS /usr/local/tomcat/webapps

RUN apt-get update
RUN apt-get upgrade -y

# Packages required for building the webapps in the container
RUN apt-get install -y ant
RUN apt-get install -y subversion
RUN apt-get install -y graphviz
RUN apt-get install -y postgresql

COPY . /opt/oryx-editor
RUN dpkg -i /opt/oryx-editor/docker/packages/oracle-java6-jdk_6u45_amd64.deb

WORKDIR $ORYX_HOME
