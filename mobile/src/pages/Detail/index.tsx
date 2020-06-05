import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Image, SafeAreaView, ScrollView, Linking } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather as Icon, FontAwesome5 } from '@expo/vector-icons'
import { SvgUri } from 'react-native-svg';
import Constants from 'expo-constants';
import { RectButton } from 'react-native-gesture-handler'
import * as MailComposer from 'expo-mail-composer';

import api from '../../services/api';

interface Params { point_id: number }
interface Point {
  id: number
  uf: string;
  city: string;
  name: string;
  email: string;
  image: string;
  whatsapp: string;
  items: {
    id: string;
    title: string;
    image: string;
  }[],
}

const Detail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params as Params;

  const [point, setPoint] = useState<Point>({} as Point);

  useEffect(()=>{
    api.get(`points/${params.point_id}`).then(response => {
      setPoint(response.data);
    })
  },[])


  function handleNavigateBack() {
    navigation.goBack();
  }
  function handleWhatsapp(){
    Linking.openURL(`whatsapp://send?phone=${point.whatsapp}&Text=Tenho interesse sobre a coleta de resíduos`)
  }
  function handleComposeMail(){
    MailComposer.composeAsync({
      subject: 'Interesse na coleta de resíduos',
      recipients: [point.email]
    });
  }

  if(!point.id) return null;

  return (
    <SafeAreaView style={{flex:1}}>
      <ImageBackground source={require('../../assets/home-background.png')} imageStyle={{ width: 274, height: 368 }} style={styles.container}>
        <TouchableOpacity onPress={handleNavigateBack}>
          <Icon name="arrow-left" color="#34CB79" size={20}/>
        </TouchableOpacity>
        <Image style={styles.pointImage} source={{ uri:point.image}}/>
        <Text style={styles.pointName}>{point.name}</Text>
        <ScrollView style={styles.itemsContainer} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 8 }}>
          {point.items.map(item => (
            <View style={styles.item} key={String(item.id)}>
              <SvgUri width={42} height={42} uri={item.image} />
              <Text style={styles.itemTitle}>{item.title}</Text>
            </View>
          ))}
        </ScrollView>
        <View style={styles.address}>
          <Text style={styles.addressTitle}>Endereço</Text>
          <Text style={styles.addressContent}>São Paulo, SP</Text>
        </View>
      </ImageBackground>
      <View style={styles.footer}>
        <RectButton style={styles.button} onPress={handleWhatsapp}>
          <FontAwesome5 name='whatsapp' size={20} color='#F0F0F5'/>
          <Text style={styles.buttonText}>Whatsapp</Text>
        </RectButton>
        <RectButton style={styles.button} onPress={handleComposeMail}>
          <Icon name='mail' size={20} color='#F0F0F5'/>
          <Text style={styles.buttonText}>E-mail</Text>
        </RectButton>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    paddingTop: 20 + Constants.statusBarHeight,
  },

  pointImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
    borderRadius: 10,
    marginTop: 32,
  },

  pointName: {
    color: '#322153',
    fontSize: 28,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 24,
  },

  pointItems: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80'
  },

  itemsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 32,
  },

  item: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#eee',
    height: 120,
    width: 120,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'space-between',

    textAlign: 'center',
  },

  itemTitle: {
    fontFamily: 'Roboto_400Regular',
    textAlign: 'center',
    fontSize: 13,
  },

  address: {
    marginTop: 32,
  },
  
  addressTitle: {
    color: '#322153',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  },

  addressContent: {
    fontFamily: 'Roboto_400Regular',
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80'
  },

  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#999',
    paddingVertical: 20,
    paddingHorizontal: 32,
    paddingBottom: 5,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  
  button: {
    width: '48%',
    backgroundColor: '#34CB79',
    borderRadius: 10,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    marginLeft: 8,
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Roboto_500Medium',
  },
});

export default Detail;