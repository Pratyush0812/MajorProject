import { View, TextInput, Button, StyleSheet, Text } from 'react-native';

export default function AlarmInput() {
  return (
    <View style={styles.container}>
        <Text style = {styles.label}>Select Alarm</Text>
        <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder= "Alarms"
          placeholderTextColor="#185B5B"
        />
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      marginVertical: 20,
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