import React from "react";
import { } from 'react-bootstrap';
export const NoAuth =(props) =>{
  
   return (
     <div>
       <p className="text-align-center">This request does not use any authorization. <a href="https://www.getpostman.com/docs/v6/postman/sending_api_requests/authorization">Learn more about authorization</a></p>
     </div>
   );
} 
// export default NoAuth