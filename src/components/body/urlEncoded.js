import React from "react";
import ReactDataGrid from 'react-data-grid';
import update from 'immutability-helper';

class UrlEncoded extends React.Component {
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

    this.state = { rows: this.createRows(1) };
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

  handleGridRowsUpdated = ({ fromRow, toRow, updated,newRowIndex,numberOfRows }) => {
    let rows = this.state.rows.slice();
    for (let i = fromRow; i <= toRow; i++) {
      if(this.state.rows.length===rows[i].id){

        let rowToUpdate = rows[i];
        let updatedRow = update(rowToUpdate, {$merge: updated});
        rows[i] = updatedRow;
        if(rows[i].key!=="" || rows[i].value!=="" ||rows[i].description!=="" ){
          const newRow = {
            id: rows[i].id+1 ,
            key:'',
            value: '',
            description: '',
          };
          rows = update(rows, {$push: [newRow]}); 
        }   
      } 
      else{
        let rowToUpdate = rows[i];
        let updatedRow = update(rowToUpdate, {$merge: updated});
        rows[i] = updatedRow;
      }  
    }
    this.setState({ rows })
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
        minHeight={150}
        minWidth={1080}
        rowScrollTimeout={200} />);
  }
}

export default UrlEncoded;