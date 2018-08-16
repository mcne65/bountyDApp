import React, { Component } from 'react'
import getWeb3 from './utils/getWeb3'
import Instantiate from './Instantiate'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'
import { Button, Form, FormGroup, Label, Input, FormText, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink, Nav, Collapse, } from 'reactstrap'
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
                <h1>Create Bounty</h1><br /><hr />
                <Form>
                    <FormGroup>
                        <Label for="exampleEmail">Email</Label>
                        <Input type="email" name="email" id="exampleEmail" placeholder="with a placeholder" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="examplePassword">Password</Label>
                        <Input type="password" name="password" id="examplePassword" placeholder="password placeholder" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="exampleSelect">Select</Label>
                        <Input type="select" name="select" id="exampleSelect">
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <Label for="exampleSelectMulti">Select Multiple</Label>
                        <Input type="select" name="selectMulti" id="exampleSelectMulti" multiple>
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <Label for="exampleText">Text Area</Label>
                        <Input type="textarea" name="text" id="exampleText" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="exampleFile">File</Label>
                        <Input type="file" name="file" id="exampleFile" />
                        <FormText color="muted">
                            This is some placeholder block-level help text for the above input.
                            It's a bit lighter and easily wraps to a new line.
          </FormText>
                    </FormGroup>
                    <FormGroup tag="fieldset">
                        <legend>Radio Buttons</legend>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name="radio1" />{' '}
                                Option one is this and that—be sure to include why it's great
            </Label>
                        </FormGroup>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name="radio1" />{' '}
                                Option two can be something else and selecting it will deselect option one
            </Label>
                        </FormGroup>
                        <FormGroup check disabled>
                            <Label check>
                                <Input type="radio" name="radio1" disabled />{' '}
                                Option three is disabled
            </Label>
                        </FormGroup>
                    </FormGroup>
                    <FormGroup check>
                        <Label check>
                            <Input type="checkbox" />{' '}
                            Check me out
          </Label>
                    </FormGroup>
                    <Button>Submit</Button>
                </Form>

            </div >
        );
    }
}

export default Create
