var escapehtml = require('escape-html');

module.exports = ({ issuerData, serialNumber, encryptedKey, keyEncryptionMethod }) => `<ds:KeyInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
	<xenc:EncryptedKey>
		<xenc:EncryptionMethod Algorithm="${escapehtml(keyEncryptionMethod)}"/>
		<KeyInfo xmlns="http://www.w3.org/2000/09/xmldsig#">
			<X509Data>
				<X509IssuerSerial>
					<X509IssuerName>${issuerData}</X509IssuerName>
					<X509SerialNumber>${serialNumber}</X509SerialNumber>
				</X509IssuerSerial>
			</X509Data>
		</KeyInfo>
		<xenc:CipherData>
			<xenc:CipherValue>${escapehtml(encryptedKey)}</xenc:CipherValue>
		</xenc:CipherData>
	</xenc:EncryptedKey>
</ds:KeyInfo>`;