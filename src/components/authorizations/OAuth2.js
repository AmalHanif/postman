import React, { Component } from "react";
import Dialog from 'react-dialog';
import {Form,Col,FormGroup,ControlLabel,FormControl, Button } from 'react-bootstrap';

class OAuth2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDialogOpen:false,   
    }
  }
  openDialog = () => this.setState({ 
    isDialogOpen: true
  })

  handleClose = () => this.setState({
      isDialogOpen: false
  })
      

  render() {
    return (
      <div>
        <FormGroup>
          <Col componentClass={ControlLabel} md={4}>Access Token</Col>
          <Col md={8}>
            <FormControl type="text" placeholder="Access Token" />
            <FormGroup controlId="formControlsSelect">                
              <FormControl componentClass="select" placeholder="Available Token">
                <option value="tokenAvailable">Available Token</option>
                <option value="noTokenAvailable">No Token available</option>
              </FormControl>
            </FormGroup> 
            <Button bsStyle="warning" type="button" onClick={this.openDialog}>Get New Access Token</Button>
            {this.state.isDialogOpen &&
              <Dialog class="dialog" title="Dialog Title" modal={true} onClose={this.handleClose} buttons={[{ text: "Close", onClick: () => this.handleClose()}]}>             
                <Form>
                  <FormGroup controlId="formHorizontalEmail">
                    <Col componentClass={ControlLabel} md={6}>Token Name </Col>
                    <Col md={6}>
                      <FormControl type="text" placeholder="Token Name" />
                    </Col>
                  </FormGroup>
                  <FormGroup controlId="formHorizontalEmail">
                    <Col componentClass={ControlLabel} md={6}>Grant Type </Col>
                    <Col md={6}>
                      <FormControl type="text" placeholder="Authorization Code" />
                    </Col>
                  </FormGroup>
                  <FormGroup controlId="formHorizontalEmail">
                    <Col componentClass={ControlLabel} md={6}>Callback URL </Col>
                    <Col md={6}>
                      <FormControl type="text" placeholder="http://your-application.com/registered/callback" />
                    </Col>
                  </FormGroup>
                  <FormGroup controlId="formHorizontalEmail">
                    <Col componentClass={ControlLabel} md={6}>Auth URL </Col>
                    <Col md={6}>
                      <FormControl type="text" placeholder="https://example.com/login/oauth/authorize" />
                    </Col>
                  </FormGroup>
                  <FormGroup controlId="formHorizontalEmail">
                    <Col componentClass={ControlLabel} md={6}>Access Token URL </Col>
                    <Col md={6}>
                      <FormControl type="text" placeholder="https://example.com/login/oauth/access_token" />
                    </Col>
                  </FormGroup>
                  <FormGroup controlId="formHorizontalEmail">
                    <Col componentClass={ControlLabel} md={6}>Client ID </Col>
                    <Col md={6}>
                      <FormControl type="text" placeholder="Client ID" />
                    </Col>
                  </FormGroup>
                  <FormGroup controlId="formHorizontalEmail">
                    <Col componentClass={ControlLabel} md={6}>Client Secret</Col>
                    <Col md={6}>
                      <FormControl type="text" placeholder="Client Secret" />
                    </Col>
                  </FormGroup>
                  <FormGroup controlId="formHorizontalEmail">
                    <Col componentClass={ControlLabel} md={6}>Scope </Col>
                    <Col md={6}>
                      <FormControl type="text" placeholder="e.g. read:org" />
                    </Col>
                  </FormGroup>
                  <FormGroup controlId="formHorizontalEmail">
                    <Col componentClass={ControlLabel} md={6}>State  </Col>
                    <Col md={6}>
                      <FormControl type="text" placeholder="State" />
                    </Col>
                  </FormGroup>
                  <FormGroup controlId="formHorizontalEmail">
                    <Col componentClass={ControlLabel} md={6}>Client Authentication  </Col>
                    <Col md={6}>
                      <FormControl type="text" placeholder="" />
                    </Col>
                  </FormGroup>      
                </Form>
              </Dialog>
            }
          </Col>
        </FormGroup>
      </div>
    );
  }
}

export default OAuth2;