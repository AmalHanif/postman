import React, { Component } from "react";
import {Route,NavLink,HashRouter} from "react-router-dom";
import {FormGroup, InputGroup,DropdownButton,Button,FormControl,MenuItem,SplitButton,Row,Col } from 'react-bootstrap';
import ReactDataGrid from 'react-data-grid';
import update from 'immutability-helper';

import Authorization from "./components/authorizations/authorization";
import Header from "./components/Header";
import Body from "./components/body/body";
import Test from "./components/test";
import Testing from "./components/testing";

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
       url:"",
       value:"",
       query:"?key=12234",
       finalQuery : "",
       currentRowId:0,
       rows: this.createRows(1),
       showMe:false,
       isDialogOpen: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleUrl = this.handleUrl.bind(this);
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
      showMe:!this.state.showMe
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
          updatedRow= update(rowHolder[index],{$merge:{key:match[1], value: match[2]}})
          rowHolder[count]=updatedRow;
        }else{
          if(rowHolder[count]===rowHolder.lenght){ 
            rowHolder.push({key:match[1], value: match[2]})
            const newRow = this.createRowObjectData(count);
            rowHolder = update( this.state.rows, {$push: [newRow]});
          }
          else{
            updatedRow= update(rowHolder[count],{$merge:{key:match[1], value: match[2]}})
            rowHolder[count]=updatedRow;
          }
        }
        count=+1;
      }  
    }
    this.setState( {rows: rowHolder});

    console.log(this.state);
    return obj;
  }
  render() {
    return (
      <div >
        <Row >
        <Col componentClass={FormGroup} md={10}>
          <InputGroup>
            <DropdownButton componentClass={InputGroup.Button} id="input-dropdown-addon" title="action">
              <MenuItem value="GET" eventKey="GET" >GET</MenuItem>
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
            <SplitButton id="send" bsStyle="info" title="Send">
              <MenuItem eventKey="1">Send and Download</MenuItem>
            </SplitButton>
            <SplitButton id="save" title="Save">
            < MenuItem eventKey="1">Save As</MenuItem>
            </SplitButton>
          </Row>
        </Col>
      </Row> 
      { this.state.showMe?<div><ReactDataGrid 
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
      
      <HashRouter>
        <div>
          <ul className="navBar">
              <li><NavLink exact to="/">Authorization</NavLink></li>
              <li><NavLink to="/header">Header</NavLink></li>
              <li><NavLink to="/body">Body</NavLink></li>
              <li><NavLink to="/test">Test</NavLink></li>
          </ul>
          <div className="content">
              <Route exact path="/"  component={Authorization}/>
              <Route path="/header" component={Header}/>
              <Route path="/body" component={Body}/>
              <Route path="/test" component={Test}/>
              <Route path="/testing" component={Testing}/>
          </div>
        </div>
      </HashRouter>
      </div> 
    );
  }
}

export default Main;
