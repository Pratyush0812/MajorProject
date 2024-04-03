import { useState, useEffect,useContext  } from 'react';
import { StyleSheet, Text, View, Image, Button, ScrollView, KeyboardAvoidingView,Alert } from 'react-native';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { TimerContext } from '../stores/context/timer-context';
import TimerInput from '../components/TimerInput';
import AlarmInput from '../components/AlarmInput';
import SosContactInput from '../components/SosContactInput';
import {Ionicons} from '@expo/vector-icons'
import { Audio } from 'expo-av'

export default function FormScreen() {
  const TimerCtx = useContext(TimerContext)

  

  async function playSound() {
    try {
      const soundObject = new Audio.Sound();
      await soundObject.loadAsync(require('../assets/alarm.wav'));
      await soundObject.playAsync();
    } catch (error) {
      console.error('Failed to play the sound', error);
    }
  }
  async function playSoundwarn() {
    try {
      const soundObject = new Audio.Sound();
      await soundObject.loadAsync(require('../assets/warn.wav'));
      await soundObject.playAsync();
    } catch (error) {
      console.error('Failed to play the sound', error);
    }
  }  

  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [receivedData, setReceivedData] = useState('');
  const [client, setClient] = useState(null);

  useEffect(() => {

    async function setAudioMode() {
      try {
        await Audio.requestPermissionsAsync();
        await Audio.setAudioModeAsync({
            staysActiveInBackground: true,
            //interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
            shouldDuckAndroid: false,
            playThroughEarpieceAndroid: false,
            allowsRecordingIOS: false,
            //interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
            playsInSilentModeIOS: true,
        });

      } catch (error) {
        console.error('Failed to set audio mode', error);
      }
    }

    setAudioMode();


    if (client) {
      client.onerror = (error) => console.error('Connection Error:', error);
      client.onopen = () => {
        console.log('WebSocket Client Connected');
        setConnectionStatus('Connected');
      };
      client.onmessage = (e) => {
        if (typeof e.data === 'string') {
          //console.log("Received: '" + e.data + "'");
          if(e.data==='warning9'){
            console.log('warning9')
            playSound();
          }else if(e.data==='warning21'){
            console.log('warning21')
            playSoundwarn();
          }
          //setReceivedData(e.data); // Update received data
        }
      };
      client.onclose = () => {
        console.log('WebSocket Client Closed');
        setConnectionStatus('Disconnected');
      };
    }
  }, [client]);

  const startConnection = () => {
    const newClient = new W3CWebSocket('ws://192.168.1.6:8765');
    setClient(newClient);
  };

  const stopConnection = () => {
    if (client) {
      client.close();
      setClient(null);
      setConnectionStatus('Disconnected');
    }
  };

  let isOn = TimerCtx.isOn;
  let isBreak = TimerCtx.isBreak;

  let bt1 = isOn ? 'Stop':'Start';
  let bt2 = isBreak ? 'Resume':'Break';


  function handleStart(){
    if((!isOn) && (TimerCtx.minutes==='' || TimerCtx.hours==='')){
        Alert.alert('Inputs Missing','Please provide Span Period');
        return;
    }
    if(isOn){
        stopConnection();
    }else{
        startConnection();
    }
    TimerCtx.setDate(new Date());
    TimerCtx.toggleMain();
  }
  
  const stylesarr = [styles.buttonContainer];
  if(!isOn) stylesarr.push({marginLeft : 50})
  return (
    <ScrollView style={{backgroundColor: '#06233B'}}>
    <KeyboardAvoidingView style={{flex: 1}} behavior="position">
    <View style = {styles.outerContainer}>
        <Text style = {styles.mainTitle}> Customise Your Driving Experience </Text>
        <View style = {styles.formContainer}>
            <TimerInput />
            <AlarmInput />
            <SosContactInput />
        </View>
        <View style = {styles.outerButtonContainer}>
            {isOn && <View style = {styles.buttonContainer}>
                <Button title = {bt2} color="#329D8A" onPress={TimerCtx.toggleBreak}/>
            </View>}
            <View style = {stylesarr} >
                {!isOn && <View>
                    <Ionicons name = "power" color='#329D8A' size={40}/>
                </View>}
                <Button title = {bt1} color="#329D8A" onPress={handleStart}/>
                
            </View>
      </View>
    </View>
    </KeyboardAvoidingView>
    </ScrollView>
  )
}
const styles = StyleSheet.create({
    outerContainer: {
      flex: 1,
      padding: 20,
      backgroundColor: '#06233B',
    },
    mainTitle: {
        fontSize: 25,
        marginTop: 16,
        textAlign: 'center',
        color: '#ffffff',
        fontWeight: '500'
    },
    formContainer: {
        marginTop: 8,
    },
    outerButtonContainer: {
        marginTop: 4,
        flexDirection: "row",
        marginLeft: 80
    },
    buttonContainer : {
        margin : 12,
        padding : 2,
        minWidth: 60,
        flexDirection: 'row'
    }
});