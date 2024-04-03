import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Startscreen from './screens/Startscreen';
import TimerContextProvider from './stores/context/timer-context';
import { useState } from 'react';
import FormScreen from './screens/FormScreen';
import TimerScreen from './screens/TimerScreen';
import {Ionicons} from '@expo/vector-icons'

const Tab = createBottomTabNavigator();

export default function App() {
  const [isConnected, setisConnected] = useState(false);
  function connectionChangeHandler(){
    setisConnected(true);
  }

  function MainTabs() {
    return (
      <Tab.Navigator screenOptions={{
        headerStyle : {backgroundColor: '#011B30' },
        headerTintColor : '#329D8A',
        tabBarActiveTintColor : '#329D8A',
        tabBarStyle: { backgroundColor: '#011B30' }
      }}>
        <Tab.Screen name="FormScreen" component={FormScreen} options={
          {
            title : 'Preferences',
            tabBarLabel : 'Preferences',
            tabBarIcon : ({color , size})=> <Ionicons name = "list-sharp" color = {color} size = {size} />
          }
        }/>
        <Tab.Screen name="Timer" component={TimerScreen} options={{
            title : 'Timer',
            tabBarLabel : 'Timer',
            tabBarIcon : ({color , size})=> <Ionicons name = "timer-outline" color = {color} size = {size} />
        }}/>
      </Tab.Navigator>
    );
  }

  let mainScreen = <Startscreen onConnect = {connectionChangeHandler}/>;
  if(isConnected){
    mainScreen = <MainTabs />
  } 

  return (
    <>
    <StatusBar style = "light" />
    <TimerContextProvider>
      <NavigationContainer>
      {mainScreen}
      </NavigationContainer>
    </TimerContextProvider>
    </>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    padding: 48,
  },
});
