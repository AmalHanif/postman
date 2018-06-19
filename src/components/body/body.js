import React, { Component } from "react";
import {Link,BrowserRouter} from "react-router-dom";
import { Route, Switch } from "react-router";
import {FormGroup, Radio } from 'react-bootstrap';
import Form  from "./form";
import UrlEncoded from "./urlEncoded";
import Raw from "./raw";
import Binary from "./binary";


// function Raw() {
//   return (
//     <h1>
//      text
//     </h1>
//   )
// }

class Body extends Component   {
 render() {
 

   return(
     <div>
      <BrowserRouter>
          <FormGroup>
            <Link  to={`/body/form-data`}>
              <Radio name="radioGroup" inline>
                form-data
              </Radio>{' '}
            </Link>
            <Link  to={`/body/urlencoded`}> 
              <Radio name="radioGroup" inline>
                x-www-form-urlencoded
              </Radio>{' '}
            </Link>
            <Link  to={`/body/raw`}> 
              <Radio name="radioGroup" inline>
                raw
              </Radio>{' '}
            </Link>
            <Link  to={`/body/binary`}> 
              <Radio name="radioGroup" inline>
                binary
              </Radio>
            </Link>
        </FormGroup>
      </BrowserRouter>
        <Switch>
          <Route exact path='/body/form-data' component={Form} />
          <Route path='/body/urlencoded' component={UrlEncoded} />
          <Route path='/body/raw' component={Raw} />
          <Route path='/body/binary' component={Binary} />
        </Switch>
     </div>

   );
 }
}


export default Body;
