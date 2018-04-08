import React, { Component } from "react";
import {Form, FormGroup, ControlLabel,FormControl} from 'react-bootstrap';

class Binary extends Component{
    render(){
        return(
            <Form>
                <FormGroup controlId="formControlsFile">
                    <ControlLabel>File</ControlLabel>
                    <FormControl  type="file"  />
                </FormGroup>
            </Form>
        );
    }
}

export default Binary;