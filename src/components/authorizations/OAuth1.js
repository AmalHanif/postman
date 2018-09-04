import React, { Component } from "react";
import {Form,Col,FormGroup,ControlLabel,FormControl,Checkbox} from 'react-bootstrap';

export class OAuth1 extends Component {
  constructor(props) {
    super();
    this.state = {
      value:false,
      consumerKey: "",
      consumerSecret: "",
      accessToken:"",
      tokenSecret:""
    }
    this.handleClick = this.handleClick.bind(this);
  };
 
  handleClick(event) {
      this.setState({value:!this.state.value});
  };

  

  onHandleChange(event,prevState) {
    let newData={};
      newData.name=event.target.name
      newData.value=event.target.value
    
    this.setState(prevState => ({
      oAuth1Data:newData
    }),function(){
      this.onChangeField();
      console.log(this.state.oAuth1Data.name+" : "+this.state.oAuth1Data.value)
    });     
  }

  onChangeField() {
    this.props.changeField(this.state.oAuth1Data);
    // this.props.changeFieldValue(this.state.oAuth1Value)
  } 

  render() {
    return (
      <div>
      <Form>
        <FormGroup>
          <Col componentClass={ControlLabel} md={4}>Consumer Key</Col>
          <Col md={8}>
            <FormControl type="text" name="consumerKey"placeholder="Consumer Key"  onBlur={(event) => this.onHandleChange(event)}  defaultValue={this.state.consumerKey}/>
          </Col>
        </FormGroup>
        <FormGroup>
          <Col componentClass={ControlLabel} md={4}>Consumer Secret</Col>
          <Col md={8}>
            <FormControl type="text" name="consumerSecret" placeholder="Consumer Sercret" onBlur={(event) => this.onHandleChange(event)}  defaultValue={this.state.consumerSecret} />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col componentClass={ControlLabel} md={4}>Access Token </Col>
          <Col md={8}>
            <FormControl type="text" name="accessToken" placeholder="Access Token" onBlur={(event) => this.onHandleChange(event)}  defaultValue={this.state.accessToken} />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col componentClass={ControlLabel} md={4}>Token Secret </Col>
          <Col md={8}>
            <FormControl type="text" name="tokenSecret" placeholder="Token Secret" onBlur={(event) => this.onHandleChange(event)}  defaultValue={this.state.tokenSecret}/>
          </Col>
        </FormGroup>
      </Form>
      <p onClick={this.handleClick}>Advance</p>
        {this.state.value?<div>
        <Form>
          <p>These are advanced configuration options. They are optional. Postman will auto generate values for some fields if left blank.</p> 
          <FormGroup>
          <Col componentClass={ControlLabel} md={4}>signature Method </Col>
          <Col md={8}>
            <FormGroup controlId="formControlsSelect">                
              <FormControl componentClass="select" >
                <option value="tokenAvailable">HMAC-SHA1</option>
                <option value="noTokenAvailable">HMAC-SHA256</option>
                <option value="tokenAvailable">PLAINTEXT</option>
              </FormControl>
            </FormGroup> 
          </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} md={4}>Timestamp </Col>
            <Col md={8}>
              <FormControl type="text" placeholder="Timestamp" />
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} md={4}>Nonce</Col>
            <Col md={8}>
              <FormControl type="text" placeholder="Nonce" />
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} md={4}>Version</Col>
            <Col md={8}>
              <FormControl type="text" placeholder="e.g. 1.0" />
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} md={4}>Realm  </Col>
            <Col md={8}>
              <FormControl type="email" placeholder="testrealm@example.com" />
            </Col>
          </FormGroup>     
        </Form> 
        </div>:null}
      <hr/>
      <Checkbox>
        Add empty parameters to signature
    </Checkbox>
      </div>
    );
  }
};
