FROM tomcat:6

ENV JAVA_HOME /usr/lib/jvm/oracle-java6-jdk-amd64
ENV TOMCAT_WEBAPPS /usr/local/tomcat/webapps

RUN apt-get update
# libxt6 is required by Java SE Development Kit 6u45 (Oracle)
# and is not included in the tomcat:6 image
RUN apt-get install libxt6

# Java SE Development Kit 6u45
COPY docker/packages/oracle-java6-jdk_6u45_amd64.deb /tmp/
RUN dpkg -i /tmp/oracle-java6-jdk_6u45_amd64.deb

WORKDIR $TOMCAT_WEBAPPS
