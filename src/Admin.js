import React, { Component } from 'react'
import getWeb3 from './utils/getWeb3'
import BountyContract from '../build/contracts/BountyContract.json'
import contract from 'truffle-contract'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'
import { Button, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink, Nav, Collapse, Row, Col } from 'reactstrap'
import { Link } from 'react-router-dom'


class Admin extends Component {
    constructor(props) {
        super(props)
        this.state = {
            web3: null,
            account: null,
            isStopped: false,
            isAdmin: false
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
            }).then(() =>
                this.isPaused())
    }

    instantiateContract() {

        this.bountyContract.setProvider(this.state.web3.currentProvider)
        // Declaring this for later so we can chain functions on bountyContract.

        // Get accounts.
        this.state.web3.eth.getAccounts((error, accounts) => {
            this.bountyContract.deployed().then(() => {
                var account = this.state.web3.eth.accounts[0]
                setInterval(() => {
                    if (this.state.web3.eth.accounts[0] !== account) {
                        account = this.state.web3.eth.accounts[0]
                        this.setState({ account: account })
                    }
                }, 100)
            })
        })
    }

    pause() {
        var bountyContractInstance;
        this.bountyContract.deployed().then((instance) => {
            bountyContractInstance = instance;
            return bountyContractInstance.toggleContractActive({ from: this.state.account }).then((value) => {
                console.log(value.valueOf())
                document.getElementById("pause").value = "Paused"
                this.setState({ isStopped: true })
            }).catch((error) => {
                console.log(error)
            })
        })
    }

    unpause() {
        var bountyContractInstance;
        this.bountyContract.deployed().then((instance) => {
            bountyContractInstance = instance;
            return bountyContractInstance.toggleContractActive({ from: this.state.account }).then((value) => {
                console.log(value.valueOf())
                document.getElementById("unpause").value = "Un-Paused"
                this.setState({ isStopped: false })
            }).catch((error) => {
                console.log(error)
            })
        })
    }

    isPaused() {
        var bountyContractInstance;
        this.bountyContract.deployed().then((instance) => {
            bountyContractInstance = instance;
            return bountyContractInstance.isStopped({ from: this.state.account })
        }).then((value) => {
            this.setState({ isStopped: value })
        })
    }

    isUserAdmin() {
        var bountyContractInstance;
        this.bountyContract.deployed().then((instance) => {
            bountyContractInstance = instance;
            return bountyContractInstance.isUserAdmin({ from: this.state.account })
        }).then((value) => {
            this.setState({ isAdmin: value })
        })
    }

    getAdminBalance() {
        this.state.web3.eth.getBalance(this.state.account, (err, balance) => {
            this.balance = this.state.web3.fromWei(balance, "ether") + " ETH"
            document.getElementById("adminbalance").innerHTML = this.balance
        });
    }

    adminView() {
        if (this.state.isAdmin) {
            return (
                <div className="container-fluid">
                    <Row className="my-md-4">
                        <Col className="col-sm-1">
                            <Button size="lg" onClick={() => this.pause()} disabled={this.state.isStopped}>Pause</Button>
                        </Col>
                        <Col>
                            <p className="psize" id="pause"></p>
                        </Col>
                    </Row>
                    <Row className="my-md-4">
                        <Col className="col-sm-1">
                            <Button size="lg" onClick={() => this.unpause()} disabled={!this.state.isStopped}>Un-Pause</Button>
                        </Col>
                        <Col>
                            <p className="psize" id="unpause"></p>
                        </Col>
                    </Row>
                    <Row className="my-md-4">
                        <Col className="col-sm-1">
                            <Button size="lg" onClick={() => this.getAdminBalance()}>Get Balance</Button>
                        </Col>
                        <Col>
                            <p className="plpadding" id="adminbalance"></p>
                        </Col>
                    </Row>
                </div>
            )
        }
        else
            return (<h1 className="h1lpad">User is not Admin</h1>)
    }

    render() {
        return (
            <div className="Admin">
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
                <h1 className="m-md-5">Admin Dashboard</h1>
                {this.adminView()}
            </div>
        );
    }
}

export default Admin