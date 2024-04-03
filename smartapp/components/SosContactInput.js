import { View, TextInput, Button, StyleSheet, Text, Alert } from 'react-native';
import { useContext, useState } from 'react';
import { TimerContext } from '../stores/context/timer-context';
export default function SosContactInput() {
  const TimerCtx = useContext(TimerContext);
  const [numbersTemp,setNumbersTemp] = useState(['',''])

  function validatePhoneNumber(phoneNumber) {
    // Regular expression to match a valid phone number format
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phoneNumber);
  }
  function handleNumberChange(ind){
    if(numbersTemp[ind]==="") {return;}
    if(!validatePhoneNumber(numbersTemp[ind])){
      Alert.alert('Invalid Input', 'Please provide a valid phone no.')
      return;
    }
    TimerCtx.setNumbers(numbersTemp[ind],ind);
  }
  let temp;
  return (
    <>
    <View style={styles.container}>
        <Text style = {styles.label}>SOS Contact 1</Text>
        <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder= "+91"
          placeholderTextColor="#185B5B"
          keyboardType="number-pad"
          onBlur={handleNumberChange.bind(this,0)}
          onChangeText={(num1)=>{setNumbersTemp((prev)=>[num1,prev[1]])}}
          value = {numbersTemp[0]}
        />
        </View>
    </View>
    <View style={styles.container}>
    <Text style = {styles.label}>SOS Contact 2</Text>
    <View style={styles.inputContainer}>
    <TextInput
      style={styles.input}
      placeholder= "+91"
      placeholderTextColor="#185B5B"
      keyboardType="number-pad"
      onBlur={handleNumberChange.bind(this,1)}
      onChangeText = {(num2)=>{setNumbersTemp((prev)=>[prev[0],num2])}}
      value = {numbersTemp[1]}
    />
    </View>
  </View>
  </>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent : 'center',
    marginTop : 12,
    marginLeft: 100
  },
  input: {
    width: 210,
    height: 60,
    borderWidth: 1.2,
    borderColor: '#808080',
    borderRadius: 8,
    textAlign: 'center',
    marginLeft: 0,
    marginRight: 0,
    fontSize: 18,
    color: '#37C4C4'
  },
  label:{
    textAlign: 'left',
    fontSize: 20,
    color : '#84B4B4',
    marginLeft: 8,
    fontWeight: '500'
  },
});