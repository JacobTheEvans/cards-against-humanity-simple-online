#!/bin/sh
"/app/config/default.template.nginx.conf" > "/etc/nginx/conf.d/default.conf"
cat /etc/nginx/conf.d/default.conf
nginx -g 'daemon off;'
