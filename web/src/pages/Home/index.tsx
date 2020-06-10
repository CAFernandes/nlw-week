import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { FiLogIn, FiSearch } from 'react-icons/fi';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';

import logo from '../../assets/logo.svg';
import './styles.css';

interface UF {
  id: number;
  sigla: string;
  nome: string;
}
interface City {
  id: number;
  nome: string;
}

const Home = () => {
<<<<<<< Updated upstream
=======
<<<<<<< Updated upstream
=======
>>>>>>> Stashed changes
  const [ufs, setUfs] = useState<UF[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedUf, setSelectedUf] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');
<<<<<<< Updated upstream
=======
  const [redirectPage, setRedirectPage] = useState(false);
>>>>>>> Stashed changes
  const [showForm, setShowForm] = useState<boolean>(false);

  useEffect(() => {
    axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
      .then(response => {
        setUfs(response.data)
      })
  }, [])
  useEffect(() => {
    if (selectedUf !== '0') {
      axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios?orderBy=nome`)
        .then(response => { setCities(response.data) })
        .catch(err => { console.error(err) })
    } else {
      setCities([])
    }
  }, [selectedUf])

  function handleSelectedUf(event: ChangeEvent<HTMLSelectElement>) {
    setSelectedUf(event.target.value)
  }
  function handleSelectedCity(event: ChangeEvent<HTMLSelectElement>) {
    setSelectedCity(event.target.value)
  }
  function handleSearchPoint() {
    let status = !showForm;
    setShowForm(status);
  }
  function handleOnSubmit(event: FormEvent) {
    event.preventDefault();
<<<<<<< Updated upstream
    if (selectedUf === '0'){
      alert('Ops! É necessário escolher um estado para continuar');
      return;
    }
    if(selectedCity === '0'){
=======
    if (selectedUf === '0') {
      alert('Ops! É necessário escolher um estado para continuar');
      return;
    }
    if (selectedCity === '0') {
>>>>>>> Stashed changes
      alert('Ops! É necessário escolher uma cidade para continuar');
      return;
    }

<<<<<<< Updated upstream
    <Redirect
      to={`/search-point?uf=${selectedUf}&city=${selectedCity}`}
    />

  }

=======
    setRedirectPage(true);

  }

  if (redirectPage) {
    return (
      <Redirect to={`/search-point/${selectedUf}/${selectedCity}`} />
    )
  }

>>>>>>> Stashed changes
>>>>>>> Stashed changes
  return (
    <div id="page-home">
      <div className="content">
        <header>
          <img src={logo} alt="Ecoleta" />
          <div className="create-point">
            <Link to='/create-point'>
              <FiLogIn />
              <p>Cadastrar um novo Ponto de Coleta</p>
            </Link>
          </div>
        </header>
        <main>
<<<<<<< Updated upstream
=======
<<<<<<< Updated upstream
           <h1>Seu marketplace de coleta de resídiuos.</h1>
           <p>Ajudamos pessoas a encotrarem pontos de coletas de forma eficiente.</p>
=======
>>>>>>> Stashed changes
          <h1>Seu marketplace de coleta de resídiuos.</h1>
          <p>Ajudamos pessoas a encotrarem pontos de coletas de forma eficiente.</p>

          <button onClick={handleSearchPoint}>
            <span> <FiSearch /> </span>
            <strong>Pesquisar pontos de coleta.</strong>
          </button>

          {showForm && (
<<<<<<< Updated upstream
            <div className="form-container" >
=======
            <div className="form-container">
              <div className="background-container" onClick={handleSearchPoint}></div>
>>>>>>> Stashed changes
              <form onSubmit={handleOnSubmit}>
                <h2>Pontos de coleta</h2>
                <div className="field">
                  <select name="uf" id="uf" value={selectedUf} onChange={handleSelectedUf} required>
                    <option value="0">Selecione um estado</option>
                    {ufs.map(initials => (
                      <option key={initials.id} value={initials.sigla}>{initials.sigla} - {initials.nome}</option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <select name="city" id="city" value={selectedCity} onChange={handleSelectedCity} required>
                    <option value="0">Selecione uma cidade</option>
                    {cities.map(city => (
                      <option key={city.id} value={city.nome}>{city.nome}</option>
                    ))}
                  </select>
                </div>
                <button type="submit"><strong>Buscar</strong></button>
              </form>
            </div>
          )}
<<<<<<< Updated upstream
=======
>>>>>>> Stashed changes
>>>>>>> Stashed changes

        </main>
      </div>
    </div>
  )
}

export default Home;