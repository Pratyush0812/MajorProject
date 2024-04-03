import { StyleSheet, Text, View, Image, Button } from 'react-native';

export default function Startscreen({onConnect}) {
  return (
    <View style={styles.container}>
      <Image source = {require('../assets/logo.png')} style={styles.image}/>
      <View>
        <Text style = {styles.mainText}>GETTING STARTED</Text>
      </View>
      <View style = {styles.outerButtonContainer}>
        <View style = {styles.buttonContainer}>
            <Button title = "Docs & Help" color="#329D8A" />
        </View>
        <View style = {styles.buttonContainer} >
            <Button title = "Connect" color="#329D8A" onPress = {onConnect}/>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 8,
        backgroundColor: '#06233B',
    },
    image: {
        width : '100%',
        height : 400,
        marginTop: 120,
        marginLeft: 30
    },
    mainText: {
        color : "#ffffff",
         fontSize : 20,
         textAlign: "center",
         fontWeight: "bold"
    },
    outerButtonContainer: {
        marginTop: 36,
        flexDirection: "row",
    },
    buttonContainer : {
        borderWidth : 2,
        borderRadius: 8,
        margin : 16,
        padding : 8,
        borderColor : '#329D8A',
        minWidth: 130
    }
});