import React, { Component } from "react";
import {Form, FormGroup, ControlLabel,FormControl} from 'react-bootstrap';
import axios, { post } from 'axios';

class Binary extends Component{
 
    constructor(props) {
        super(props);
        this.state ={
          file:null
        }
       this.onChange=this.onChange.bind(this); 
    }
     
    onChange(e) {
        var file =e.target.files[0];
        var start = 0;
        var stop = file.size;

        var result;
        var promise =new Promise(function(resolve, reject) { 
            var reader = new FileReader();
            // If we use onloadend, we need to check the readyState.
            reader.onloadend = function(evt) {
                if (evt.target.readyState == FileReader.DONE) { // DONE == 2
                result = evt.target.result;
                }   resolve(true); 
            };
            var blob = file.slice(start, stop);
        
            reader.readAsBinaryString(blob);
        });
        promise.then( bool =>
             this.props.changeBinary(result)
          )
        
    }
    
    render() {
        return (
            <Form>
                <FormControl type="file" label="File" onChange={this.onChange} />
            </Form>
        )
    }
}
export default Binary;