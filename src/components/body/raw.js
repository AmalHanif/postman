import React from "react";
import Codemirror from "react-codemirror";
import "../../../node_modules/codemirror/lib/codemirror.css";
// import "./body.css"

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
		});
	}

    render () {
		var options = {
            lineNumbers: true,
		};
		return (
			<div>  
				<Codemirror  ref="editor" value={this.code} onChange={this.updateCode} options={options} autoFocus={true} />
			</div>
		);
	}
};

export default Raw;