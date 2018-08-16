import React, { Component } from 'react'
import getWeb3 from './utils/getWeb3'
import Instantiate from './Instantiate'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'
import { Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink, Nav, Collapse, Row, Col } from 'reactstrap'
import { Link } from 'react-router-dom'


class Dashboard extends Component {
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
            <div className="Dashboard">
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
                <h1 className="m-md-5">Dashboard</h1>
                <div class="container-fluid">
                    <Row>
                        <Col class="col-sm-3 col-md-2 sidebar">
                            <ul class="nav nav-sidebar">
                                <li class="active"><a href="#">Overview <span class="sr-only">(current)</span></a></li>
                                <li><a href="#">Reports</a></li>
                                <li><a href="#">Analytics</a></li>
                                <li><a href="#">Export</a></li>
                            </ul>
                            <ul class="nav nav-sidebar">
                                <li><a href="">Nav item</a></li>
                                <li><a href="">Nav item again</a></li>
                                <li><a href="">One more nav</a></li>
                                <li><a href="">Another nav item</a></li>
                                <li><a href="">More navigation</a></li>
                            </ul>
                            <ul class="nav nav-sidebar">
                                <li><a href="">Nav item again</a></li>
                                <li><a href="">One more nav</a></li>
                                <li><a href="">Another nav item</a></li>
                            </ul>
                        </Col>
                        <Col class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">

                            <Row class="row placeholders">
                                <Col class="col-xs-6 col-sm-3 placeholder">
                                    <img src="data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" width="200" height="200" class="img-responsive" alt="Generic placeholder thumbnail" />
                                    <h4>Label</h4>
                                    <span class="text-muted">Something else</span>
                                </Col>
                                <Col class="col-xs-6 col-sm-3 placeholder">
                                    <img src="data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" width="200" height="200" class="img-responsive" alt="Generic placeholder thumbnail" />
                                    <h4>Label</h4>
                                    <span class="text-muted">Something else</span>
                                </Col>
                                <Col class="col-xs-6 col-sm-3 placeholder">
                                    <img src="data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" width="200" height="200" class="img-responsive" alt="Generic placeholder thumbnail" />
                                    <h4>Label</h4>
                                    <span class="text-muted">Something else</span>
                                </Col>
                                <Col class="col-xs-6 col-sm-3 placeholder">
                                    <img src="data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" width="200" height="200" class="img-responsive" alt="Generic placeholder thumbnail" />
                                    <h4>Label</h4>
                                    <span class="text-muted">Something else</span>
                                </Col>
                            </Row>

                            <h2 class="sub-header">Section title</h2>
                            <div class="table-responsive">
                                <table class="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Header</th>
                                            <th>Header</th>
                                            <th>Header</th>
                                            <th>Header</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>1,001</td>
                                            <td>Lorem</td>
                                            <td>ipsum</td>
                                            <td>dolor</td>
                                            <td>sit</td>
                                        </tr>
                                        <tr>
                                            <td>1,002</td>
                                            <td>amet</td>
                                            <td>consectetur</td>
                                            <td>adipiscing</td>
                                            <td>elit</td>
                                        </tr>
                                        <tr>
                                            <td>1,003</td>
                                            <td>Integer</td>
                                            <td>nec</td>
                                            <td>odio</td>
                                            <td>Praesent</td>
                                        </tr>
                                        <tr>
                                            <td>1,003</td>
                                            <td>libero</td>
                                            <td>Sed</td>
                                            <td>cursus</td>
                                            <td>ante</td>
                                        </tr>
                                        <tr>
                                            <td>1,004</td>
                                            <td>dapibus</td>
                                            <td>diam</td>
                                            <td>Sed</td>
                                            <td>nisi</td>
                                        </tr>
                                        <tr>
                                            <td>1,005</td>
                                            <td>Nulla</td>
                                            <td>quis</td>
                                            <td>sem</td>
                                            <td>at</td>
                                        </tr>
                                        <tr>
                                            <td>1,006</td>
                                            <td>nibh</td>
                                            <td>elementum</td>
                                            <td>imperdiet</td>
                                            <td>Duis</td>
                                        </tr>
                                        <tr>
                                            <td>1,007</td>
                                            <td>sagittis</td>
                                            <td>ipsum</td>
                                            <td>Praesent</td>
                                            <td>mauris</td>
                                        </tr>
                                        <tr>
                                            <td>1,008</td>
                                            <td>Fusce</td>
                                            <td>nec</td>
                                            <td>tellus</td>
                                            <td>sed</td>
                                        </tr>
                                        <tr>
                                            <td>1,009</td>
                                            <td>augue</td>
                                            <td>semper</td>
                                            <td>porta</td>
                                            <td>Mauris</td>
                                        </tr>
                                        <tr>
                                            <td>1,010</td>
                                            <td>massa</td>
                                            <td>Vestibulum</td>
                                            <td>lacinia</td>
                                            <td>arcu</td>
                                        </tr>
                                        <tr>
                                            <td>1,011</td>
                                            <td>eget</td>
                                            <td>nulla</td>
                                            <td>Class</td>
                                            <td>aptent</td>
                                        </tr>
                                        <tr>
                                            <td>1,012</td>
                                            <td>taciti</td>
                                            <td>sociosqu</td>
                                            <td>ad</td>
                                            <td>litora</td>
                                        </tr>
                                        <tr>
                                            <td>1,013</td>
                                            <td>torquent</td>
                                            <td>per</td>
                                            <td>conubia</td>
                                            <td>nostra</td>
                                        </tr>
                                        <tr>
                                            <td>1,014</td>
                                            <td>per</td>
                                            <td>inceptos</td>
                                            <td>himenaeos</td>
                                            <td>Curabitur</td>
                                        </tr>
                                        <tr>
                                            <td>1,015</td>
                                            <td>sodales</td>
                                            <td>ligula</td>
                                            <td>in</td>
                                            <td>libero</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div >
        );
    }
}

export default Dashboard
