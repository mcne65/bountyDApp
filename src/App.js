import React, { Component } from 'react'
import BountyContract from '../build/contracts/BountyContract.json'
import getWeb3 from './utils/getWeb3'
import contract from 'truffle-contract'

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
      web3: null,
      account: null
    }
    this.bountyContract = contract(BountyContract)
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

    this.bountyContract.setProvider(this.state.web3.currentProvider)
    // Declaring this for later so we can chain functions on bountyContract.

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      this.bountyContract.deployed().then(() => {
        this.setState({ account: accounts[0] });
      })
    })
  }

  render() {
    return (
      <div className="App">
        <div className="navbar-wrapper">
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
                <NavItem className="mr-xl-5 h-25">
                  <NavLink><Link to="/admin">Admin</Link></NavLink>
                </NavItem>
              </Nav>
            </Collapse>
          </Navbar>
        </div>
        <Jumbotron fluid>
          <Container fluid>
            <h1 className="display-3 text-center">Bounty DApp</h1>
            <p className="lead text-center">A Decentralized application for Bounty Creators and Hunters</p>
            <hr className="my-4" />
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
