import React, { Component } from "react";
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
      value:"",
      form:true,
      urlEncoded:false,
      raw:false,
      binary:false
    }
    this.handleChange = this.handleChange.bind(this);
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
          <Form/>  
        </div>}

        {this.state.urlEncoded&&<div >
          <UrlEncoded/>
        </div>}
        
        {this.state.raw&&<div>
          <Raw />
        </div>}

        {this.state.binary&&<div>
          <Binary/>
        </div>} 
      </div>

    );
  }
}


export default Body;
