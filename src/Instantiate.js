import { Component } from 'react'
import BountyContract from '../build/contracts/BountyContract.json'

class Instantiate extends Component {
    constructor(props) {
        super(props)

        this.state = {
            storageValue: 0,
            web3: null
        }
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
                return bountyContractInstance.set(5, { from: accounts[0] })
            }).then((result) => {
                // Get the value from the contract to prove it worked.
                return bountyContractInstance.get.call(accounts[0])
            }).then((result) => {
                // Update state with the result.
                return this.setState({ storageValue: result.c[0] })
            })
        })
    }
}

export default Instantiate
