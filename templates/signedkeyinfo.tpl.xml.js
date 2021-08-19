module.exports = ({ commonName, serialNumber, encryptedKey, keyEncryptionMethod }) => `<X509Data>
<X509IssuerSerial>
  <X509IssuerName>CN=${commonName}</X509IssuerName>
  <X509SerialNumber>${serialNumber}</X509SerialNumber>
</X509IssuerSerial>
</X509Data>`;