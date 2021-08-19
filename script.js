const axios = require('axios');
const getSamlToken = require('./get-saml').getSamlToken;

const filterByKey = (key, value) => (element) => element[key] === value;

const run = async () => {
  var args = process.argv.slice(2);
  const vpid = args[0];
  const token = await getSamlToken(vpid);

  console.log('-------------------------------');
  console.log(token);
  console.log('-------------------------------');

  const url = `https://av-media-sslgate.live.bbc.co.uk/mediaselector/6/select/version/2.0/mediaset/pc/vpid/${vpid}/format/json`;
  const mediaSetResult = await axios.get(url, {
    headers: {'Authorization': `x=${token}`}
  })

  const mediaSetJson = mediaSetResult.data;
  console.log('mediaSetJson')
  console.log(JSON.stringify(mediaSetJson, null, 2));

  const kindJson = mediaSetJson.media.filter(filterByKey('kind', 'audio'));
  console.log('kindJson')
  console.log(JSON.stringify(kindJson, null, 2));

  const bitrateJson = kindJson.find(filterByKey('bitrate', '128'));
  console.log('bitrateJson')
  console.log(JSON.stringify(bitrateJson, null, 2));

  const connectionJson = bitrateJson.connection.filter(filterByKey('protocol', 'https'));
  console.log('connectionJson')
  console.log(JSON.stringify(connectionJson, null, 2));

  // Discard connections with a value of -1
  const availableConnections = connectionJson.filter(({ dpw }) => dpw !== '-1');
  console.log('availableConnections')
  console.log(JSON.stringify(availableConnections, null, 2));

  // Missing dpw values MUST be interpreted as if present with a value of 0
 
  // Cast invalid dpw values to 0 (anything)
  // Invalid dpws (including outside the range -1 to 100, and values which cannot be converted to an integer) MUST be interpreted as if present with a value of 0

  const mappedConnections = availableConnections.map((connection) => {
    const parsedString = connection.dpw ? parseInt(connection.dpw, 10) : 0;
    const integer = Number.isNaN(parsedString) ? 0 : parsedString
    const dpw = integer > 0 && integer <= 100 ? integer : 0

    return {
      ...connection,
      dpw
    };
  })

  const weightedConnections = mappedConnections.filter(({ dpw }) => dpw >= 1 && dpw <= 100);
  console.log('weightedConnections')
  console.log(JSON.stringify(weightedConnections, null, 2));

  const totalWeight = weightedConnections.reduce((acc, { dpw }) => acc + dpw, 0);
  console.log('totalWeight', totalWeight);

  let chosenConnection = null;

  if (weightedConnections.length) {
    while (!chosenConnection) {
      chosenConnection = weightedConnections.find(({ dpw }) => {
        const randomWeight = Math.random() * totalWeight;
        return randomWeight < dpw;
      });
    }
  }
  else {
    chosenConnection = mappedConnections.find(({ dpw }) => dpw === 0);
  }
 
  console.log('chosenConnection')
  console.log(chosenConnection);


}




run();
