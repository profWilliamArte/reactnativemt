import { Stack } from "expo-router";
import { StatusBar } from "react-native-web";
import { View, Text, StyleSheet } from "react-native";

export default function RootLayout() {


  const CustomHeader = () => {
    return (
      <View style={styles.header}>
       
      </View>
    );
  };
  return (
    <Stack screenOptions={{ headerShown: true }} >
      <Stack.Screen 
          name="index" 
          options={{
            headerShown: true,
            header: () => <CustomHeader />, 
            
          }}
        />
        <Stack.Screen 
          name="Tienda2" 
          options={{
            headerShown: true,
            header: () => <CustomHeader />, 
            
          }}
        />
        <Stack.Screen 
          name="Tienda3" 
          options={{
            headerShown: true,
            header: () => <CustomHeader />, 
            
          }}
        />
         <Stack.Screen 
          name="Tienda4" 
          options={{
            headerShown: true,
            header: () => <CustomHeader />, 
            
          }}
        />   
    </Stack>

   
   
  );
}
const styles = StyleSheet.create({
  header: {
    backgroundColor: '#2c3e50', // Color de fondo del encabezado
    paddingVertical: 30, // Espaciado vertical
    alignItems: 'center', // Centra horizontalmente
  },
  title: {
    color: '#fff', // Color del texto del título
    fontSize: 14,
    fontWeight: 'bold', // Texto en negrita
    textAlign: 'center', // Centra el texto
  },
});
