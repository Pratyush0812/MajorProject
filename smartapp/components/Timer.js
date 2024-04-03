import { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { TimerContext } from '../stores/context/timer-context';
import { Audio } from 'expo-av'

export default Timer = () => {


  const soundObject = new Audio.Sound();

  async function playSound() {
    try {
      await soundObject.loadAsync(require('../assets/breakff.mp3'));
      await soundObject.playAsync();
    } catch (error) {
      console.error('Failed to play the sound', error);
    }
  } 

   
  const TimerCtx = useContext(TimerContext)

  let hours = TimerCtx.hours;
  let minutes = TimerCtx.minutes;
  let isActive = !TimerCtx.isBreak;
  let startDate = TimerCtx.date;

  const rDate = new Date()
  const diffH = rDate.getHours()-startDate.getHours();
  const diffM = (rDate.getMinutes()-startDate.getMinutes());
  const totalDiff = (diffH*60)+diffM;
  let h = Math.floor(totalDiff/60);
  const m = totalDiff%60;
  if(m>minutes) h = h+1
  const newMinutes = (parseInt(minutes,10) - m + 60)%60;
  const newHours = parseInt(hours,10) - h;
  const [watchH,setWatchH] = useState(newHours)
  const [watchM,setWatchM] = useState(newMinutes)
 
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
    
    let IntervalID
    if (isActive) {
      const interval = setInterval(() => {
        const rDate = new Date()
        const diffH = rDate.getHours()-startDate.getHours();
        const diffM = rDate.getMinutes()-startDate.getMinutes();
        const totalDiff = (diffH*60)+diffM;
        let h = Math.floor(totalDiff/60);
        const m = totalDiff%60;
        if(m>minutes) h = h+1
        const newMinutes = (parseInt(minutes,10) - m + 60)%60;
        const newHours = parseInt(hours,10) - h;
        setWatchH(newHours);
        setWatchM(newMinutes)

        if (newHours === 0 && newMinutes === 0){
            TimerCtx.setDate(new Date());
            playSound()
        } 
    
    } , 1000 * 60);

      IntervalID = interval
    } else if (!isActive) {
      setWatchH(parseInt(hours,10));
      setWatchM(parseInt(minutes,10));
    }
    return () => clearInterval(IntervalID)
  }, [isActive, watchH, watchM, startDate, hours, minutes]);

  return (
    <View style={styles.container}>
      {!isActive && <Text style = {styles.prompt}>You are on a BREAK</Text>}
      <Text style={styles.timerText}>{`${watchH
        .toString()
        .padStart(2, '0')}:${watchM.toString().padStart(2, '0')}`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#06233B',
  },
  prompt: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight : '800',
    fontStyle: 'italic',
    color: '#808080',
  },
  timerText: {
    fontSize: 110,
    color : '#84B4B4',
    marginBottom: 20,
  },
});


