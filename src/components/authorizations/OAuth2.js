import React, { Component } from "react";
import Dialog from 'react-dialog';
import {Form,Col,FormGroup,ControlLabel,FormControl, Button,Alert,Modal, Checkbox} from 'react-bootstrap';
import update from 'immutability-helper';
import request from "superagent/superagent";
import "./authorization.css";

//FieldGroup of Dialog box for new Access Token
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

//show response of AccessToken in dialog box
function AccessToken({label,value}) {
  return (
    <FormGroup>
      <Col componentClass={ControlLabel} md={3}>{label}</Col>
      <Col sm={9}>
        <p id="word_wrap" >{value}</p> 
      </Col>
    </FormGroup>
  );
}

class OAuth2 extends Component {
  constructor(props, context) {
    super(props);
   
    this.state = {
      CallBackURL:true,
      AuthUrl:true,
      AccessTokenUrl:true,
      State:true,
      Password:false,
      showPassword:"password",
      isDialogOpen:false, 
      isDialogOpenAccess_Token:false,
      showManageToken:false,
      initialUrlForPopup:'',
      index:0,
      token:"",
      err:[],
      alltoken:[{
        tokenName:"No Token Available"
      }],
      requestToken:[
        {
            id:0,
            name:"TokenName",
            value:""
        },
        {
            id:1,
            name:"GrantType",
            value:"authorization_code"
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
        },
        {
            id:10,
            name:"Username",
            value:""
        },
        {
            id:11,
            name:"Password",
            value:""
        }
         
      ],
    };
    this.SendRequest=this.SendRequest.bind(this);
    this.authenticationCode=this.authenticationCode.bind(this);  
    this.handleClose=this.handleClose.bind(this);  
    this.handleChange = this.handleChange.bind(this); 
    this.handleAllToken=this.handleAllToken.bind(this);
    this.useToken=this.useToken.bind(this);
    this.handleHide=this.handleHide.bind(this);
    this.removeToken=this.removeToken.bind(this);
    this.toggleShowPassword=this.toggleShowPassword.bind(this);
  }
  
  openDialog=()=>this.setState({ 
    isDialogOpen: true,
  })
  handleClose = () =>this.setState({
    isDialogOpen: false,
    isDialogOpenAccess_Token:false
  })

  openDialogAccess_Token = () => this.setState({ 
    isDialogOpen: false,
    isDialogOpenAccess_Token:true,
    showManageToken:true
  }) 
  handleShowAlert=()=>this.setState({   
    showAlert:true,
  })
  handleHide(){
    this.setState({
   showAlert: false
    })
  };
  toggleShowPassword(){
    if(this.state.showPassword === "password") {
      this.setState({showPassword: "text"})
    } else{
      this.setState({showPassword : "password"})
    }
  }
  grantType(e){
    this.setState({
      CallBackURL:true,
      AuthUrl:true,
      AccessTokenUrl:true,
      State:true,
      Password:false,
      hideToken_type:true,
      hideState:true
     })
  }
  //Handle Get New Access Token form
  handleChange(event) {
    this.setState({ value: event.target.value });
    this.setState({ [event.target.name]: event.target.value })
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
    this.setState({ requestToken: requestobj });
    console.log(this.state.requestToken)

    //Hide some field on selected the grant Type.
    if(obj.name=== "GrantType"){
      this.grantType();
      if(obj.value==="Implicit"){
        this.setState({   
          AccessTokenUrl:false,
        })
      }
      else if(obj.value==="PasswordCredential"){
        this.setState({  
          CallBackURL:false,
          AuthUrl:false,
          State:false,
          Password:true
        })
      }
      else if(obj.value==="client_credentials"){
        this.setState({ 
          CallBackURL:false,  
          AuthUrl:false,
          State:false
        })
      }
    }
  }

  //Check the grant Type And call the function against selected grant Type.
  SendRequest(){
    const grant_type=this.state.requestToken[1].value
   if(grant_type==="authorization_code") {
      this.authenticationCode();
    }else if(grant_type==="Implicit"){
      this.implicit();
    }else if(grant_type==="PasswordCredential"){
      this.PasswordCredentials();
    }else if(grant_type==="client_credentials"){
      this.client_credentials();
    }
  }

