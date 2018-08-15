import React, { Component } from "react";
import {FormGroup, InputGroup,DropdownButton,Button,FormControl,MenuItem,SplitButton,Row,Col,Tabs, Tab } from 'react-bootstrap';
import ReactDataGrid from 'react-data-grid';
import update from 'immutability-helper';
import axios from 'axios';
// import { AxiosProvider, Request, Get, Delete, Head, Post, Put, Patch, withAxios } from 'react-axios';
// import request from "../node_modules/superagent/superagent";
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
        value:"",
        editable: true,
        resizable: true
      },
      {
        key: 'Value',
        name: 'Value',
        value:"",
        editable: true,
        resizable: true
      },
      {
        key: 'description',
        name: 'Description',
        editable: true,
        resizable: true
      },
    ];

    this.state = {
      sendDownload:false,
      headerParams:[],
      bodyParams:[],
      oauth1_consumerKey:"",
      oauth1_consumerSecret:"",
      oauth1_accessToken:"",
      oauth1_tokenSecret:"",
      bearerToken:"",
      httpmethod:"GET",
      header:"",
      body:"",
       key:"",
       url:"",
       value:"",
       finalQuery : "",
       currentRowId:0,
       rows: this.createRows(1),
       selectedIndexes: [],
       showParams:false,
       isDialogOpen: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleUrl = this.handleUrl.bind(this);
    this.sendRequest = this.sendRequest.bind(this);
    this.saveData = this.saveData.bind(this);
    this.saveHeader =this.saveHeader.bind(this)
    this.saveBodyForm =this.saveBodyForm.bind(this)
    this.onSelectMethod = this.onSelectMethod.bind(this);
    // this.addParams = this.addParams.bind(this);
  }
  onSelectMethod(event){
    this.setState({
      httpmethod:event
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
      Value: '',
      description: '',
    };
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

  onRowsSelected = (rows) => {
    this.setState({selectedIndexes: this.state.selectedIndexes.concat(rows.map(r => r.rowIdx))});
  };

  onRowsDeselected = (rows) => {
    let rowIndexes = rows.map(r => r.rowIdx);
    this.setState({selectedIndexes: this.state.selectedIndexes.filter(i => rowIndexes.indexOf(i) === -1 )});
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

    for (var index = 0; index < this.state.rows.length-1; index++) {
      let symbol = "&";        
      if (index === 0) {
        symbol = "?";
      }
      if (this.state.rows[index].key!==""&&this.state.rows[index].Value!=="") {
        finalQueryBuilder += symbol;
        finalQueryBuilder += this.state.rows[index].key;
        finalQueryBuilder += "=";
        finalQueryBuilder += this.state.rows[index].Value;
      } else if(this.state.rows[index].key!==""||this.state.rows[index].Value===""){
        finalQueryBuilder += symbol;
        finalQueryBuilder += this.state.rows[index].key;
      }else if(this.state.rows[index].key===""){
        finalQueryBuilder = query.urlValue
      }
    }
    this.setState({url :finalQueryBuilder},function(){
      return (this.state.url)
    });
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
      if (element.key === needle[1]|| element.Value===needle[2]){
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
    var numOfParam = url.match(/[a-z\d]+=[a-z\d]+/gi);
    var countParam = numOfParam? numOfParam.length : 0;
    
    let rowHolder = this.state.rows,
        updatedRow=[];

    if(currentRowId===undefined){
      this.state.rows=null;
      let count=0;
      while (match = regex.exec(url)) {
        obj.params[match[1]] = match[2];

        if(count< countParam){
          rowHolder[count].value = match[2];
          updatedRow= update(rowHolder[count],{$merge:{id:count+1, Value:match[2],key:match[1]}})
          rowHolder[count]=updatedRow;
          
          this.state.rows=rowHolder;
          if(count===rowHolder.length-1){
           const newRow = this.createRowObjectData(count+1);
            rowHolder = update( this.state.rows, {$push: [newRow]})
          }
          count+=1
        }
      } this.setState( {rows: rowHolder});
    }
    return obj;
  }
  sendRequest(){
    var httpMethod = this.state.httpmethod,
    url = this.state.url;

    if(this.state.oauth1_consumerKey!==""){
      const timestamp= new Date().getTime() / 1000| 0,
      nonce=randomstring.generate({length: 12,charset: 'alphabetic'})
      console.log(this.state.url);
      
      httpMethod = this.state.httpmethod
      url = this.state.url
      var parameters = {
          oauth_consumer_key : this.state.oauth1_consumerKey,
          oauth_nonce :nonce,
          oauth_timestamp :timestamp,
          oauth_signature_method : "HMAC-SHA1",
      },
      consumerSecret = this.state.oauth1_consumerSecret

      if(this.state.oauth1_accessToken!==""&&this.state.oauth1_tokenSecret1!==""){
        parameters=Object.assign(parameters,{oauth_token: this.state.oauth1_accessToken})
        url= this.state.url+"&oauth_consumer_key="+parameters.oauth_consumer_key+"&oauth_signature_method=HMAC-SHA1&oauth_nonce="+parameters.oauth_nonce+"&oauth_timestamp="+parameters.oauth_timestamp+"&oauth_token="+parameters.oauth_token
        var obj= this.parseQuery(url),
         tokenSecret =this.state.oauth1_tokenSecret,
        // generates a RFC 3986 encoded, BASE64 encoded HMAC-SHA1 hash
        encodedSignature = oauthSignature.generate(httpMethod, obj.urlValue, obj.params,consumerSecret,tokenSecret )
      
        url= this.state.url+"&oauth_consumer_key="+parameters.oauth_consumer_key+"&oauth_signature_method=HMAC-SHA1&oauth_nonce="+parameters.oauth_nonce+"&oauth_timestamp="+parameters.oauth_timestamp+"&oauth_token="+parameters.oauth_token+"&oauth_signature="+encodedSignature
        this.parseQuery(url)
        // this.triggerQueryChange()
      }
      else{
        // generates a RFC 3986 encoded, BASE64 encoded HMAC-SHA1 hash
        encodedSignature = oauthSignature.generate(httpMethod, url, parameters,consumerSecret )
       
        url =this.state.url+"?oauth_consumer_key="+parameters.oauth_consumer_key+"&oauth_signature_method=HMAC-SHA1&oauth_nonce="+parameters.oauth_nonce+"&oauth_timestamp="+parameters.oauth_timestamp+"&oauth_signature="+ encodedSignature
        this.parseQuery(url)
        // this.triggerQueryChange()
      }
      axios({
        method:httpMethod,
        url:url,
        headers:this.state.header,
        data:this.state.body
      })
      .then(function(res) {
        // res.body, res.headers, res.status
        console.log('Upload successful!  Server responded with:', res);
        console.log(res)
        console.log(res.data)
      })
      .catch(function(err) {
        // err.message, err.response
        console.log(err.response)
      });
    }  
    //---------------------------------------------------------------------------------------
    if(this.state.bearerToken!==""){
      var rowSize=this.state.headerRows.length
    //pass token in header
      var rowHolder= update(this.state.headerRows[rowSize-1],{$merge:{id:this.state.headerRows.length, key:"Authorization", Value :"Bearer "+this.state.bearerToken}})
      this.state.headerRows[rowSize-1]=rowHolder
    //create new row
      const newRow = this.createRowObjectData(rowSize+1);
      rowHolder = update( this.state.headerRows, {$push: [newRow]})
      this.state.headerRows[rowSize+1]=rowHolder
      this.setState({
        headerParams:this.state.headerRows
      })
      console.log(this.state.header,this.state.headerParams)
    
      axios({
        method:httpMethod,
        url:this.state.url,
        headers:this.state.header,
        data:this.state.body
      }).then(function(response) {
        console.log('Upload successful! Server responded with:', response.data)
      }).catch(function(err) {
        // err.message, err.response
        console.log(err.response)
      });
    }
    else{
      axios({
        method:  httpMethod,
        url:this.state.url,
        headers:this.state.header,
        data:JSON.stringify(this.state.body)
      })
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

  saveData(newData){
    console.log(newData)
    if(newData.name==="consumerKey"){
      this.setState({oauth1_consumerKey:newData.value})
    }else if(newData.name==="consumerSecret"){
      this.setState({oauth1_consumerSecret:newData.value})
    }else if(newData.name==="accessToken"){
      this.setState({oauth1_accessToken:newData.value})
    }else if(newData.name==="tokenSecret"){
      this.setState({oauth1_tokenSecret:newData.value})
    }else if(newData.name==="bearerToken"){
      this.setState({
        bearerToken:newData.value,
      })
    }else{
      this.setState({
        oauth1_consumerKey:"",
        oauth1_consumerSecret:"",
        oauth1_accessToken:"",
        oauth1_tokenSecret:"",
        bearerToken:""
      })
    }
  }
  saveHeader(newData,headerRow) {
    this.setState({
      header:newData,
      headerRows:headerRow
    })

  }
  saveBodyForm(newData) {
    this.setState({
      body:newData
    },function(){
      console.log(this.state.body)
    })
  }
  savetest(newData){
    this.setState({
      test:newData
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
              <MenuItem eventKey="1" >Send and Download</MenuItem>
            </SplitButton>
            <SplitButton id="save" title="Save">
            < MenuItem eventKey="1">Save As</MenuItem>
            </SplitButton>
          </Row>
        </Col>
      </Row> 
      <div >
      { this.state.showParams?<div><ReactDataGrid 
        ref={ node => this.grid = node }
        enableCellSelect={true}
        columns={this._columns}
        rowGetter={this.getRowAt}
        rowsCount={this.state.rows.length}
        enableRowSelect={true}
        onGridRowsUpdated={this.handleChange}
        rowHeight={40}
        minHeight={250}
        rowScrollTimeout={200}
        rowSelection={{
          showCheckbox: true,
          enableShiftSelect: true,
          onRowsSelected: this.onRowsSelected,
          onRowsDeselected: this.onRowsDeselected,
          selectBy: {
            indexes: this.state.selectedIndexes
          }
        }} /></div>
        :null
      }
      </div>
      <Tabs id="controlled-tab-example">
    
        <Tab className="container" eventKey={1} title="Authorization"><Authorization changeField={this.saveData.bind(this)}/></Tab>
        <Tab className="container" eventKey={2} title="Body"><Body  changeForm={this.saveBodyForm.bind(this)}  /></Tab>
        <Tab className="container" eventKey={3} title="Headers"><Header  changeHeader={this.saveHeader.bind(this)} headerParams={this.state.headerParams}/></Tab>
        <Tab className="container" eventKey={4} title="Tests"><Test changeForm={this.savetest.bind(this)}/></Tab>
      </Tabs>
    </div> 
    );
  }
}

export default Main;
