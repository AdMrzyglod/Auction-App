import React from 'react';
import './auction-file.css'


export default function AuctionFile({files,handleRemoveFile}){


    return (
        <div className="box-file">
        {files.map((file, index) => (
          <div key={index}>
            <p>{file.name}</p>
            <button onClick={(event) => handleRemoveFile(event,index)}>Usuń</button>
          </div>
        ))}
      </div>
    )
}