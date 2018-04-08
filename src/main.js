import React, { Component } from "react";
import {Route,NavLink,HashRouter} from "react-router-dom";
import {FormGroup, InputGroup,DropdownButton,Button,FormControl,MenuItem,SplitButton,Row,Col } from 'react-bootstrap';
import ReactDataGrid from 'react-data-grid';
import update from 'immutability-helper';

import Authorization from "./components/authorizations/authorization";
import Header from "./components/Header";
import Body from "./components/body/body";
import Test from "./components/test";


class Main extends Component {
  constructor(props, context) {
    super(props, context);
  
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


  handleGridRowsUpdated = ({ fromRow, toRow, rowIds, updated,newRowIndex,numberOfRows }) => {
    let rows = this.state.rows.slice();
    console.log(fromRow,toRow, rowIds)
    for (let i = fromRow; i <= toRow; i++) {
      if(this.state.rows.length===rows[i].id){ //checked Is this last row?
        let rowToUpdate = rows[i];
        let updatedRow = update(rowToUpdate, {$merge: updated});
        rows[i] = updatedRow;
        if(rows[i].key!=="" || rows[i].value!=="" ||rows[i].description!=="" ){ //If any cell in the last row is not empty then creat new row.
          const newRow = {
            id: rows[i].id+1 ,
            key:'',
            value: '',
            description: '',
          };
          rows = update(rows, {$push: [newRow]});   
        }
      }else{
        let rowToUpdate = rows[i];
        let updatedRow = update(rowToUpdate, {$merge: updated});
        rows[i] = updatedRow;
      } 
    }  
      // if(rows[i].id===1){
      //   this.setState({
      //     Qkey:"?"+rows[i].key ,
      //     Qvalue:"="+rows[i].value},function(){
      //       this.setState({
      //         query:this.state.Qkey + this.state.Qvalue
      //       })  
      //     }
      //   )
      // }else{
      //   this.setState({
      //     Qkey:"&"+rows[i].key ,
      //     Qvalue:"="+rows[i].value},function(){
      //       this.setState((prevState) => {
      //         return {query:prevState.query+this.state.Qkey + this.state.Qvalue} 
      //       })  
      //     }
      //   )
      // }
      
  
    
    // for(let j=0; j<=2; j++ ){
    //   console.log(this.state.rows[j].key);
    //   query="?"+ this.state.rows[j].key+"="+this.state.rows[j].value;
    //   sum= sum+query;
    // }
    // this.setState({ rows })
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
  
  handleChange( updated){
      // console.log(this.state)
      console.log(updated);
      if (updated.cellKey === "key" ) {
       this.state.rows[updated.fromRow].key =  updated.updated.key;
      }else if(updated.cellKey === "value"){
        this.state.rows[updated.fromRow].value =  updated.updated.value;
      }
      // only add if row has both key and value
      let currentRow = this.state.rows[updated.fromRow];

      if (currentRow.key && currentRow.value) {
        this.state.rows[updated.fromRow].is_complete = true
      }
      // add new row
      if(this.state.rows.length===updated.fromRowId){
        if(currentRow.key!=="" || currentRow.value!=="" ||currentRow.description!=="" ){ //If any cell in the last row is not empty then creat new row.
          const newRow = this.createRowObjectData(currentRow.id);
          this.state.rows = update( this.state.rows, {$push: [newRow]});   
        }
      }  
      // ----
  
      this.triggerQueryChange();
       
      console.log(this.state);
      // this.setState({url:event.target.value},function () {
      //   this.setState({
      //     value:this.state.url+this.state.query },function () {
      //     console.log(this.state)
      //     })
      // })
    
  };

  triggerQueryChange(){

    let query = this.parseQuery(this.state.url);
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
    // this.setState({url :""});
    
    this.setState({url : updated.target.value},function(){this.parseQuery(this.state.url);});
    // this.state.url = updated.target.value;
    

    
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
  parseQuery(url){
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
    // let rowHolder = Object.assign({}, this.state.rows);
    // let rowHolder = this.state.rows;
    let rowHolder = this.state.rows;
    this.setState( {rows: null});
    console.log(this.state.rows)
    while (match = regex.exec(url)) {
      obj.params[match[1]] = match[2];
      // replace if exists
      let index = this.findInArray  (rowHolder, match[1]);
      if (index > -1) {
        rowHolder[index].value = match[2];
      }
      rowHolder.push({key:match[1], value: match[2]});
    }
    
    this.setState( {rows: rowHolder});

    
    console.log(this.state);
    return obj;
  }
    render() {
      return (
        // console.log(this.state.rows),
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
              {/* <FormControl type="text" placeholder="Enter request URL"  value={this.state.url} />  */}
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
          minHeight={250}
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
            </div>
          </div>
        </HashRouter>
       </div> 
      );
    }
  }

export default Main;
