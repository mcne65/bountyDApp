import React, { Component } from 'react'
import getWeb3 from './utils/getWeb3'
import BountyContract from '../build/contracts/BountyContract.json'
import contract from 'truffle-contract'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'
import {
    Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink, Nav, Collapse, Card, Button, CardHeader, CardFooter, CardBody,
    CardTitle, CardText, Col, Row, ListGroup, ListGroupItem, Badge
} from 'reactstrap'
import { Link } from 'react-router-dom'


class Dashboard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            web3: null,
            account: null,
            bounties: [],
            solutions: {},
            flipStatus: {},
            solutionSelected: {},
            solutionAccepted: {}
        }
        this.bountyContract = contract(BountyContract)
        this.toggle = this.toggle.bind(this);
    }

    solutionSelectedState(bountyId, solutionId) {
        const currentSolutionsSelected = [...this.state.solutionSelected]
        currentSolutionsSelected[bountyId] = solutionId
        this.setState({ solutionSelected: currentSolutionsSelected })
    }

    solutionAcceptedState(bountyId, solutionId) {
        const currentSolutionsAccepted = [...this.state.solutionAccepted]
        currentSolutionsAccepted[bountyId] = solutionId
        this.setState({ solutionAccepted: currentSolutionsAccepted })
        this.acceptSolution(bountyId, solutionId)
    }

    toggle(index) {
        const newflipStatus = [...this.state.flipStatus]
        newflipStatus[index] = !this.state.flipStatus[index]
        this.setState({ flipStatus: newflipStatus })
        this.getSolutions(index)
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
            }).then(() => {
                this.getMyBounties()
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

    getMyBounties() {
        var bountyContractInstance;
        this.bountyContract.deployed().then((instance) => {
            bountyContractInstance = instance;
            var bountiesCreated = []
            bountyContractInstance.returnBountiesCount().then((numBounties) => {
                for (var i = 0; i < numBounties; i++) {
                    bountyContractInstance.getBounty.call(i, { from: this.state.account }).then((bounty) => {
                        if (bounty[0] == this.state.account) {
                            bountiesCreated.push(bounty)
                            this.setState({ bounties: bountiesCreated })
                        }
                    })
                }
            })
        })
    }

    getSolutions(bountyId) {
        var bountyContractInstance;
        this.bountyContract.deployed().then((instance) => {
            bountyContractInstance = instance;
            var solutionsSubmitted = []
            bountyContractInstance.returnSolutionsCount(bountyId).then((numSolutions) => {
                for (var i = 0; i < numSolutions; i++) {
                    bountyContractInstance.getSolution.call(bountyId, i, { from: this.state.account }).then((solution) => {
                        console.log(solution)
                        solutionsSubmitted.push(solution)
                        const updatedSolutions = [...this.state.solutions]
                        updatedSolutions[bountyId] = solutionsSubmitted
                        this.setState({ solutions: updatedSolutions })
                    })
                }
            }).catch((error) => {
                console.log(error)
            })
        })
    }

    createSolutionItem(solution, solutionId, bountyId) {

        var solutionState = solution[2] ? "Accepted" : ""
        return (

            <ListGroupItem key={"item_" + bountyId + "_" + solutionId} tag="button" onClick={() => this.solutionSelectedState(bountyId, solutionId)} active={this.state.solutionSelected[bountyId] === solutionId}>{this.state.web3.toAscii(solution[1])}<Badge color="secondary">{solutionState}</Badge></ListGroupItem>

        )
    }

    acceptSolution(bountyId, solutionId) {
        var bountyContractInstance
        this.bountyContract.deployed().then((instance) => {
            bountyContractInstance = instance
            bountyContractInstance.markSolutionAccepted(bountyId, solutionId, { from: this.state.account }).then(() => {
                bountyContractInstance.getSolutionToBeAwarded(bountyId, solutionId, { from: this.state.account }).then((result) => {
                    var bountyHunterAddress = result[0]
                    var reward = result[1].valueOf()
                    var rewardInWei = reward * 1000000000000000000
                    bountyContractInstance.creditTransfer(bountyHunterAddress, reward, { from: this.state.account, value: rewardInWei }).then((value) => {
                        console.log(value.valueOf())
                    }).catch((error) => {
                        console.log(error)
                    })
                })
            })
        })
    }

    acceptSolutionAction(bountyId) {
        return (
            <Button key={"accept_" + bountyId} onClick={() => this.solutionAcceptedState(bountyId, this.state.solutionSelected[bountyId])}>Click to Accept Selected Solution</Button>
        )
    }



    createMyBountiesCard(bounty, index) {
        var bountyStage = bounty[3].valueOf() == 0 ? "Open" : bounty[3].valueOf() == 1 ? "Closed" : "Invalid State"

        return (
            <div key={"div_" + index}>
                <Card key={"bountyId_" + index}>
                    <CardHeader tag="h3">{bountyStage}</CardHeader>
                    <CardBody>
                        <CardTitle tag="h4">Problem Statement</CardTitle>
                        <CardText className="lead">{this.state.web3.toAscii(bounty[1])}</CardText>
                        <Button onClick={() => this.toggle(index)}>View Solution</Button>
                        <Collapse isOpen={this.state.flipStatus[index]}>
                            <Card>
                                <CardBody>
                                    <ListGroup>
                                        {
                                            (this.state.solutions[index] != undefined) ?
                                                this.state.solutions[index].map((solution, solutionId) => { return this.createSolutionItem(solution, solutionId, index) })
                                                : null
                                        }
                                    </ListGroup>
                                    <Button key={"accept_" + index} disabled={this.state.solutionAccepted[index] != undefined} onClick={() => this.solutionAcceptedState(index, this.state.solutionSelected[index])}>Click to Accept Selected Solution</Button>
                                    {(this.state.solutionAccepted[index] == undefined) ? null : () => this.acceptSolutionAction(index)}
                                </CardBody>
                            </Card>
                        </Collapse>
                    </CardBody>
                    <CardFooter tag="h3">{"Reward: " + bounty[2].valueOf() + " ETH"}</CardFooter>
                </Card>
                <br />
            </div>
        )
    }



    render() {
        return (
            <div className="Dashboard">
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
                            </Nav>
                        </Collapse>
                    </Navbar>
                </div>
                <h1 className="m-md-5">Dashboard</h1>
                <div className="container-fluid">
                    <Row>
                        <Col className="col-sm-3 col-md-2 sidebar">
                            <Nav vertical>
                                <NavItem><NavLink id="navbar-vertical" href="#" active>My Bounties</NavLink></NavItem>
                                <NavItem><NavLink id="navbar-vertical" href="#">My Submissions</NavLink></NavItem>
                                <NavItem><NavLink id="navbar-vertical" href="#">My Rewards</NavLink></NavItem>
                            </Nav>
                        </Col>
                        <Col className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
                            <div id="widgetview">
                                {this.state.bounties.map((bounty, index) => { return this.createMyBountiesCard(bounty, index) })}
                            </div>
                        </Col>
                    </Row>
                </div>
            </div >
        );
    }
}

export default Dashboard
