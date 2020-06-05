import React from 'react';
import { FiCheckCircle } from 'react-icons/fi';

import './style.css';

const Alert = () => {
  return (
    <div id="page-alert-success">
      <span><FiCheckCircle /></span>
      <h1>Cadastro Concluído!</h1>
    </div>
  )
} 
export default Alert;