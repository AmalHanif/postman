import React, { Component } from "react";
import{FormGroup,ControlLabel, FormControl,Col } from 'react-bootstrap';
export class BearerToken extends Component {
 render() {
   return (
     <div>
      <FormGroup>
          <Col componentClass={ControlLabel} md={4}>Token</Col>
          <Col md={8}>
            <FormControl type="text" placeholder="Token" />
          </Col>
        </FormGroup>
     </div>
   );
 }
}