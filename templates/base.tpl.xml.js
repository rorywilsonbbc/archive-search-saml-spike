module.exports = ({pid, before, after}) => `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<Assertion xmlns="urn:oasis:names:tc:SAML:2.0:assertion" ID="root">
  <Issuer>xsts.partner.xboxlive.com</Issuer>
  <Subject>
    <SubjectConfirmation Method="urn:oasis:names:tc:SAML:2.0:cm:bearer"/>
  </Subject>
  <Conditions NotBefore="${before}" NotOnOrAfter="${after}">
    <AudienceRestriction>
        <Audience>archive_search:/vpid/${pid}</Audience>
    </AudienceRestriction>
  </Conditions>
</Assertion>`