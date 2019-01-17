import React, { Component } from "react";
import {DropdownButton,MenuItem } from 'react-bootstrap';
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
      formData:{},
      TextTitle:"Text"
    }
    this.handleChange = this.handleChange.bind(this);
    this.saveFormData =this.saveFormData.bind(this)
    this.operation = this.operation.bind(this);
    this.onSelectEditor =this.onSelectEditor.bind(this);
  }
  
  handleChange(event) {
    this.setState({
      value:event.target.value,
      form:false,
      urlEncoded:false,
      raw:false,
      binary:false
    },function(){
       this.operation(event);
    })
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
    });
  }
  onChangeField() {
    this.props.changeForm(this.state.formData);
  }

  onSelectEditor(value){
    this.setState({
      TextTitle:value
    })
  }

  render() {
    return(
      <div>
        <form>
        <div >
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
          <DropdownButton title={this.state.TextTitle} id="dropdown-size-medium" value={this.state.TextTitle}>
            <MenuItem onSelect={(event) => this.onSelectEditor(event)} eventKey="Text">Text</MenuItem>
            <MenuItem onSelect={(event) => this.onSelectEditor(event)} eventKey="Text(text/plain)">Text(text/plain)</MenuItem>
            <MenuItem onSelect={(event) => this.onSelectEditor(event)} eventKey="JSON(application/json)">JSON(application/json)</MenuItem>
            <MenuItem onSelect={(event) => this.onSelectEditor(event)} eventKey="JavaScript(application/javaScript)">JavaScript(application/javaScript)</MenuItem>
            <MenuItem onSelect={(event) => this.onSelectEditor(event)} eventKey="XML(application/xml)">XML(application/xml)</MenuItem>
            <MenuItem onSelect={(event) => this.onSelectEditor(event)} eventKey="XML(text/xml)">XML(text/xml)</MenuItem>
            <MenuItem onSelect={(event) => this.onSelectEditor(event)} eventKey="HTML(text/html)">HTML(text/html)</MenuItem>
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
