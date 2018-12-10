FROM tomcat:6

ENV JAVA_HOME /usr/lib/jvm/oracle-java6-jdk-amd64
ENV TOMCAT_WEBAPPS /usr/local/tomcat/webapps
ENV JAVA_OPTS="-Xdebug -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=8000"

RUN apt-get update

# Packages required to build the web application
RUN apt-get install ant -y
RUN apt-get install graphviz -y
RUN apt-get install subversion -y
RUN apt-get install postgresql-client -y

# libxt6 is required by Java SE Development Kit 6u45 (Oracle)
# and is not included in the tomcat:6 image
RUN apt-get install libxt6 -y

COPY . /opt/oryx
WORKDIR /opt/oryx

# Java SE Development Kit 6u45
RUN dpkg -i docker/packages/oracle-java6-jdk_6u45_amd64.deb
