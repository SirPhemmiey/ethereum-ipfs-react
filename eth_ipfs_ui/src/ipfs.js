//using infure.io node. else need to run ipfs on a local daemon!
const IPFS = require('ipfs-api');
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

//to run with local daemon
//const ipfsApi = require('ipfs-api');
//const ipfs = new ipfsApi({ host: 'localhost', port: 5001, protocol: 'https' });

export default ipfs;