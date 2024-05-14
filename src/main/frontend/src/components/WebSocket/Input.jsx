import React from 'react'

export default function Input({ id, placeholder, handleInput}) {
    return (
        <div>
            <input
                id={id}
                onChange={handleInput}
                placeholder={placeholder}/>
        </div>
    );
}