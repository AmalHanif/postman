import React, { Component } from "react";
import {Row,Col,FormGroup,Button,ButtonGroup,Glyphicon,FormControl,Popover,OverlayTrigger,Table} from 'react-bootstrap';
import ReactDataGrid from 'react-data-grid';
import update from 'immutability-helper';
import Dialog from 'react-dialog';


const columns = [
    {
        key: 'variables',
        name: 'VARIABLES',
        value:"",
        editable: true,
        resizable: true
    },
    {
        key: 'intialVariable',
        name: 'INTIAL VARIABLE',
        value:"",
        editable: true,
        resizable: true
    },
    {
        key: 'currentVariable',
        name: 'CURRENT VARIABLE',
        editable: true,
        resizable: true
    },
    {   
        key:'action',
        name: 'action',
        editable: true,
        resizable: true,
        width:80, 
        filterable:true
    },
];

class Environment extends Component{

    constructor(props) {
        super(props);
        this.state ={
            SelectedEvt:[],
            value:"No Environment",
            evtName:"",
            selectedIndexes: [],
            manage_environments:false,
            addEnvironment:false,
            varRows: this.createRows(1),
            environments:[]
        }
        this.openDialog=this.openDialog.bind(this); 
        this.addEnvironment=this.addEnvironment.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.getCellActions=this.getCellActions.bind(this);
        this.onChangeEvtName=this.onChangeEvtName.bind(this);
        this.handleSelect=this.handleSelect.bind(this);
        this.editable=this.editable.bind(this);
    }

    openDialog=()=>this.setState({ 
        manageEnvironment: true,
        addEnvironment:false,
    })
    addEnvironment=()=>this.setState({
        manageEnvironment: false,
        addEnvironment:true,
    })
    handleClose = () =>this.setState({
        manageEnvironment: false,
        addEnvironment:false,
    })
    onSelectMethod(event){
        this.setState({
            httpmethod:event
        })
    }
    createRows = (numberOfRows) => {
        let varRows = [];
        for (let i = 0; i < numberOfRows; i++) {
            varRows[i] = this.createRowObjectData(i);
        }
        return varRows;
    };

    createRowObjectData = (index) => {
    return {
        id: index+1,
        variables:'',
        intialVariable: '',
        currentVariable:'',
        };
    };
    
    getRowAt = (index) => {
    if (index < 0 || index > this.getSize()) {
        return undefined;
    }

    return this.state.varRows[index];
    };

    getSize = () => {
    return this.state.varRows.length;
    };

    onRowsSelected = (rows) => {
        this.setState({selectedIndexes: this.state.selectedIndexes.concat(rows.map(r => r.rowIdx))});
    };

    onRowsDeselected = (rows) => {
    let rowIndexes = rows.map(r => r.rowIdx);
    this.setState({selectedIndexes: this.state.selectedIndexes.filter(i => rowIndexes.indexOf(i) === -1 )});
    };
   
    getCellActions(column, row) {
      if (column.key === "action") {
        return[{   
            icon: 'glyphicon glyphicon-remove',
            callback:() => {
                if(row.id!==this.state.varRows.length){
                    this.state.varRows.splice(row.id-1, 1);
                    var rowHolder=this.state.varRows;
                    for(let count=0;count<rowHolder.length;count++){//Restroed all rows ids 
                        var updatedRow= update(rowHolder[count],{$merge:{id:count+1, variables:rowHolder[count].variables,intialVariable:rowHolder[count].intialVariable,currentVariable:rowHolder[count].currentVariable}})
                        rowHolder[count]=updatedRow;
                    }
                    this.setState({varRows: this.state.varRows});
                };
            }
        },{
            icon: 'glyphicon glyphicon-option-horizontal',
            actions: [{
                text: 'Presist',
                callback: () => { 
                    var rowHolder=this.state.varRows;
                    var updatedRow= update(rowHolder[row.id-1],{$merge:{id:row.id, variables:row.variables,intialVariable:row.currentVariable,currentVariable:row.currentVariable}})
                    rowHolder[row.id-1]=updatedRow;
                    this.setState({varRows:rowHolder});
                }
            },{
                text: 'Reset',
                callback: () => {
                    var rowHolder=this.state.varRows;
                    var updatedRow= update(rowHolder[row.id-1],{$merge:{id:row.id, variables:row.variables,intialVariable:row.intialVariable,currentVariable:row.intialVariable}})
                    rowHolder[row.id-1]=updatedRow;
                    this.setState({varRows:rowHolder});
                }
            }]
        }];
      }
    }

