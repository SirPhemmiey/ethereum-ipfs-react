//get current version of web3 (v 1.0) and ensure metamask uses the same
//1.0 lets us use async and await instead of promises

import Web3 from 'web3'

const web3 = new Web3(window.web3.currentProvider)

export default web3;