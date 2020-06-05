import React, { useEffect, useState } from 'react';
import { Feather as Icon } from '@expo/vector-icons'
import { StyleSheet, Text, View, Image, ImageBackground, Alert } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation, useRoute } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';

import axios from 'axios';

interface IBGEUF {
  id: number;
  sigla: string;
  nome: string;
}
interface IBGECity {
  nome: string;
}
interface Uf {
  label: string;
  value: string;
}
interface City {
  label: string;
  value: string;
}

const Home = () =>{
  const navigation = useNavigation();
  const [ufs, setUfs] = useState<Uf[]>([] as Uf[]);
  const [cities, setCities] = useState<City[]>([] as City[]);
  const [selectedUf, setSelectedUf] = useState<String>('0');
  const [selectedCity, setSelectedCity] = useState<String>();

  useEffect(() => {
    axios.get<IBGEUF[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
      .then(response => {
        setUfs(response.data.map((uf: IBGEUF) => ({ label: `${uf.sigla} - ${uf.nome}`, value: uf.sigla })))
      })
  }, []);
  useEffect(() => {
    if (selectedUf !== '0') {
      axios.get<IBGECity[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios?orderBy=nome`)
        .then(response => { 
          setCities(response.data.map(city=>(
            {label: city.nome, value: city.nome})
            )
          );
        })
        .catch(err => { console.error(err) })
    } else {
      cities.slice(0, cities.length - 1);
    }
  }, [selectedUf])

  function handleSelectUf(uf:string){
    setSelectedUf(uf)
  }
  function handleSelectCity(city:string){
    setSelectedCity(city)
  }
  function handleNavigationToPoints() {
    if(!selectedUf) {
      Alert.alert('Ops', 'É necessário escolher um estado, para prosseguir');
      return;
    }
    if(!selectedCity) {
      Alert.alert('Ops', 'É necessário escolher uma cidade, para prosseguir');
      return;
    }
    navigation.navigate('Points', {uf: selectedUf, city: selectedCity});
  }

  return (
    <ImageBackground source={require('../../assets/home-background.png')} style={styles.container} imageStyle={{width: 274, height:368}} >
      <View style={styles.main}>
        <Image source={require('../../assets/logo.png')}/>
        <Text style={styles.title}>Seu Marketplace de Colete de Resíduos</Text>
        <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
      </View>
      <View style={styles.footer}>
        <RNPickerSelect items={ufs} onValueChange={(value)=>handleSelectUf(value)}></RNPickerSelect>
        <RNPickerSelect items={cities} onValueChange={(value) => handleSelectCity(value)}></RNPickerSelect>

        <RectButton style={styles.button} onPress={handleNavigationToPoints}>
          <View style={styles.buttonIcon}>
            <Text><Icon name="arrow-right" color="#FFF" size={24} /></Text>
          </View>
          <Text style={styles.buttonText}>Entrar</Text>
        </RectButton> 
      </View>
    </ImageBackground>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

export default Home;