// Mebaselassie Kidane Kebede, mebkeb-0
import React from 'react'
import './Account.css';

// Function that renders a popup component conditionally based on props.trigger.
function Register(props) {
    return (props.trigger) ? (
        <section className="flexCenter paddings innerWidth h-container">
        <div className="popup">
                <div className="popup-inner">
                    <button className="close-btn" onClick={() => props.setTrigger(false)}>X</button>
                    { props.children}
                </div>
        </div>
        </section>
    ) : "";
}

export default Register; 