  //send request against authentication code (New Access Token form)
  authenticationCode(){
    let req= this.state.requestToken;
    const initialUrlForPopup = req[3].value+"?response_type=code&client_id="+req[5].value+"&client_secret="+req[6].value+"&grant_type="+req[1].value+"&redirect_uri="+req[2].value+"&state="+req[8].value+"&scope="+req[7].value;
    // const initialUrlForPopup = "https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=81khbl128ifn8q&client_secret=JTtqvuUBN9bVTlG4&grant_type=authorization_code&redirect_uri=http://localhost:3000/oauth/callback";
    var popup= window.open( initialUrlForPopup, "POSTMAN" ,"top=100,left=450,height=500,width=500",);
    var promise = new Promise(function(resolve, reject) {
      setTimeout(checkUrl
        , 5000)

      function checkUrl(){
        const auth_code=popup.location.search,
        code =auth_code.substring(6);
        request
        .post(req[4].value)
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({grant_type:req[1].value,code: code, redirect_uri:req[2].value,client_id:req[5].value,client_secret:req[6].value})
        .end(function(err, res){
          console.log(res)
          localStorage.setItem("resAccessToken",JSON.stringify( res.body));  
          resolve(true); 
        });
        popup.close()
      }       
    })
    promise.then( bool =>
      this.AllToken()
    )
  }

  //Send request against Implicit grant type (New Access Token form)
  implicit(){
    let req= this.state.requestToken;
    const initialUrlForPopup = req[3].value+"?&client_id="+req[5].value+"&redirect_uri="+req[2].value+"&state="+req[8].value+"&scope="+req[7].value+"&response_type=token";
    // const initialUrlForPopup = "https://accounts.google.com/o/oauth2/auth?client_id=773239152720-e66mpsjpa5elhh516ulkm1rf78reamdm.apps.googleusercontent.com&redirect_uri=http://localhost:3000/oauth/callback&scope=https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email&state=STATE_STRING&response_type=token";
    var popup=window.open( initialUrlForPopup, "POSTMAN" ,"top=100,left=450,height=500,width=500");
    console.log(popup)

    var promise = new Promise(function(resolve, reject) {
      setTimeout(checkUrl
        , 5000)

      function checkUrl(){
        const response=popup.location.hash
        var hash;
        var myJson = {};
        var hashes = response.slice(response.indexOf('#') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            myJson[hash[0]] = hash[1];
        }
        console.log(myJson)
        localStorage.setItem("resAccessToken",JSON.stringify( myJson));  
        resolve(true); 
        popup.close()
      }
    })
    promise.then( bool =>  
     this.AllToken(),
    )

  }

   //Send request against Password Credential (New Access Token form)
  PasswordCredentials(){
    let req= this.state.requestToken;
    // "http://localhost:8000/api/postman/password?response_type=code&client_id=DFQbcYb9RgvDdJyAz2fYPsowWlh27y5c&client_secret=PGlrA4j8HdmIPA1G&grant_type=authorization_code&redirect_uri=http://localhost:3000/oauth/callback";
    
    var promise = new Promise(function(resolve, reject) {
        request
        .post(req[4].value)
        .set('Content-Type', 'application/x-www-form-urlencoded','Authorization','Basic ODFraGJsMTI4aWZuOHE6SlR0cXZ1VUJOOWJWVGxHNA==')
        .send({grant_type: req[1].value,username:req[10].value,password:req[11].value,client_id:req[5].value,scope:req[7].value,})
        .end(function(err, res){
          console.log(res)
          localStorage.setItem("resAccessToken",JSON.stringify( res.body));  
          resolve(true); 
        });      
    })
    promise.then( bool =>
      this.AllToken(),
    )
  }

   //Send request against client Credential (New Access Token form)
  client_credentials(){
    let req= this.state.requestToken;
    
    var promise = new Promise(function(resolve, reject) {
        request
        .post(req[4].value)
        .set('Content-Type', 'application/x-www-form-urlencoded', 'Authorization','Basic ODFraGJsMTI4aWZuOHE6SlR0cXZ1VUJOOWJWVGxHNA==')
        .send({grant_type: req[1].value,scope:req[7].value, client_id:req[5].value,})
        .end(function(err, res){
          console.log(res)
          localStorage.setItem("resAccessToken",JSON.stringify( res.body));  
          resolve(true); 
        });      
    })
    promise.then( bool =>
      this.AllToken(),
    )
  }

