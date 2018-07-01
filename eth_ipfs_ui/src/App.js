//APP.js - only render elements. (presentation component)
//check appContainer for the container components (methods).

import React, { Component } from 'react';
import './App.css';

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

export class App extends Component {

  render() {
    return (
      <div className="App">
        <header className="App-header">
        <h1> Ethereum and IPFS with ReactJS! </h1>
        </header>

        <hr />

        <grid>
          <h3> Choose file to store in IPFS </h3>
          <form onSubmit = { this.props.onSubmit }>
            <input
              type = "file"
              onChange = { this.props.onChange}
            />
            <button type="submit" > Send it </button> 
          </form>

          <hr />
            <button onClick = {this.props.onClick}> 
              Get Transaction Receipt 
            </button>

          <hr />

          <h4> Displaying relevant details of the transaction </h4>
          <table border = "1">
            <tbody>
              <tr>
                <th>Transaction Receipt Category </th>
                <th>Values </th>
              </tr>
            
              <tr>
                <td>IPFS Hash # stored on Eth Contract</td>
                <td>{this.props.ipfsHash}</td>
              </tr>
              <tr>
                <td>Ethereum Contract Address</td>
                <td>{this.props.ethAddress}</td>
              </tr>

              <tr>
                <td>Tx Hash # </td>
                <td>{this.props.transactionHash}</td>
              </tr>

              <tr>
                <td>Block Number # </td>
                <td>{this.props.blockNumber}</td>
              </tr>

              <tr>
                <td>Gas Used</td>
                <td>{this.props.gasUsed}</td>
              </tr>                
            </tbody>
          </table> 
        </grid>
      </div>
    );
  }
}
/*
App.propTypes = {
  
  onSubmit: React.PropTypes.func,
  onChange: React.PropTypes.func,
  onClick: React.PropTypes.func,
  ipfsHash: React.PropTypes.string,
  ethAddress: React.PropTypes.string,
  transactionHash: React.PropTypes.string,
  blockNumber: React.PropTypes.string,
  gasUsed: React.PropTypes.string  
}
*/
