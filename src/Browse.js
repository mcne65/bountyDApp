import React, { Component } from 'react'
import getWeb3 from './utils/getWeb3'
import Instantiate from './Instantiate'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'
import {
    Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink, Nav, Collapse, Card, Button, CardHeader, CardFooter, CardBody,
    CardTitle, CardText
} from 'reactstrap'
import { Link } from 'react-router-dom'


class Browse extends Component {
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
            <div className="Browse">
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
                <h1 className="m-md-5">Browse</h1>
                <div>
                    <Card>
                        <CardHeader>Header</CardHeader>
                        <CardBody>
                            <CardTitle>Special Title Treatment</CardTitle>
                            <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
                            <Button>Go somewhere</Button>
                        </CardBody>
                        <CardFooter>Footer</CardFooter>
                    </Card>

                    <Card>
                        <CardHeader tag="h3">Featured</CardHeader>
                        <CardBody>
                            <CardTitle>Special Title Treatment</CardTitle>
                            <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
                            <Button>Go somewhere</Button>
                        </CardBody>
                        <CardFooter className="text-muted">Footer</CardFooter>
                    </Card>
                </div>
            </div >
        );
    }
}

export default Browse
