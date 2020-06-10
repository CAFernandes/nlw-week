import React, { useState, useEffect } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { Link, RouteComponentProps } from 'react-router-dom';
import api from '../../services/api'

import './styles.css';
import logo from '../../assets/logo.svg';

interface Params {
  uf: string;
  city: string;
}
interface Points{
  "id": number,
  "image": string,
  "name": string,
  "email": string,
  "whatsapp": string,
  "latitude": number,
  "longitude": number,
  "city": string,
  "uf": string
}

const SearchPoint = (props: RouteComponentProps) => {
  const { uf, city } = props.match.params as Params;
  const [countSearched, setCountSearched] = useState<number>(0)
  const [searchedPoints, setSearchedPoints] = useState<Points[]>([]);

  useEffect(()=>{
    api.get(`points`, {
      params: {
        uf, city, items: '1,2,3,4,5,6'
      }
    }).then(response => {
        setSearchedPoints(response.data)
      })
  }, [])

  useEffect(()=>{
    setCountSearched(searchedPoints.length)
  }, [searchedPoints]);

  return (
    <div id='page-search'>
      <div className="content">
        <header>
          <div className="header">
            <img src={logo} alt="Ecoleta" />
            <Link to='/'>
              <FiArrowLeft />
              <p>Voltar para a Home</p>
            </Link>
          </div>
          <span><strong>{countSearched} pontos</strong> encontrados</span>
        </header>
        <main>
          {searchedPoints.map(point => (
            <div className="card-point" key={point.id}>
              <div className="card-img">
                <img src={point.image} alt="Imagem do local da coleta" />
              </div>
              <div className="card-content">
                <h2>{point.name}</h2>
                <address>
                  <span>{point.uf}, {point.city}</span>
                  <span>Rua Sei la </span>
                </address>
              </div>
            </div>
          ))}
        </main>
      </div>
    </div>
  )
}

export default SearchPoint;