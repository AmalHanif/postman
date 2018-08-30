import React, { Component } from "react";
import {DropdownButton,MenuItem } from 'react-bootstrap';
// import {Link,BrowserRouter} from "react-router-dom";
// import { Route, Switch } from "react-router";
import Form  from "./body/form";
import UrlEncoded from "./body/urlEncoded";
import Raw from "./body/raw";
import Binary from "./body/binary";

class Body extends Component   {
  constructor(){
    super();
    this.state={
      value:"form",
      form:true,
      urlEncoded:false,
      raw:false,
      binary:false,
      formData:"" 
    }
    this.handleChange = this.handleChange.bind(this);
    this.saveFormData =this.saveFormData.bind(this)
    this.operation = this.operation.bind(this);
  }
  
  handleChange(event) {
    this.setState({
      value:event.target.value,
      form:false,
      urlEncoded:false,
      raw:false,
      binary:false
    },function(){ this.operation(event);}
  );
  //  if(raw){
  //    this.setState({
  //      selector:true
  //    })
  //  }
  };
  operation(event){
    let i= this.state.value;
    switch (i) {
      default:
      this.setState({form:!this.state.form});
          break; 
      case "urlEncoded":
      this.setState({urlEncoded:!this.state.urlEncoded}); 
          break;
      case "raw":
      this.setState({raw:!this.state.raw});
          break;
      case "binary":
      this.setState({ binary:!this.state.binary})
    }
  };

  saveFormData(newData) {
    this.setState({
      formData:newData
    },function(){
      this.onChangeField();
      console.log(this.state.formData)
    });
  }
  onChangeField() {
    this.props.changeForm(this.state.formData);
    // this.props.changeFieldValue(this.state.oAuth1Value)
  }

  render() {
    return(
      <div>
        <form> 
        <div className="radio" >
          <label>
            <input type="radio" value="form"  checked={this.state.value==="form" } onChange={this.handleChange}/>
              form-data
          </label>
          <label>
            <input type="radio" value="urlEncoded"  checked={this.state.value==="urlEncoded"} onChange={this.handleChange}/>
              urlEncoded
          </label>
          <label>
            <input type="radio" value="raw"  checked={this.state.value==="raw"} onChange={this.handleChange}/>
              Raw
          </label>
          <label>
            <input type="radio" value="binary"  checked={this.state.value==="binary" } onChange={this.handleChange}/>
              Binary
          </label>
        </div>
        </form>
        {this.state.form&&<div>
          <Form changeForm={this.saveFormData.bind(this)} />  
        </div>}

        {this.state.urlEncoded&&<div >
          <UrlEncoded changeForm={this.saveFormData.bind(this)} />
        </div>}
        
        {this.state.raw&&<div>
          <DropdownButton title="TEXT" id="dropdown-size-medium">
            <MenuItem eventKey="1">Text</MenuItem>
            <MenuItem eventKey="2">Text(text/plain)</MenuItem>
            <MenuItem eventKey="3">JSON(application/json)</MenuItem>
            <MenuItem eventKey="4">JavaScript(application/javaScript)</MenuItem>
            <MenuItem eventKey="5">XML(application/xml)</MenuItem>
            <MenuItem eventKey="6">XML(text/xml)</MenuItem>
            <MenuItem eventKey="7">HTML(text/html)</MenuItem>
          </DropdownButton>
       
          <Raw changeForm={this.saveFormData.bind(this)} />
          
        </div>}

        {this.state.binary&&<div>
          <Binary changeBinary={this.saveFormData.bind(this)}  />
        </div>} 
      </div>

    );
  }
}


export default Body;
