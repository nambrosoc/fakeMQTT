# Generate certs:

openssl req -newkey rsa:4096 -nodes -sha512 -x509 -days 3650 -nodes -out ./certs/test.pem -keyout ./certs/test.key
