import React, { Component } from "react";
import {FormGroup, InputGroup,DropdownButton,Button,FormControl,MenuItem,SplitButton,Row,Col,Tabs, Tab } from 'react-bootstrap';
import ReactDataGrid from 'react-data-grid';
import update from 'immutability-helper';
import axios from 'axios'
import randomstring from "randomstring";
import oauthSignature from "oauth-signature/dist/oauth-signature.js"

import Authorization from "./components/authorizations/authorization";
import Header from "./components/Header";
import Body from "./components/body";
import Test from "./components/test";

class Main extends Component {
  constructor(props, context) {
    super();
  
    this._columns = [
      {
        key: 'key',
        name: 'Key',
        editable: true,
        width: 335,
        resizable: true
      },
      {
        key: 'value',
        name: 'Value',
        editable: true,
        width: 335,
        resizable: true
      },
      {
        key: 'description',
        name: 'Description',
        editable: true,
        width: 335,
        resizable: true
      },
    ];

    this.state = {
      oauth1_consumerKey:"",
      oauth1_consumerSecret:"",
      oauth1_accessToken:"",
      oauth1_tokenSecret:"",
      httpmethod:"GET",
       
       key:"",
       url:"",
       value:"",
       finalQuery : "",
       currentRowId:0,
       rows: this.createRows(1),
       showParams:false,
       isDialogOpen: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleUrl = this.handleUrl.bind(this);
    this.sendRequest = this.sendRequest.bind(this);
    this.saveOAuth1data = this.saveOAuth1data.bind(this);
    this.onSelectMethod = this.onSelectMethod.bind(this);
    // this.addParams = this.addParams.bind(this);
  }
  onSelectMethod(event){
    this.setState({
      method:event
    })
  } 
  createRows = (numberOfRows) => {
    let rows = [];
    for (let i = 0; i < numberOfRows; i++) {
      rows[i] = this.createRowObjectData(i);
    }
    return rows;
  };

  createRowObjectData = (index) => {
    return {
      id: index+1,
      key:'',
      value: '',
      description: '',
    };
  };
 
  getColumns = () => {
    let clonedColumns = this._columns.slice();
    clonedColumns[2].events = {
      onClick: (ev, args) => {
        const idx = args.idx;
        const rowIdx = args.rowIdx;
        this.grid.openCellEditor(rowIdx, idx);
      }
    };

    return clonedColumns;
  };
  
  getRowAt = (index) => {
    if (index < 0 || index > this.getSize()) {
      return undefined;
    }

    return this.state.rows[index];
  };

  getSize = () => {
    return this.state.rows.length;
  };
  
  operation =() =>{
    this.setState({
      showParams:!this.state.showParams
    })
  };
  
  handleChange(event){
    let rowToUpdate = this.state.rows[event.fromRow]
    let updatedRow = update(rowToUpdate, {$merge: event.updated});
    this.state.rows[event.fromRow]= updatedRow;
    console.log(event);

    // only add if row has both key and value
    let currentRow = this.state.rows[event.fromRow];

    if (currentRow.key && currentRow.value) {
      this.state.rows[event.fromRow].is_complete = true
    }
    // add new row
    if(this.state.rows.length===event.fromRowId){
      if(currentRow.key!=="" || currentRow.value!=="" ||currentRow.description!=="" ){ 
        const newRow = this.createRowObjectData(currentRow.id);
        this.state.rows = update( this.state.rows, {$push: [newRow]});   
      }
    }  
    // ----

    this.triggerQueryChange(currentRow.id-1);
    console.log(this.state);
  };

  triggerQueryChange(currentRowId){
    let query = this.parseQuery(this.state.url,currentRowId);
    var finalQueryBuilder = "";
    finalQueryBuilder += query.urlValue;

    for (var index = 0; index < this.state.rows.length; index++) {
      let symbol = "&";        
      if (index === 0) {
        symbol = "?";
      }
      if (this.state.rows[index].is_complete) {
        finalQueryBuilder += symbol;
        finalQueryBuilder += this.state.rows[index].key;
        finalQueryBuilder += "=";
        finalQueryBuilder += this.state.rows[index].value;
      }
    }
    this.setState({url :finalQueryBuilder});
  }

  handleUrl(updated){
    console.log(updated.target.value)
    this.setState({url : updated.target.value},
      function(){
        this.parseQuery(this.state.url);
      }
    );
  }
  
  findInArray(array, needle){
    for (var i = 0; i < array.length; i++) {
      var element = array[i];
      if (element.key === needle) {
        return i;
      }
    }
    return -1;
  }

  parseQuery(url,currentRowId){
    console.log(url)
    let obj = {};
    obj.params = {};
    let questionMark = url.indexOf('?');
    if(questionMark=== -1){
      obj.urlValue =url
    }else{
      obj.urlValue = url.substring(0,questionMark);
    }
    var regex = /[?&]([^=#]+)=([^&#]*)/g,
        match;

    let rowHolder = this.state.rows;
    let updatedRow=[];

    if(currentRowId===undefined){
      this.setState({rows:null});
      let count=0;
      while (match = regex.exec(url)) {
        obj.params[match[1]] = match[2];
        // replace if exists
        let index = this.findInArray  (rowHolder, match[1]);
        if (index > -1) {
          rowHolder[index].value = match[2];
          updatedRow= update(rowHolder[index],{$merge:{id:index+1,key:match[1], value: match[2]}})
          rowHolder[count]=updatedRow;
        }else{
          if(count===rowHolder.length){ 
            rowHolder.push({key:match[1], value: match[2]})
            const newRow = this.createRowObjectData(count);
            rowHolder = update( this.state.rows, {$push: [newRow]});
            
          }
          else{
            updatedRow= update(rowHolder[count],{$merge:{id:count+1,key:match[1], value: match[2]}})
            rowHolder[count]=updatedRow;
          }
        }
        count=count+1;
      }  
    }
    this.setState( {rows: rowHolder});
    return obj;
  }

  sendRequest(){
    const timestamp= new Date().getTime() / 1000| 0,
    nonce=randomstring.generate({length: 12,charset: 'alphabetic'})
    console.log(this.state.url);
    if(this.state.oauth1_accessToken===""&&this.state.oauth1_tokenSecret===""){
      var httpMethod = this.state.httpmethod,
      url = this.state.url,
      parameters = {
          oauth_consumer_key : this.state.oauth1_consumerKey,
          oauth_nonce :nonce,
          oauth_timestamp :timestamp,
          oauth_signature_method : "HMAC-SHA1",
          // oauth_token: this.state.oauth1_accessToken,
          // oauth_verifier:""
      },
      consumerSecret = this.state.oauth1_consumerSecret,
      // oauth1_tokenSecret =this.state.oauth1_tokenSecret,
      // generates a RFC 3986 encoded, BASE64 encoded HMAC-SHA1 hash
      encodedSignature = oauthSignature.generate(httpMethod, url, parameters,consumerSecret ),
      // generates a BASE64 encode HMAC-SHA1 hash
      signature = oauthSignature.generate(httpMethod, url, parameters,consumerSecret ,
          { encodeSignature: false})
      
        console.log("encoded_signature= "+ encodedSignature)
        console.log("Signature= "+signature)
      //---------------------------------------------------------------------------------------
      var url =this.state.url+"?oauth_consumer_key="+parameters.oauth_consumer_key+"&oauth_nonce="+parameters.oauth_nonce+"&oauth_signature_method=HMAC-SHA1&oauth_timestamp="+parameters.oauth_timestamp+"&oauth_signature="+ encodedSignature
      this.parseQuery(url)
       axios.get(this.state.url+"?oauth_consumer_key="+parameters.oauth_consumer_key+"&oauth_nonce="+parameters.oauth_nonce+"&oauth_signature_method=HMAC-SHA1&oauth_timestamp="+parameters.oauth_timestamp+"&oauth_signature="+ encodedSignature )
      //  axios.get("https://api.xero.com/oauth/oauth1_AccessToken?oauth_consumer_key=NFJWQ22Z5I4EIYTNW6IUZEY5XVJ7NF&oauth_nonce="+parameters.oauth_nonce+"&oauth_signature_method=HMAC-SHA1&oauth_timestamp="+parameters.oauth_timestamp+"&oauth_token="+parameters.oauth_token+"&oauth_verifier="+parameters.oauth_verifier+"&oauth_signature="+encodedSignature )
      .then(function(res) {
        // res.body, res.headers, res.status
        console.log(res)
        console.log(res.data)
      })
      .catch(function(err) {
        // err.message, err.response
        console.log(err.response)
      });
    }
    else{
      var httpMethod = 'GET',
      url = this.state.url,
      parameters = {
          oauth_consumer_key : this.state.oauth1_consumerKey,
          oauth_nonce :this.state.nonce,
          oauth_timestamp :this.statetimestamp,
          oauth_signature_method : "HMAC-SHA1",
          oauth_token: this.state.oauth1_accessToken
      },
      oauth1_consumerSecret = this.state.oauth1_consumerSecret,
      oauth1_tokenSecret =this.state.oauth1_tokenSecret,
      // generates a RFC 3986 encoded, BASE64 encoded HMAC-SHA1 hash
      encodedSignature = oauthSignature.generate(httpMethod, url, parameters,oauth1_consumerSecret ,oauth1_tokenSecret),
      // generates a BASE64 encode HMAC-SHA1 hash
      signature = oauthSignature.generate(httpMethod, url, parameters, oauth1_consumerSecret ,oauth1_tokenSecret,
          { encodeSignature: false})
      
        console.log("encoded_signature= "+ encodedSignature)
        console.log("Signature= "+signature)
      //---------------------------------------------------------------------------------------
      var url= this.state.url+"&oauth_consumer_key="+parameters.oauth_consumer_key+"oauth_nonce="+parameters.oauth_nonce+"&oauth_signature_method=HMAC-SHA1&oauth_timestamp="+parameters.oauth_timestamp+"&oauth_token="+parameters.oauth_token+"&oauth_signature="+encodedSignature
       
      axios.get(this.state.url+"&oauth_consumer_key="+parameters.oauth_consumer_key+"oauth_nonce="+parameters.oauth_nonce+"&oauth_signature_method=HMAC-SHA1&oauth_timestamp="+parameters.oauth_timestamp+"&oauth_token="+parameters.oauth_token+"&oauth_signature="+encodedSignature )
      .then(function(res) {
        // res.body, res.headers, res.status
        console.log(res)
        console.log(res.data)
      })
      .catch(function(err) {
        // err.message, err.response
        console.log(err.response)
      });
    }
  }

  saveOAuth1data(newData){
    console.log(newData)
    if(newData.name==="consumerKey"){
      this.setState({oauth1_consumerKey:newData.value})
    }else if(newData.name==="consumerSecret"){
      this.setState({oauth1_consumerSecret:newData.value})
    }else if(newData.name==="accessToken"){
      this.setState({oauth1_accessToken:newData.value})
    }else if(newData.name==="tokenSecret"){
      this.setState({oauth1_tokenSecret:newData.value})
    }
    const ts= new Date().getTime() / 1000| 0,
    nonce=randomstring.generate({length: 12,charset: 'alphabetic'})
    this.setState({
      timestamp:ts,
      nonce:nonce
    })
  }

  render() {
    return (  
      <div>
        <Row >
        <Col componentClass={FormGroup} md={10}>
          <InputGroup>
            <DropdownButton componentClass={InputGroup.Button} id="input-dropdown-addon" title={this.state.httpmethod} onSelect={this.onSelectMethod}>
              <MenuItem defaultValue="GET" eventKey="GET" >GET</MenuItem>
              <MenuItem value="POST" eventKey="POST">POST</MenuItem>              
              <MenuItem value="PUT" eventKey="PUT">PUT</MenuItem>
              <MenuItem value="PATCH" eventKey="PATCH">PATCH</MenuItem>
              <MenuItem value="DELETE" eventKey="DELETE">DELETE</MenuItem>
              <MenuItem value="COPY" eventKey="COPY">COPY</MenuItem>
              <MenuItem value="HEAD" eventKey="HEAD">HEAD</MenuItem>              
              <MenuItem value="OPTIONS" eventKey="OPTIONS">OPTIONS</MenuItem>
              <MenuItem value="LINK" eventKey="LINK">LINK</MenuItem>
              <MenuItem value="UNLINK" eventKey="UNLINK">UNLINK</MenuItem>
              <MenuItem value="PURGE" eventKey="PURGE">PURGE</MenuItem>
              <MenuItem value="LOCK" eventKey="LOCK">LOCK</MenuItem>
              <MenuItem value="UNLOCK" eventKey="UNLOCK">UNLOCK</MenuItem>
              <MenuItem value="PROFIND" eventKey="PROFIND">PROFIND</MenuItem>
              <MenuItem value="VIEW" eventKey="VIEW">VIEW</MenuItem>
            </DropdownButton>
            <FormControl type="text" placeholder="Enter request URL" value={this.state.url} onChange={this.handleUrl}/>
            <InputGroup.Button>
              <Button  onClick={() => this.operation()}>Params</Button>
            </InputGroup.Button>
          </InputGroup>
        </Col>
        <Col >
          <Row  componentClass={FormGroup}>
            <SplitButton id="send" bsStyle="info" title="Send" onClick={this.sendRequest}>
              <MenuItem eventKey="1">Send and Download</MenuItem>
            </SplitButton>
            <SplitButton id="save" title="Save">
            < MenuItem eventKey="1">Save As</MenuItem>
            </SplitButton>
          </Row>
        </Col>
      </Row> 
      <div className="container">
      { this.state.showParams?<div><ReactDataGrid 
        ref={ node => this.grid = node }
        enableCellSelect={true}
        columns={this.getColumns()}
        rowGetter={this.getRowAt}
        rowsCount={this.getSize()}
        enableRowSelect={true}
        onGridRowsUpdated={this.handleChange}
        rowHeight={40}
        minHeight={150}
        minWidth={1080}
        rowScrollTimeout={200} /></div>
        :null
      }
      </div>
    <Tabs id="controlled-tab-example">
   
      <Tab className="container"eventKey={1} title="Authorization"><Authorization changeField={this.saveOAuth1data.bind(this)}/></Tab>
      <Tab className="container" eventKey={2} title="Body"><Body/></Tab>
      <Tab className="container" eventKey={3} title="Headers"><Header/></Tab>
      <Tab className="container" eventKey={4} title="Tests"><Test/></Tab>
    </Tabs>
  
      </div> 
    );
  }
}

export default Main;
