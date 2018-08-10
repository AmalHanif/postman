import React from "react";
import ReactDataGrid from 'react-data-grid';
import update from 'immutability-helper';
import PropTypes from 'prop-types';

class Header extends React.Component {
  constructor(props, context) {
    super();
    this._columns = [
      {
        key: 'key',
        name: 'Key',
        editable: true,
        width: 338,
        resizable: true
      },
      {
        key: 'Value',
        name: 'Value',
        editable: true,
        width: 340,
        resizable: true
      },
      {
        key: 'description',
        name: 'Description',
        editable: true,
        width: 340,
        resizable: true
      },
    ];

    this.state = {
      keyValue: props.initialKey,
      // value: props.initialValue,
       rows: this.createRows(1) 
    };
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

  handleGridRowsUpdated = ({ fromRow, toRow, updated,newRowIndex,numberOfRows,rowIds }) => {
    
    // if(this.props.initialKey!==""&&this.props.initialValue!==""){
    //   updated={key:this.props.initialKey,value:this.props.initialValue};
    //   fromRow=this.state.rows.length-1;
    // }
    let rows = this.state.rows.slice();
    for (let i = fromRow; i <= toRow; i++) {
      if(this.state.rows.length===rows[i].id){

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
    this.setState({ rows },function(){
      this.onChangeField();
    })
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

  onChangeField() {
    this.props.changeHeader(this.state.rows);
    // this.props.changeFieldValue(this.state.oAuth1Value)
  } 
  componentDidmount(){

    let updatedRow = update(this.state.rows, {$merge: this.props.headerParams});
    this.state.rows= updatedRow
  }

  render() {
    return (
      <ReactDataGrid
        ref={ node => this.grid = node }
        enableCellSelect={true}
        columns={this.getColumns()}
        rowGetter={this.getRowAt}
        rowsCount={this.getSize()}
        enableRowSelect={true}
        onGridRowsUpdated={(this.handleGridRowsUpdated)}
        rowHeight={40}
        minHeight={200}
        minWidth={1080}
        rowScrollTimeout={200} />
      );
  }
}

export default Header;

Header.propTypes = {
 headerParams: PropTypes.array
  // description:PropTypes.string
}
