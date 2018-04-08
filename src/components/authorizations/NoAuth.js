import React, { Component } from "react";

class NoAuth extends Component {
 

 render() {
   return (
     <div>
       <p className="text-align-center">This request does not use any authorization. <a bsstyle="warning">Learn more about authorization</a></p>
     </div>
   );
 }
}

export default NoAuth;