#!/bin/bash
echo "Bash version ${BASH_VERSION}..."
for i in {1..5}
do
   curl -X GET \
  'http://localhost:3000/buses?imei=123456789&long=40&lat=59' \
  -H 'Content-Type: application/json' \
  -H 'Postman-Token: ff0ffd16-5d36-43f4-8532-c39b0bdff4b7' \
  -H 'cache-control: no-cache'

  sleep 1
done