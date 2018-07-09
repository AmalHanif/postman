import React, { Component } from "react";
import {Row,Col,FormGroup,ControlLabel,FormControl, Button } from 'react-bootstrap';

import "./authorization.css";
import {NoAuth} from "./NoAuth";
import {BearerToken} from "./BearerToken";
import {OAuth1} from "./OAuth1";
import {OAuth2} from "./OAuth2";

class Authorization extends Component {
  constructor(props) {
    super();
    this.state = {
      noAuth:true,
      bearerToken:false,
      oAuth1:false,
      oAuth2:false,
    }
    this.handleChange = this.handleChange.bind(this);
    this.operation = this.operation.bind(this);
  };
 
  handleChange(event) {
    this.setState({value: event.target.value,
      noAuth:false,
      bearerToken:false,
      oAuth1:false,
      oAuth2:false
    });
    this.operation(event);
  };
  operation(event){
   
    let i= event.target.value;
    switch (i) {
      default:
      this.setState({noAuth:!this.state.noAuth});
          break;
          
      case "bearerToken":
      this.setState({bearerToken:!this.state.bearerToken}); 
          break;
      case "oAuth1":
      this.setState({oAuth1:!this.state.oAuth1});
          break;
      case "oAuth2":
      this.setState({ oAuth2:!this.state.oAuth2})
    }
  };
 
  onChangeOauth1(newData) {
    this.setState ({
      oAuth1Data:newData
    }
   ,function(){
      this.onChange();
    });
  }
  onChange() {
    this.props.changeField(this.state.oAuth1Data);
  }

 render() {
   return (
      <Row>
        <Col md={3}>
          <FormGroup controlId="formControlsSelect">

          <ControlLabel>Type </ControlLabel>
              <FormControl componentClass="select" placeholder="select" value={this.state.value} onChange={this.handleChange}>
                <option value="noAuth" >No Auth</option>
                <option value="bearerToken" >Bearer Token</option>
                <option value="oAuth1">OAuth 1.0</option>
                <option value="oAuth2">OAuth 2.0</option>
              </FormControl>
          </FormGroup> 
          
          <p>The authorization data will be automatically generated when you send the request.<span> Learn more about authorization</span></p>

          <FormGroup controlId="formControlsSelect">
          <ControlLabel>Add authorization data to</ControlLabel>
            <FormControl componentClass="select" placeholder="select">
              <option value="url">Request URL</option>
              <option value="headers">Request Headers</option>
            </FormControl>
          </FormGroup>   

          <Button bsStyle="warning">Preview Request</Button>
        
        </Col>
        <Col md={9}>
          {this.state.noAuth&&<div>
             <NoAuth/>  
          </div>}

          {this.state.bearerToken&&<div >
            <BearerToken/>
          </div>}
          
          {this.state.oAuth1&&<div>
            <OAuth1 changeField={this.onChangeOauth1.bind(this)}
                           />
          </div>}

          {this.state.oAuth2&&<div>
            <OAuth2/>
          </div>} 

        </Col>          
      </Row>
  );

 }
}
export default Authorization;