    handleChange = ({ fromRow, toRow, updated,newRowIndex,numberOfRows,rowIds }) => {
        let rows = this.state.varRows.slice();
        for (let i = fromRow; i <= toRow; i++) {
          if(this.state.varRows.length===rows[i].id){
                                    
            let rowToUpdate = rows[i];
            let updatedRow = update(rowToUpdate, {$merge: updated});
            rows[i] = updatedRow;
            if(rows[i].key!=="" || rows[i].value!=="" ||rows[i].description!=="" ){
              const newRow = this.createRowObjectData(rows.length);
              rows = update(rows, {$push: [newRow]}); 
            }   
          } 
          else{
            let rowToUpdate = rows[i];
            let updatedRow = update(rowToUpdate, {$merge: updated});
            rows[i] = updatedRow;
          }
        }
        this.setState({
            varRows:rows

        })
    }    
    onChangeEvtName(e){
        this.setState({
            evtName:e.target.value
        })
    }
    addedEnvironment(){ 
        var addNewEvt=this.state.environments
        this.state.varRows.evtName=this.state.evtName
        addNewEvt = update(addNewEvt, {$push: [this.state.varRows]});
    
        this.setState({
            SelectedEvt:this.state.varRows,
            environments:addNewEvt,
            varRows:[],
        },function(){
            console.log(this.state.environments);
            const newRow = this.createRowObjectData(0);
            this.state.varRows = update(this.state.varRows, {$push: [newRow]});   
            }   
        );
        this.openDialog();
        
    }
    
    duplicate(event){
        let rowNo=event.n,
        rowHolder=this.state.environments[rowNo]
        rowHolder = Object.assign([], rowHolder, {evtName: rowHolder.evtName+ " Copy" })
        var addNewEvt=this.state.environments
        addNewEvt = update(addNewEvt, {$push: [rowHolder]});
        this.setState({
            environments:addNewEvt,
        })
    }

    delete(event){
        let rowNo=event.n,
        addNewEvt=this.state.environments
        addNewEvt = update(addNewEvt, {$splice:( [[rowNo, 1 ]])});
        this.setState({
            environments:addNewEvt,
        })
    }
    handleSelect(event){
        let rowNo=event.target.value
        this.setState({
            SelectedEvt:this.state.environments[rowNo]
        })
        this.EvtProps();
    }

    editable(){
        this.setState({
            varRows:this.state.SelectedEvt,
            evtName:this.state.evtName
        },function(){
            const newRow = this.createRowObjectData(0);
            this.state.varRows = update(this.state.varRows, {$push: [newRow]});   
           this.addEnvironment(); }   
        );
        
    }

    EvtProps() {
        this.props.environment(this.state.SelectedEvt);
    }

