import React from 'react';
import {useNavigate, useParams} from "react-router-dom";
 
const withNavigation = (Component) => props => {
    const navigate = useNavigate();
    const params = useParams();
  
    return <Component {...props} params={params} navigate={navigate} />;
};

export default withNavigation