import React from "react";
import Codemirror from "react-codemirror";
import "../../../node_modules/codemirror/lib/codemirror.css";
import "./body.css"

class Raw extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.code= "";
        this.readOnly= false;
        this.mode='markdown';
    };   

	updateCode =(newCode) =>{
		this.setState({
			code: newCode
		},function(){
			this.onChangeField();
		});
	}
	onChangeField() {
		this.props.changeForm(this.state.code);
	}
    render () {
		var options = {
			lineNumbers: true,
			currentline:true
		};
		return (
			<div>
				<Codemirror ref="editor" value={this.code} onChange={this.updateCode} theme="default" options={options} autoFocus={true} />
			</div>
		);
	}
};

export default Raw;