    render() {

        const popoverClickRootClose = (
            <Popover id="popover-trigger-click-root-close" title={this.state.SelectedEvt.evtName}>
                <strong onClick={this.editable}><Button bsStyle="link">Edit</Button></strong> 
                <Table responsive>
                    <thead>
                        <tr>
                        <th>Variables</th>
                        <th>Intial Variable</th>
                        <th>Current Variable</th>
                        </tr>
                    </thead> 
                    
                    <tbody>
                        {this.state.SelectedEvt.map((e, i) =>
                            <tr key={i}>
                                <td>{e.variables}</td>
                                <td>{e.intialVariable}</td>
                                <td>{e.currentVariable}</td>
                            </tr> 
                        )} 
                    </tbody>
                </Table>    
            </Popover>
        );

        return (
        <div>
        <Row  className="show-grid">
          <Col componentClass={FormGroup} md={3} xsOffset={8}>
            <FormControl name="Environment" onChange={this.handleSelect} title="no Environment" componentClass="select" >
            
            {this.state.environments.map((e, n) =>  
                <option key={n} value={n}>{e.evtName}</option>
            )} 
            </FormControl> 
          </Col>  
          <Col md={1}>
            <OverlayTrigger trigger="click" rootClose placement="bottom" overlay={popoverClickRootClose} >
                <Button>
                    <Glyphicon glyph="glyphicon glyphicon-eye-open" />
                </Button>
            </OverlayTrigger>
        
            <Button onClick={this.openDialog}>
              <Glyphicon glyph="glyphicon glyphicon-cog" />
            </Button>
          </Col> 
        </Row>
        {this.state.manageEnvironment &&
          <Dialog class="dialog" title="MANAGE ENVIORMENTS" isResizable={true} modal={true} width={800} onClose={this.handleClose}  
           buttons={[{bsStyle:"warning", text: "Globals",onClick: () => this.handleClose()},{ text: "Import",onClick: () => this.handleClose()},{ text: "Add",onClick:() => this.addEnvironment()}]}
          > 
            <p>An environment is a set of variables that allow you to switch the context of your requests. Environments can be shared between multiple workspaces.
              <a   href="https://www.getpostman.com/docs/v6/postman/environments_and_globals/manage_environments">Learn more about environment</a> 
            </p>
            <p>You can declare a variable in an environment and give it a starting value, then use it in a request by putting the variable name within curly-braces.<a  href=""> Create an environment</a> to get started.</p>

            <div>{this.state.environments.map((e, n) =>
                <div key={n}>
                   <h5 onClick={this.editable}> {e.evtName}</h5>
                    <Col md={3} xsOffset={10}>
                    <ButtonGroup>
                        <Button value={n} onClick={({event}) => this.duplicate({n})}>
                            <Glyphicon glyph="glyphicon glyphicon-duplicate"/>
                        </Button>
                        <Button value={n} onClick={(event) => this.delete({n})}>
                             <Glyphicon glyph="glyphicon glyphicon-trash" /> 
                        </Button>
                    </ButtonGroup>
                    </Col>
                </div> 
            )}</div>

          </Dialog>
        }
        {this.state.addEnvironment &&
            <Dialog class="dialog" title="MANAGE ENVIORMENTS" modal={true} width={800} onClose={this.handleClose} buttons={[{bsStyle:"warning", text: "cancel",onClick: () => this.handleClose()},{bsStyle:"warning", text: "Add",onClick:() => this.addedEnvironment(this.state.evtName)}]}> 
                <h4>Add Environment</h4>
                <FormControl type="text" placeholder="Environment Name" onChange={this.onChangeEvtName} value={this.state.evtName}/>
                <br/>
                <div><ReactDataGrid 
                ref={ node => this.grid = node }
                enableCellSelect={true}
                columns={columns}
                rowGetter={this.getRowAt}
                rowsCount={this.state.varRows.length}
                enableRowSelect={true}
                onGridRowsUpdated={this.handleChange}
                rowHeight={40}
                minHeight={250}
                rowScrollTimeout={200}
                getCellActions={this.getCellActions} 
                rowSelection={{
                    showCheckbox: true,
                    enableShiftSelect: true,
                    onRowsSelected: this.onRowsSelected,
                    onRowsDeselected: this.onRowsDeselected,
                    selectBy: {
                      indexes: this.state.selectedIndexes
                    }
                }} 
                /></div>
            </Dialog>
        }
        </div>
        )
    }
}
export default Environment;
