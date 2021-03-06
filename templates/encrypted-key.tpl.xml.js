var escapehtml = require('escape-html');

module.exports = ({ contentEncryptionMethod, keyInfo, encryptedContent }) => `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<xenc:EncryptedData Type="http://www.w3.org/2001/04/xmlenc#Element" xmlns:xenc="http://www.w3.org/2001/04/xmlenc#">
	<xenc:EncryptionMethod Algorithm="${escapehtml(contentEncryptionMethod)}" />
	${keyInfo}
	<xenc:CipherData>
		<xenc:CipherValue>${escapehtml(encryptedContent)}</xenc:CipherValue>
	</xenc:CipherData>
</xenc:EncryptedData>`;