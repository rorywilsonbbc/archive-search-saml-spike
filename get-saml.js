const SignedXml = require("xml-crypto").SignedXml;
const fs = require("fs");
const forge = require("node-forge");
const util = require("util");
var xmlenc = require("./xml-encrypt");
var utils   = require('./utils');

function GetKeyInfo(certPath) {
  this.getKeyInfo =  () => {
    const cert = fs.readFileSync(certPath);
    const certificate = forge.pki.certificateFromPem(cert);
    const commonName = certificate.issuer.attributes.find(
      (a) => a.name === "commonName"
    ).value;

    return utils.renderTemplate('signedkeyinfo', { commonName, serialNumber: utils.getSerialNumber(certificate) });
  };
}

const getBaseXML = (pid) => {
  const before = new Date().toISOString();
  const after = new Date(new Date().setDate(new Date().getDate() + 7)).toISOString();
  return utils.renderTemplate('base', { pid, before, after });
} 

const getSignedXML = (xml) => {
  const sig = new SignedXml();
  sig.keyInfoProvider = new GetKeyInfo("./certs/public.pem");
  sig.signingKey = fs.readFileSync("./certs/private.pem");
  sig.addReference(
    "//*[@ID='root']",
    [
      "http://www.w3.org/2000/09/xmldsig#enveloped-signature",
      "http://www.w3.org/2001/10/xml-exc-c14n#",
    ],
    "http://www.w3.org/2001/04/xmlenc#sha256"
  );
  sig.signatureAlgorithm = "http://www.w3.org/2001/04/xmldsig-more#rsa-sha256";
  sig.computeSignature(xml);
  return sig.getSignedXml();
} 

const getEncryptedXML = async (xml) => {
  var options = {
    pem: fs.readFileSync("./certs/media-selector.crt"),
    rsa_pub: fs.readFileSync("./certs/media-selector.pem"),
    encryptionAlgorithm: "http://www.w3.org/2001/04/xmlenc#aes256-cbc",
    keyEncryptionAlgorithm: "http://www.w3.org/2001/04/xmlenc#rsa-oaep-mgf1p",
  };

  const encryptXMLPromise = util.promisify(xmlenc.encrypt);
  return encryptXMLPromise(xml, options);
}

const getBase64EncodedXML = (xml) => Buffer.from(xml).toString('base64');

const getSamlToken = async (vpid) => {
  const baseXML = getBaseXML(vpid);
  const signedXML = getSignedXML(baseXML);
  const encryptedXML = await getEncryptedXML(signedXML);
  const token = getBase64EncodedXML(encryptedXML);
  return token;
};

module.exports = {
  getSamlToken
};
