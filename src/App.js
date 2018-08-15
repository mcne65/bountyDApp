import React, { Component } from 'react'
import BountyContract from '../build/contracts/BountyContract.json'
import getWeb3 from './utils/getWeb3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'
import {Jumbotron} from 'reactstrap'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      storageValue: 0,
      web3: null
    }
  }

  componentWillMount() {

    getWeb3
      .then(results => {
        this.setState({
          web3: results.web3
        })

        this.instantiateContract()
      })
      .catch(() => {
        console.log('Error finding web3.')
      })
  }

  instantiateContract() {

    const contract = require('truffle-contract')
    const bountyContract = contract(BountyContract)
    bountyContract.setProvider(this.state.web3.currentProvider)

    // Declaring this for later so we can chain functions on bountyContract.
    var bountyContractInstance

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      bountyContract.deployed().then((instance) => {
        bountyContractInstance = instance

        // Stores a given value, 5 by default.
        return bountyContractInstance.set(10, { from: accounts[0] })
      }).then((result) => {
        // Get the value from the contract to prove it worked.
        return bountyContractInstance.get.call(accounts[0])
      }).then((result) => {
        // Update state with the result.
        return this.setState({ storageValue: result.c[0] })
      })
    })
  }

  render() {
    return (
      <div className="App">
      <Jumbotron>
      <h1>BountyDApp: A Decentralized Application for Bounty Creators and Hunters</h1>
      </Jumbotron>

      </div>
    );
  }
}

export default App
