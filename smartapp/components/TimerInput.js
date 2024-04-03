import React, { useState, useContext } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert } from 'react-native';
import { TimerContext } from '../stores/context/timer-context';
import { Entypo } from '@expo/vector-icons'
export default function TimerInput() {
  const TimerCtx = useContext(TimerContext)
  const [hours,setHours] = useState('')
  const [minutes,setMinutes] = useState('')
  
  function handleHourSubmission(){
    const isValidHours = /^\d+$/.test(hours) && parseInt(hours, 10) >= 0 && parseInt(hours, 10) <= 2;
    if(!isValidHours){
        Alert.alert('Invalid Input','We recommend a max of 2:59 hrs of continous drive')
        if(hours===''){
          TimerCtx.setHours('');
        }
        return;
    }
    TimerCtx.setHours(hours);
  }

  function handleMinuteSubmission(){
    const isValidMinutes = /^\d+$/.test(minutes) && parseInt(minutes, 10) >= 0 && parseInt(minutes, 10) <= 59;
    if(!isValidMinutes){
        Alert.alert('Invalid Input','Minutes should be between 0 and 59(Use hours for more)')
        if(minutes===''){
          TimerCtx.setMinutes('');
        }
        return;
    }
    TimerCtx.setMinutes(minutes);
  }

  function handleHoursChange(text){
    if(!TimerCtx.isBreak){
        Alert.alert('Caution','Time cant be changed during driving')
        return;
    }
    setHours(text)
  }
  function handleMinutesChange(text){
    if(!TimerCtx.isBreak){
        Alert.alert('Caution','Time cant be changed during driving')
        return;
    }
    setMinutes(text)
  }

  return (
    <View style={styles.container}>
      <Text style = {styles.label}>Enter Span Period</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="HH"
          keyboardType="number-pad"
          onChangeText={handleHoursChange}
          value={hours}
          placeholderTextColor="#185B5B"
          onBlur={handleHourSubmission}
        />
        <View style = {styles.doticon}>
        <Entypo name = "dots-two-vertical" size = {26} color = '#808080'/>
        </View>
        <TextInput
          style={styles.input}
          placeholder="MM"
          keyboardType="number-pad"
          onChangeText={handleMinutesChange}
          value={minutes}
          placeholderTextColor="#185B5B"
          onBlur={handleMinuteSubmission}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent : 'center',
    marginTop : 12,
    marginLeft: 100
  },
  input: {
    width:90,
    height: 50,
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
  doticon:{
    marginTop: 10,
  }
});
