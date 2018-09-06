import React from "react";
import {Col,FormGroup,ControlLabel,FormControl} from 'react-bootstrap';
import update from 'immutability-helper';
import PropTypes from 'prop-types';

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

class Test extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.readOnly= false;
    this.state = {
      rows:this.createRows(1),
      parameters:  this.createRows(1),
      header: this.createRows(1),
      body:  this.createRows(1)
    }
    this.handleChangeParameter=this.handleChangeParameter.bind(this);
    this.handleChangeHeader=this.handleChangeHeader.bind(this);
    this.handleChangeBody=this.handleChangeBody.bind(this);
  }; 
  
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

  handleChangeParameter(event){
    var updateValue=event.target.value;
    var updateInKey=event.target.name;
    let rows = this.state.parameters ;

    {rows.map((e,i)=>{
      if(e.key===updateInKey){
        let updatedRow = update(rows[i], {$merge: {Value:updateValue}});
        this.state.rows[i] = updatedRow;
        this.setState({
          rows
        },function(){
          console.log(this.state.rows)
        })
      }
    })}
    this.props.changeTestParameters(this.state.rows);
  }

  handleChangeHeader(event){
    var updateValue=event.target.value;
    var updateInKey=event.target.name;
    let rows = this.state.header ;

    {rows.map((e,i)=>{
      if(e.key===updateInKey){
        let updatedRow = update(rows[i], {$merge: {Value:updateValue}});
        this.state.rows[i] = updatedRow;
        this.setState({
          rows
        },function(){
          console.log(this.state.rows)
        })
      }
    })}
    this.props.changeTestHeader(this.state.rows);
  }

  handleChangeBody(event){
    var updateValue=event.target.value;
    var updateInKey=event.target.name;
    let rows = this.state.body ;

    {rows.map((e,i)=>{
      if(e.key===updateInKey){
        let updatedRow = update(rows[i], {$merge: {Value:updateValue}});
        this.state.rows[i] = updatedRow;
        this.setState({
          rows
        },function(){
          console.log(this.state.rows)
        })
      }
    })}
    this.props.changeTestBody(this.state.rows);
  }

  componentDidUpdate(prevProps){
    if (this.props.headerParams!== prevProps.headerParams||this.props.bodyParams!== prevProps.bodyParams||this.props.parameters!== prevProps.parameters||this.props.response!=prevProps.response) {
      this.setState({
        parameters:this.props.parameters,
        header:this.props.headerParams,
        body:this.props.bodyParams,
        response:JSON.stringify(this.props.response)
      })
    }
  }

  render () {
    return (
      <div>
        <h2>Request</h2>
        <hr/>
        <h4>parameters</h4>
        {this.state.parameters.map((e,n) =>
         <FieldGroup key={n} name={e.key}  label={e.key} onBlur={this.handleChangeParameter} type="text" placeholder="Enter Value"  />
        )}  
        <h4>Headers</h4>
        {this.state.header.map((e,n) =>
         <FieldGroup key={n} name={e.key}  label={e.key} onBlur={this.handleChangeHeader} type="text" placeholder="Enter Value"  />
        )}  
        <h4>Body</h4>
        {this.state.body.map((e,n) =>
         <FieldGroup key={n} name={e.key}  label={e.key} onBlur={this.handleChangeBody} type="text" placeholder="Enter Value"  />
        )} 
        
        <h2>Response</h2>
        <hr/>
        {this.state.response}
        
      </div>
    );
  } 
};
export default Test;

Test.propTypes = {
  parameters:PropTypes.array,
  headerParams: PropTypes.array,
  bodyParams:PropTypes.array,
  Response:PropTypes.array
}