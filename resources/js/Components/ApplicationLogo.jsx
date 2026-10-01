import React from 'react';

export default function ApplicationLogo(props) {
    return (
        <img
            src="/img/logo/logo-fundacion.svg"
            alt="Fundación Miguel Ángel Gamboa"
            {...props}
            className={`h-12 w-auto object-contain ${props.className || ''}`}
        />
    );
}
