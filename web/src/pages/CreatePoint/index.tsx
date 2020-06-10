import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import axios from 'axios';

import './styles.css';
import api from '../../services/api';
import logo from '../../assets/logo.svg';
import Alert from '../../components/Alert';
import Dropzone from '../../components/Dropzone';

//ao criar um estado para array é necessário informar manualmente o tipo da várivel

interface Item{
  id: number;
  title: string;
  image_url: string;
}
interface UF {
  id: number;
  sigla: string;
  nome: string;
}
interface City {
  id: number;
  nome: string;
}

const CreatePoint = ()=>{
  const [ufs, setUfs] = useState<UF[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [inputData, setInputData] = useState({  name: '', email: '', whatsapp: '' });

  const [selectedUf, setSelectedUf] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');
  const [selectedFile, setSelectedFile] = useState<File>()
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]);

  const history = useHistory();

  useEffect(()=>{
    api.get('items')
      .then(response => {
        setItems(response.data)
      })
      .catch(err=>{console.log(err)})
  }, [])
  useEffect(()=>{
    axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
      .then(response => {
        setUfs(response.data)
      })
  }, [])
  useEffect(()=>{
    if(selectedUf !== '0'){
      axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios?orderBy=nome`)
        .then(response => { setCities(response.data) })
        .catch(err => { console.error(err) })
    } else {
      setCities([])
    }
  }, [selectedUf])
  useEffect(()=>{
    navigator.geolocation.getCurrentPosition(position => {
      let { latitude, longitude } = position.coords;
      setInitialPosition([latitude, longitude])
    })
  }, [])

  function handleSelectedUf(event: ChangeEvent<HTMLSelectElement>){
    setSelectedUf(event.target.value)
  }
  function handleSelectedCity(event: ChangeEvent<HTMLSelectElement>){
    setSelectedCity(event.target.value)
  }
  function handleMapClick(event: LeafletMouseEvent){
    setSelectedPosition([event.latlng.lat, event.latlng.lng])
  }
  function handleInputChange(event: ChangeEvent<HTMLInputElement>){
    const { name, value } = event.target;
    setInputData({ ...inputData, [name]: value})
  }
  function handleSeletedItem(id: number ){
    let alreadySelected = selectedItems.findIndex(item => item === id)

    if(alreadySelected >= 0)  setSelectedItems(selectedItems.filter(item => item !== id))
    else setSelectedItems([...selectedItems, id])
  }
  async function handleOnSubmit(event: FormEvent){
    event.preventDefault();

    if (selectedFile === undefined) {
      alert('É necessário enviar uma imagem do estabelecimento')
      return;
    }

    if (selectedItems.length === 0){
      alert('É necessário escolher os itens de coleta do estabelecimento')
      return;
    }

    let { name, email, whatsapp } = inputData;
    let uf = selectedUf;
    let city = selectedCity;
    let items = selectedItems;
    let [latitude, longitude] = selectedPosition;

    let data = new FormData()
    data.append('name', name);
    data.append('email', email);
    data.append('whatsapp', whatsapp);
    data.append('uf', uf);
    data.append('city', city);
    data.append('latitude', String(latitude));
    data.append('longitude', String(longitude));
    data.append('items', items.join(','));
    data.append('image', selectedFile);

    await api.post('points', data)

    setShowAlert(true)

    setTimeout(() => { history.push('/') }, 3000);
  }
  return (
    <div id="page-create-point">
      { showAlert && <Alert /> }

      <header>
        <img src={logo} alt="Ecoleta"/>
        <Link to='/'>
          <FiArrowLeft/>
          <p>Voltar para a Home</p>
        </Link>
      </header>

      <form onSubmit={handleOnSubmit}>
        <h1>Cadastro do <br/>Ponto de Coleta</h1>

        <Dropzone onFileUploaded={setSelectedFile} />
        <fieldset>
          <legend><h2>Dados</h2></legend>
          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input type="text" name="name" id="name" onChange={handleInputChange} required/>
          </div>
          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input type="email" name="email" id="email" onChange={handleInputChange} required/>
            </div>
            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input type="text" name="whatsapp" id="whatsapp" onChange={handleInputChange} required/>
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o Endereço no mapa</span>
          </legend>

          <Map center={initialPosition} zoom={16} onClick={handleMapClick}>
            <TileLayer attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
            <Marker position={selectedPosition}/>
          </Map>
          <div className="field-group">
            <div className='field'>
              <label htmlFor="name">Endereço</label>
              <input type="text" name="name" id="name" onChange={()=>{}} required />
            </div>
            <div className='field'>
              <label htmlFor="name">Número</label>
              <input type="text" name="name" id="name" onChange={()=>{}} required />
            </div>
          </div>
          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>
              <select name="uf" id="uf" value={selectedUf} onChange={handleSelectedUf} required>
                <option value="0">Selecione um estado</option>
                {ufs.map(initials => (
                  <option key={initials.id} value={initials.sigla}>{initials.sigla} - {initials.nome}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select name="city" id="city" value={selectedCity} onChange={handleSelectedCity} required>
                <option value="0">Selecione uma cidade</option>
                {cities.map(city => (
                  <option key={city.id} value={city.nome}>{city.nome}</option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>
            <h2>Ítens de coleta</h2>
            <span>Selecione um ou mais ítens abaixo</span>
          </legend>
          <ul className="items-grid">
            {items.map(item => (
              <li
                key={item.id}
                className={selectedItems.includes(item.id) ? 'selected': ''}
                onClick={()=> handleSeletedItem(item.id)}>
                  <img src={item.image_url} alt={item.title} />
                  <span>{item.title}</span>
              </li>
            ))}
          </ul>
        </fieldset>
        <button type="submit">
          Cadastrar ponto de coleta
        </button>
      </form>
    </div>
  );
}

export default CreatePoint;