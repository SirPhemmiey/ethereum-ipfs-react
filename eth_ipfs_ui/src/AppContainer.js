import React, { Component } from 'react';
import './App.css';
import web3 from './web3';
import ipfs from './ipfs';
import {App} from './App';

/*
This is the order of operations in App.js
Set the state variables.
Capture the User’s file.
Convert the file to a buffer.
Send the buffered file to IPFS
IPFS returns a hash.
Get the User’s MetaMask Ethereum address
Send the IPFS for storage on Ethereum.
Using MetaMask, User will confirm the transaction to Ethereum.
Ethereum contract will return a transaction hash number.
The transaction hash number can be used to generate a transaction receipt with information such as the amount of gas used and the block number.
The IPFS and Ethereum information will render as it becomes available in a table using Bootstrap for CSS. NOTE: I didn’t create an isLoading type variable to automatically re-render state for the blockNumber and gasUsed variables. So for now, you will have to click again or implement your own loading icon. 
*/

class AppContainer extends Component {
  constructor (props) {
    super(props);

    const MyContract = window.web3.eth.contract([{"constant":false,"inputs":[{"name":"x","type":"string"}],"name":"sendHash","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getHash","outputs":[{"name":"x","type":"string"}],"payable":false,"stateMutability":"view","type":"function"}]);

    this.state = {
      ContractInstance: MyContract.at ('0x251a38d3cc5e9637766b84393dd66c5af07f99bd'), //address
      ethAddress: '0x251a38d3cc5e9637766b84393dd66c5af07f99bd',
      ipfsHash: null,
      buffer:'',
      blockNumber:'',
      transactionHash:'',
      gasUsed:'',
      txReceipt: '' 
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.captureFile = this.captureFile.bind(this);
    this.convertToBuffer = this.convertToBuffer.bind(this);
    this.handleClick - this.handleClick.bind(this);
  }

  async captureFile(event) {
    event.stopPropagation();
    event.preventDefault();

    const file = event.target.files[0];

    let reader = await new window.FileReader(); //The FileReader object lets web applications asynchronously read the contents of files (or raw data buffers) stored on the user's computer
    reader.readAsArrayBuffer(file); //read the file! When the read operation is finished, the readyState becomes DONE, and the loadend is triggered.
    reader.onloadend = () => this.convertToBuffer(reader) 
    //onloadend event is triggered each time the reading operation is completed
  }   

  async convertToBuffer(reader) {
    //file is converted to a buffer to prepare for uploading to IPFS
    const buffer = await Buffer.from(reader.result);
    //set this buffer.
    this.setState({buffer});
  }

  async handleSubmit(event) {
      //carry out transaction from metamask
      //add file to ipfs
      //add hash to our contract.
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    console.log('Sending from Metamask account: ' + accounts[0]);

    //save document to IPFS,return its hash#, and set hash# to state
    //https://github.com/ipfs/interface-ipfs-core/blob/master/SPEC/FILES.md#add
    //ipfs add takes a buffer of the file!
    await ipfs.add(this.state.buffer, (err,ipfsHashRecd) => {
      console.log(err,ipfsHashRecd);
      this.setState({ ipfsHash: ipfsHashRecd[0].hash });
      /* AS
      ipfsHashRecd = [{
        path: '/tmp/myfile.txt',
        hash: 'QmHash', // base58 encoded multihash
        size: 123 
      }]
      */

      //call contract method sendHash() to send this.state.ipfsHash to ETH bc   
      const {sendHash} = this.state.ContractInstance; //extract sendHash() from sc

      sendHash(this.state.ipfsHash, {from: accounts[0]}, (err, transHash) => {
        console.log(transHash);
        this.setState({transactionHash: transHash});
      }); //sendHash() 
    }) //await ipfs.add
  } // handleSubmit    

  async handleClick()  {

    try{
        this.setState({blockNumber:"waiting.."});
        this.setState({gasUsed:"waiting..."});

        // get Transaction Receipt in console on click
        // See: https://web3js.readthedocs.io/en/1.0/web3-eth.html#gettransactionreceipt
        //web3.eth.getTransactionReceipt(<tx hash>), PROMISE!
        await web3.eth.getTransactionReceipt(this.state.transactionHash, (err, txReceipt)=>{
          console.log(err,txReceipt);
          this.setState({txReceipt: txReceipt});
        }); 

        await this.setState({blockNumber: this.state.txReceipt.blockNumber});
        await this.setState({gasUsed: this.state.txReceipt.gasUsed});    
      }
    catch(error){
        console.log(error);
      }
  }

  /*
  async handleClick() {
    try {
        console.log('enters?');
        this.setState({ blockNumber: 0 });
        this.setState({gasUsed:"waiting..."});
        console.log('all ok yet?');
        // get Transaction Receipt in console on click
        // See: https://web3js.readthedocs.io/en/1.0/web3-eth.html#gettransactionreceipt
        //web3.eth.getTransactionReceipt(<tx hash>), PROMISE!
        await window.web3.eth.getTransactionReceipt(this.state.transactionHash, (err, tx_receipt) /*callback if error..=> {
            console.log(err,tx_receipt);
            this.setState( {txReceipt: tx_receipt});
        });
        console.log('nope prob not here...');

        await this.setState({blockNumber: this.state.txReceipt.blockNumber});
        await this.setState({gasUsed: this.state.txReceipt.gasUsed});
    } catch(error) {
        console.log('sup problemo here?');
    }
  }
  */

  render() {
    return <App 
        onSubmit = {this.handleSubmit}
        onChange = {this.captureFile}
        onClick = {this.handleClick}
        ipfsHash = {this.state.ipfsHash}
        ethAddress = {this.state.ethAddress}
        transactionHash = {this.state.transactionHash}
        blockNumber = {this.state.blockNumber}
        gasUsed = {this.state.gasUsed}
        />;
  }
}

export default AppContainer;
