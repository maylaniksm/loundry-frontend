import React from 'react';

export default function Prompt(props){
    return(
        <p className="d-block" style={{textDecoration:'none'}}>{props.prompt}</p>
    )
}