import React, { Component } from "react";
import Dialog from 'react-dialog';
import {Form,Col,FormGroup,ControlLabel,FormControl, Button } from 'react-bootstrap';
import update from 'immutability-helper';

function FieldGroup({ id, label, help, ...props }) {
  return (
    <FormGroup controlId={id}>
      <Col componentClass={ControlLabel} md={4}>{label}</Col>
      <Col md={8}>
        <FormControl {...props} />
      
      </Col>
  </FormGroup>
  );
}

class OAuth2 extends Component {
  constructor(props, context) {
    super(props);
     this.handleChange = this.handleChange.bind(this); 
    this.state = {
      isDialogOpen:false, 
      value:'',
      initialUrlForPopup:'',
      popupUrl:'',
      access_token:'',
      requestToken:[
        {
          id:0,
          name:"TokenName",
          value:""
        },
        {
          id:1,
          name:"GrantType",
          value:""
        },
        {
          id:2,
          name:"CallBackURL",
          value:""
        },
        {
          id:3,
          name:"AuthURL",
          value:""
        },
        {
          id:4,
          name:"AccessTokenURL",
          value:""
        },
        {
          id:5,
          name:"ClientID",
          value:""
        },
        {
          id:6,
          name:"ClientSecret",
          value:""
        },
        {
          id:7,
          name:"Scope",
          value:""
        },
        {
          id:8,
          name:"State",
          value:""
        },
        {
          id:9,
          name:"ClientAuthentication",
          value:""
        }   
      ],
    };
    this.openChildwindow=this.openChildwindow.bind(this);  
 
  }
  openDialog = () => this.setState({ 
    isDialogOpen: true
  })

  handleClose = () =>this.setState({
      isDialogOpen: false 
  })
  
  handleChange(event) {
    this.setState({ value: event.target.value });

    let obj=[],requestobj=[],updated=[];
    obj.name= event.target.name;
    obj.value=event.target.value;
    requestobj=this.state.requestToken
    requestobj.forEach(function(element) {
      if(obj.name===element.name ){
        updated= update(requestobj[element.id],{$merge:{name:obj.name, value: obj.value}})
        requestobj[element.id]=updated;
      }
    });
    this.state.requestToken=requestobj;
    // this.setState( {requestToken: requestobj});
    console.log(this.state.requestToken)
  }

  openChildwindow(){
    // let request= this.state.requestToken;
    // const initialUrlForPopup = window.open(request[3].value+"?response_type=code&client_id="+request[5].value+"&client_secret="+request[6].value+"&grant_type=authorization_code&code=AUTHORIZATION_CODE&redirect_uri="+request[2].value);
    const initialUrlForPopup = "https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=81khbl128ifn8q&client_secret=JTtqvuUBN9bVTlG4&grant_type=authorization_code&redirect_uri=http://localhost:3000/oauth/callback";
    this.state.popupUrl= window.open( initialUrlForPopup, "" ,"height=500,width=500",);
    var popup= this.state.popupUrl;
    const intervalID = setTimeout(checkUrl, 10000)
    let prevLocation = initialUrlForPopup
    function checkUrl() {
      if ( popup.location !== prevLocation) {
        console.log(popup.location.search)
        prevLocation = popup.location.href;
      }
    }
    return( this.state.popupUrl.location)
  }


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
            <Dialog class="dialog" title="Dialog Title" modal={true} onClose={this.handleClose} >             
              <Form>
                <FieldGroup name="TokenName" label="Token Name" onBlur={this.handleChange} type="text" value={this.state.token} data-token="" placeholder="Token Name"  />
              <FormGroup controlId="formGrantType">
                <Col componentClass={ControlLabel} md={4}>Grant Type </Col>
                <Col md={8}>
                  <FormControl name="GrantType" onBlur={this.handleChange} componentClass="select" value={this.state.GrantType} placeholder="select" >
                    <option value="AuthorizationCode" >Authorization Code</option>
                    <option value="Implicit" >Implicit </option>
                    <option value="PasswordCardiential">Password Cardiential</option>
                    <option value="ClientCardiential">Client Cardiential</option>
                  </FormControl>
                </Col>
              </FormGroup> 
              <FieldGroup name="CallBackURL" label="Call back URL"  onBlur={this.handleChange} type="url" value={this.state.CallbackURL} placeholder="http://your-application.com/registered/callback" />
              <FieldGroup name="AuthURL" label="Auth URL"  onBlur={this.handleChange} type="url" value={this.state.AuthURL} placeholder="https://example.com/login/oauth/authorize" />
              <FieldGroup name="AccessTokenURL" label="Access Token URL"  onBlur={this.handleChange} type="url" value={this.state.AccessTokenURL} placeholder="https://example.com/login/oauth/access_token" />
              <FieldGroup name="ClientID" label="ClientID"  onBlur={this.handleChange} type="text" value={this.state.ClientID} placeholder="Client ID" />
              <FieldGroup name="ClientSecret" label="ClientSecret"  onBlur={this.handleChange} type="text" value={this.state.ClientSecret} placeholder="Client Secret" />
              <FieldGroup name="Scope" label="Scope"  onBlur={this.handleChange} type="text" value={this.state.Scope} placeholder="e.g. read:org" />
              <FieldGroup name="State" label="State" onBlur={this.handleChange} type="text" value={this.state.formState} placeholder="State" />
              <FormGroup controlId="formClientAuthentication">
                <Col componentClass={ControlLabel} md={4}>Client Authentications </Col>
                <Col md={8}>
                  <FormControl name="ClientAuthentication" onBlur={this.handleChange} componentClass="select"  value={this.state.ClientAuthentication} placeholder="select" >
                    <option value="BasicAuthHeader" >Send as Basic Auth header</option>
                    <option value="clientCardientialInBody" >Send as client cardiential in body </option>
                  </FormControl>
                </Col>
              </FormGroup>    
              <Button onClick={this.openChildwindow} bsStyle="warning" type="button">Request Token</Button>
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