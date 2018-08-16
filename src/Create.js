import React, { Component } from 'react'
import getWeb3 from './utils/getWeb3'
import Instantiate from './Instantiate'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'
import { Button, Form, FormGroup, Label, Input, FormText, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink, Nav, Collapse, Col } from 'reactstrap'
import { Link } from 'react-router-dom'


class Create extends Component {
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

                Instantiate.instantiateContract()
            })
            .catch(() => {
                console.log('Error finding web3.')
            })
    }


    render() {
        return (
            <div className="Create">
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
                <h1 className="m-md-5">Create Bounty</h1>
                <Form>
                    <FormGroup row>
                        <Col sm={1}>
                            <Label for="bountyProblem" sm={1} size="lg">Problem Description</Label>
                        </Col>
                        <Col sm={8}>
                            <Input type="textarea" name="text" id="bountyProblem" placeholder="Enter Problem Statement for Bounty Program" bsSize="lg" />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Col sm={1}>
                            <Label for="bountyReward" sm={1} size="lg">Reward</Label>
                        </Col>
                        <Col sm={8}>
                            <Input type="reward" name="reward" id="bountyReward" placeholder="Bounty Reward" bsSize="lg" />
                        </Col>
                    </FormGroup>
                    <p className="m-md-5"><Button size="lg">Submit</Button></p>
                </Form>
            </div >
        );
    }
}

export default Create
