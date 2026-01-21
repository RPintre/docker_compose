FROM dpage/pgadmin4:latest

USER root

# envsubst est dans gettext (Alpine)
RUN apk add --no-cache gettext

COPY ./pgadmin/servers.json.template /pgadmin4/servers.json.template
COPY ./pgadmin/init_pgadmin_servers.sh /pgadmin4/init_pgadmin_servers.sh
RUN chmod +x /pgadmin4/init_pgadmin_servers.sh


ENTRYPOINT ["/pgadmin4/init_pgadmin_servers.sh"]