  //Get response from localStorage and Create array of "allToken"
  AllToken(){
    var responseAccessToken = JSON.parse(localStorage.getItem("resAccessToken"));
    console.log(responseAccessToken)
    let allToken=[],
        res =[],
        error=[];
    if(responseAccessToken.access_token=== undefined){
      error.error_type=responseAccessToken.error;
      error.error_description=responseAccessToken.error_description;
      this.setState({err:error})
      console.log()
      this.handleShowAlert();
    }else{
      res.tokenName= this.state.requestToken[0].value; //Get tokenName from input array "requestToken[]"
      res.access_token= responseAccessToken.access_token;
      res.token_type=responseAccessToken.token_type;
      res.state=responseAccessToken.state;
      res.expires_in=  responseAccessToken.expires_in;
      allToken=this.state.alltoken
      if(this.state.alltoken[0].tokenName==="No Token Available"){
        allToken=res;
        this.state.alltoken.shift();
        this.state.alltoken.push(allToken)
      }else{
        this.state.alltoken.push(res)
      }
      this.openDialogAccess_Token();
      console.log(this.state.alltoken);
      this.setindex();
    }
    return 
  }

  //set the current number of array(alltoken) from output Arrays
  setindex(){
    this.setState({ index:this.state.alltoken.length-1},
    //if "Token_type" or "State" is not in the response then hide from AccessToken dialog box.
    function(){
      if(this.state.alltoken[this.state.index].token_type=== undefined){
        this.setState({ hideToken_type:false})
      }if(this.state.alltoken[this.state.index].state=== undefined){
        this.setState({ hideState:false})
      }
    })
    //Empty input array for new Access Token
    this.state.requestToken.forEach(function(element) {
      if(element.name!=="GrantType"){
        element.value=""
      }   
    }, this);  
  }

  //set the current number of array(alltoken) which show token
  handleAllToken = (event) =>{
    if(event.target.value=== undefined ){
      console.log("token will removed") 
    }else{
      this.setState({ index:event.target.value})
    }
  }
  
  useToken(){
    var tok=this.state.alltoken[this.state.index].access_token
    this.setState({ token:tok });
  }

  handleTokenAvailable= (event) =>{
    if(event.target.selectedIndex===event.target.length-1){ //if "Manage Token" is selected
          this.openDialogAccess_Token();
    }else{//else Show access Token in the input field
      this.setState(
        {index:event.target.selectedIndex},
        function(){
         this.useToken(); 
        }
      )
      this.useToken(); 
    }
  }

  removeToken(e){
    var delindex=e.target.id
    var arr= this.state.alltoken
    arr.splice(delindex,1)
      //if Alltoken will be removed
    if(this.state.alltoken.length===0){
      this.setState({alltoken:[{
        tokenName:"No Token Available"
      }]},function(){
        this.setindex();
      });
      this.setState({ index:0,showManageToken:false});
      this.handleClose();
    }else{
      this.setindex();
    }
  }
  
