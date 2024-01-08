import React, { useState, useRef, useEffect } from 'react';

const Gpt = () => {
    const [answer, setAnser] = useState("");

    const getGPTsQuery = () => {

        var gpt_q = document.getElementById("gpt_q").value;

        const url = 'http://localhost:3001/gpt';
        const gpt_q_json = {query: gpt_q};
        
        if (gpt_q_json.gpt_q !== "" && gpt_q_json.gpt_category !== "") {
            const options = {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(gpt_q_json)
              };
    
              fetch(url, options)
              .then(response => response.text())
              .then(data => {
                console.log(data);
                setAnser(data)})
              .catch(error => console.error('Error:', error));
              
            }
        };
    

    return(
        <div>
            <div id="query_box">
                <div className='input_box'>
                    <input type="text" id="gpt_q" placeholder='Input Query'/>
                    <button id="query" onClick={getGPTsQuery}>SUBMIT</button><br/>
                </div>

                {answer}

            </div>
            
        </div>
    );
};

export default Gpt;