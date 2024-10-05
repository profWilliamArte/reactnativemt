import { Text, View, StyleSheet  } from "react-native";
import { Colors } from "@/constants/Colors";
import CustomButton from "@/components/CustomButton";
import { useNavigation } from '@react-navigation/native';
export default function Index() {
  const currentColors = Colors.dark;
  const navigation = useNavigation();
  return (
    <View style={[styles.container, { backgroundColor: currentColors.background }]}>
      <View >
        <Text style={styles.titulo}>Modelos de Tiendas</Text>
      </View>
      <View >
     
       
   
        
        <CustomButton
          title="Tienda Tipo I"
          onPress={() => navigation.navigate('Tienda2')}
          type="info"
          outline
          width={100}
          margin={10}
        />
        <CustomButton
          title="Tienda Tipo II"
          onPress={() => navigation.navigate('Tienda3')}
          type="info"
          outline
          width={100}
          margin={10}
        />
        <CustomButton
          title="Tienda Tipo III"
          onPress={() => navigation.navigate('Tienda4')}
          type="info"
          outline
          width={100}
          margin={10}
        />
        
        </View>
        <View >
          <Text style={styles.subtitulo}>Ar Sistema React Native</Text>
        </View>    
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: "space-between",
      alignItems: "stretch",
      padding: 20
  },
  header: {
      marginTop: 100,
     
  },
  titulo: {
      fontSize: 26,
      textAlign: "center",
      color: Colors.dark.text
  },
  subtitulo: {
    fontSize: 16,
    textAlign: "center",
    color: Colors.dark.text
  },

  });