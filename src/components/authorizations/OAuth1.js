import React, { Component } from "react";
import {Form,Col,FormGroup,ControlLabel,FormControl,Checkbox} from 'react-bootstrap';
class OAuth1 extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value:false,
    }
    this.handleClick = this.handleClick.bind(this);
   
  };
 
  handleClick(event) {
      this.setState({value:!this.state.value});
  };

 render() {
    return (
      <div>
      <Form>
        <FormGroup>
          <Col componentClass={ControlLabel} md={4}>Consumer Key</Col>
          <Col md={8}>
            <FormControl type="text" placeholder="Consumer Key" />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col componentClass={ControlLabel} md={4}>Consumer Sercret</Col>
          <Col md={8}>
            <FormControl type="text" placeholder="Consumer Sercret" />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col componentClass={ControlLabel} md={4}>Access Token </Col>
          <Col md={8}>
            <FormControl type="text" placeholder="Access Token" />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col componentClass={ControlLabel} md={4}>Token Secret </Col>
          <Col md={8}>
            <FormControl type="text" placeholder="Token Secret" />
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
              <FormControl type="text" placeholder="testrealm@example.com" />
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
}

export default OAuth1;