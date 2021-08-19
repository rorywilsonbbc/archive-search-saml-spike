# archive-search-saml-spike

Spike to see if we can get a valid token generated in pure javascript.

Built with https://github.com/yaronn/xml-crypto and with inspiration from https://github.com/auth0/node-xml-encryption

## Installation

npm install

## Process
Create valid XML with vpid, payment type (archive_search) and date range (from today until next week)
Sign XML with our public and private pem (./certs/public.pem and ./certs/private.pem)
Encrypt XML with their public and private pem (./certs/media-selector.pem and ./certs/media-selector.crt)
Base64 encode the result