  render() {
    return (
      <div>
        <FormGroup>
          <Col componentClass={ControlLabel} md={4}>Access Token</Col>
          <Col md={8}>
            <FormControl type="text" placeholder="Access Token" value={this.state.token}/>
            <FormGroup controlId="formControlsSelect">                
              <FormControl componentClass="select" name="Token Avaliable" onChange={this.handleTokenAvailable} value={this.state.alltoken[this.state.index].tokenName} >
                
                {this.state.alltoken.map(function(token, i) {
                  return <option key={i}>{token.tokenName}</option>
                  },this
                )}
                {this.state.showManageToken &&
                <option onClick={this.isDialogOpenAccess_Token}  >Manage Token </option> 
                }
              </FormControl>
            </FormGroup> 
            <Button bsStyle="warning" type="button" onClick={this.openDialog}>Get New Access Token</Button>
        
            
          </Col>      
        </FormGroup>
        
        {this.state.isDialogOpen &&
              <Dialog class="dialog" title="Get New Access Token" modal={true} onClose={this.handleClose} >             
                <Form>
                  <FieldGroup name="TokenName" label="Token Name" onBlur={this.handleChange} type="text" value={this.state.tokenName}  data-token="" placeholder="Token Name"  />
                  <FormGroup controlId="formGrantType">
                    <Col componentClass={ControlLabel} md={4}>Grant Type </Col>
                    <Col md={8}>
                      <FormControl name="GrantType" onChange={this.handleChange} componentClass="select" value={this.state.GrantType} placeholder="select" >
                        <option value="authorization_code" >Authorization Code</option>
                        <option value="Implicit" >Implicit </option>
                        <option value="PasswordCredential">Password Cardiential</option>
                        <option value="client_credentials">Client Cardiential</option>
                      </FormControl>
                    </Col>
                  </FormGroup>
                  {this.state.CallBackURL && 
                    <FieldGroup name="CallBackURL" label="Call back URL"  onBlur={this.handleChange} type="url" value={this.state.CallbackUrl} placeholder="http://your-application.com/registered/callback" />
                  }
                  {this.state.AuthUrl &&
                    <FieldGroup name="AuthURL" label="Auth URL"  onBlur={this.handleChange} type="url" value={this.state.Authurl} placeholder="https://example.com/login/oauth/authorize" />
                  }
                  {this.state.AccessTokenUrl &&
                    <FieldGroup name="AccessTokenURL" label="Access Token URL"  onBlur={this.handleChange} type="url" value={this.state.accessTokenUrl} placeholder="https://example.com/login/oauth/access_token" />
                  }
                  {this.state.Password &&
                    <div>
                      <FieldGroup name="Username" label="Username"  onBlur={this.handleChange} type="text" value={this.state.userName} placeholder="Username" />
                      <FieldGroup name="Password" label="Password" id="password" onBlur={this.handleChange} type={this.state.showPassword} placeholder="Password" />
                      <Checkbox onClick={this.toggleShowPassword}>Show Password</Checkbox>
                    </div>
                  }
                  <FieldGroup name="ClientID" label="ClientID"  onBlur={this.handleChange} type="text" value={this.state.clientID} placeholder="Client ID" />
                  <FieldGroup name="ClientSecret" label="ClientSecret"  onBlur={this.handleChange} type="text" value={this.state.clientSecret} placeholder="Client Secret" />
                  <FieldGroup name="Scope" label="Scope"  onBlur={this.handleChange} type="text" value={this.state.scope} placeholder="e.g. read:org" />
                  {this.state.State &&
                  <FieldGroup name="State" label="State" onBlur={this.handleChange} type="text" value={this.state.formState} placeholder="State" />
                  }
                  <FormGroup controlId="formClientAuthentication">
                    <Col componentClass={ControlLabel} md={4}>Client Authentications </Col>
                    <Col md={8}>
                      <FormControl name="ClientAuthentication" onBlur={this.handleChange} componentClass="select"  value={this.state.clientAuthentication} placeholder="select" >
                        <option value="BasicAuthHeader" >Send as Basic Auth header</option>
                        <option value="clientCardientialInBody" >Send as client cardiential in body </option>
                      </FormControl>
                    </Col>
                  </FormGroup>    
                  <Button onClick={this.SendRequest} bsStyle="warning" type="button">Request Token</Button>
                </Form>
              </Dialog>
            }
            {this.state.isDialogOpenAccess_Token &&
              <Dialog className="dialog ui-dialog-overlay" modal={true}  title="Access Token" width={700}  onClose={this.handleClose} >             
                <Form>
                  <Col componentClass={ControlLabel} md={2}>
                    <a>All Token</a>
                    <ul>
                    {this.state.alltoken.map(function(token, i) {
                      return <li onClick={this.handleAllToken} value={i} key={i}>{token.tokenName}<span className="glyphicon glyphicon-trash" key={i} id={i} onClick={this.removeToken}></span>  </li>
                    
                      },this
                    )}
                    </ul> 
                  </Col>
                  <Col md={10}>
                  <AccessToken name="Token Name" label="Token Name" value={this.state.alltoken[this.state.index].tokenName} />
                  <AccessToken name="AccessToken" label="Access Token" value={this.state.alltoken[this.state.index].access_token} />
                  
                    {this.state.hideToken_type&&
                      <AccessToken name="Token Type" label="Token Type" value={this.state.alltoken[this.state.index].token_type} />
                    }
                    {this.state.hideState &&
                      <AccessToken name="State" label="State" value={this.state.alltoken[this.state.index].state} />
                    }
                    <AccessToken name="expires_in" label="expires_in" value={this.state.alltoken[this.state.index].expires_in} />
                  </Col>  
                  <Button onClick={this.useToken} bsStyle="warning" type="button">Use Token</Button>
                </Form>
              </Dialog>
            }

        {this.state.showAlert &&
          <Modal.Dialog>
            <Alert bsStyle="danger" onDismiss={this.handleHide} >
              <h4>Error!</h4>{this.state.err.error}
              <p>
              {this.state.err.error_description}
              </p>
            </Alert>
          </Modal.Dialog>
        }
      </div>
    );
  }
}


export default OAuth2;