#!/bin/sh

#start service on retrieved ip address
envsubst < "/app/nginx-default-template.config" > "/etc/nginx/conf.d/default.conf"
nginx -g 'daemon off;'
