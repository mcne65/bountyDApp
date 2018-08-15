import React, { Component } from 'react'
import BountyContract from '../build/contracts/BountyContract.json'
import getWeb3 from './utils/getWeb3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'
import { Jumbotron, Container, Button, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink, Nav, Collapse, Row, Col } from 'reactstrap'
import { Link } from 'react-router-dom'

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
        <div class="navbar-wrapper">
          <Navbar expand="md" className="navbar-fixed-top">
            <NavbarBrand href="/" className="mr-xl-5 h-25" id="navbar-header">BountyDApp</NavbarBrand>
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav navbar>
                <NavItem className="mr-xl-5 h-25">
                  <NavLink><Link to="/create">Create</Link></NavLink>
                </NavItem>
                <NavItem className="mr-xl-5 h-25">
                  <NavLink><Link to="/browse">Browse</Link></NavLink>
                </NavItem>
                <NavItem className="mr-xl-5 h-25">
                  <NavLink><Link to="/dashboard">Dashboard</Link></NavLink>
                </NavItem>
              </Nav>
            </Collapse>
          </Navbar>
        </div>
        <Jumbotron fluid>
          <Container fluid>
            <h1 className="display-3 text-center">Bounty DApp</h1>
            <p className="lead text-center">A Decentralized application for Bounty Creators and Hunters</p>
            <hr class="my-4" />
          </Container>
        </Jumbotron>
        <Row>
          <Col lg="4">
            <h2 className="text-center">Create</h2>
            <p className="text-center" id="text-desc">Create a Bounty Program. Add a description. Set the Bounty Reward. Get your problem solved by global talent.</p>
            <p className="text-center" ><Button size="lg" id="pure-button-primary"><Link to="/create" >Create</Link></Button></p>
          </Col>
          <Col lg="4">
            <h2 className="text-center">Browse</h2>
            <p className="text-center" id="text-desc">Browse the currently running Bounty Programs. See the problem. Compare the rewards. Submit a solution.</p>
            <p className="text-center"><Button id="pure-button-primary" size="lg"><Link to="/browse">Browse</Link></Button></p>
          </Col>
          <Col lg="4">
            <h2 className="text-center">Dashboard</h2>
            <p className="text-center" id="text-desc">Check the status of your Bounty Programs. See the solutions submitted. Accept a solution. Check your rewards.</p>
            <p className="text-center"><Button id="pure-button-primary" size="lg"><Link to="/dashboard">Dashboard</Link></Button></p>
          </Col>
        </Row>
      </div >
    );
  }
}

export default App
