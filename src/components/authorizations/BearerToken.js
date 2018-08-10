import React, { Component } from "react";
import{FormGroup,ControlLabel, FormControl,Col } from 'react-bootstrap';
export class BearerToken extends Component {

  constructor(props, context) {
    super(props);
   
    this.state = {
      bearerToken:""
    }
  }
  
  onHandleChange(event,prevState) {
    let newData={};
      newData.name=event.target.name
      newData.value=event.target.value
    
    this.setState(prevState => ({
      bearerToken:newData
    }),function(){
      this.onChangeField();
      console.log(this.state.bearerToken.name+" : "+this.state.bearerToken.value)
    });     
  }

  onChangeField() {
    this.props.changeField(this.state.bearerToken);
    // this.props.changeFieldValue(this.state.oAuth1Value)
  } 

  render() {
    return (
      <div>
        <FormGroup>
          <Col componentClass={ControlLabel} md={4}>Token</Col>
          <Col md={8}>
            <FormControl type="text" name="bearerToken" defaultValue={this.state.bearerToken} onBlur={(event) => this.onHandleChange(event)} placeholder="Token" />
          </Col>
        </FormGroup>
     </div>
   );
 }
}