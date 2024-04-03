import { useContext } from 'react';
import { StyleSheet, Text, View, Image, Button } from 'react-native';
import { TimerContext } from '../stores/context/timer-context';
import {Ionicons} from '@expo/vector-icons'
import Timer from '../components/Timer';
export default function TimerScreen() {

  const TimerCtx = useContext(TimerContext);

  function OfflPage() {
    return (
    <>
    <Text style = {styles.offText}>You have not started the Driving Routine Yet</Text>
    <View style = {{marginTop : 40}}>
        <Ionicons name="flash-off-outline" color="#808080" size= {100}/>
    </View>
    </>
    );
  }

  let isOn = TimerCtx.isOn;
  let mainPage = <Timer />
  if(!isOn){
    mainPage = <OfflPage />
  }
  return (
    <View style = {styles.outerContainer}>
        {mainPage} 
    </View>
  )
}

const styles = StyleSheet.create({
    outerContainer: {
      flex: 1,
      alignItems: 'center',
      padding: 48,
      backgroundColor: '#06233B',
    },
    offText:{
        textAlign: 'center',
        fontSize: 20,
        fontStyle: 'italic',
        color: '#808080',
    }
});

