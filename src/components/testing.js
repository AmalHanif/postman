import React, { Component } from "react";
import {Form, FormGroup, ControlLabel,FormControl,Button} from 'react-bootstrap';

class Testing extends Component{
    render(){
        return(
            <Form>
                <FormGroup controlId="formHorizontalEmail">
                    <ControlLabel  >Name </ControlLabel>
                    <FormControl type="text" placeholder="Enter Name" />
                </FormGroup>
                <FormGroup controlId="formHorizontalEmail">
                    <ControlLabel>Email </ControlLabel>
                    
                    <FormControl type="email" placeholder="Enter Email" />
                </FormGroup>
                <Button bsStyle="warning" type="button">SignUp</Button>    
            </Form>
        );
    }
}

export default Testing;