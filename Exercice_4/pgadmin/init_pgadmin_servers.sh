#!/bin/sh
set -e

envsubst < /pgadmin4/servers.json.template > /pgadmin4/servers.json

exec /entrypoint.sh
