import React, { useEffect, useState } from 'react';
import { Text, View, ScrollView, StyleSheet,FlatList, TouchableOpacity,TextInput } from "react-native";
import { Colors } from "@/constants/Colors";
import Cardprod from '../components/Cardprod';

const API1 = 'https://dummyjson.com/products/category-list';

const API2 = 'https://dummyjson.com/products/category/';

const Catalogo = () => {
    const [datos, setDatos] = useState([]);
    const [datos2, setDatos2] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cat, setCat] = useState("beauty");
    const [titulo, setTitulo] = useState("beauty");
    const [buscar, setBuscar] = useState(''); 
    const getDatos = async () => {
      try {
        const response = await fetch(API1);
        const data = await response.json();
        setDatos(data); // Aquí se asume que data es el array de categorías
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    const getDatos2 = async () => {
        const URI=API2+cat;
        try {
          const response = await fetch(URI);
          const data = await response.json();
          setDatos2(data.products);

        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
    };

    const getBuscar = async (APIBuscar) => {
        try {
          const response = await fetch(APIBuscar);
          const data = await response.json();
          setDatos2(data.products);

        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
    };
    useEffect(() => {
      getDatos();
      getDatos2("beauty");
    }, [cat]);
  
    if (loading) {
      return (
        <View style={styles.loading}>
          <Text style={{ color: Colors.dark.text }}>Cargando...</Text>
        </View>
      );
    }

    const currentColors = Colors.dark;


    const filtrarPorCategorias = (item) => {
        setCat(item);
        setTitulo(item);
        getDatos2(item);
 
    }

    const manejodeBusqueda = async () => {
        if (buscar.trim()) { // Verifica que el texto no esté vacío
            const valor =encodeURIComponent(buscar);
            setTitulo(buscar)
            const APIBuscar=`https://dummyjson.com/products/search?q=${valor}`;
            getBuscar(APIBuscar);
           
        }
    };
        
        

    return (
      <View style={[styles.container, { backgroundColor: currentColors.background }]}>

            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar..."
                    value={buscar}
                    onChangeText={setBuscar}
                />
                <TouchableOpacity style={styles.searchButton} onPress={manejodeBusqueda}>
                    <Text style={styles.searchButtonText}>Buscar</Text>
                </TouchableOpacity>
            </View>
            <View>
                <FlatList
                    data={datos}
                    keyExtractor={(item) => item.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity 
                            onPress={() => filtrarPorCategorias(item)}
                        >
                            <Text style={styles.categoryItem}>{item}</Text>
                        </TouchableOpacity>
                    )}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingVertical: 10 }} // Espacio vertical adicional
                />
            </View>
            <View >
               <Text style={styles.titulo}>({datos2.length}) {titulo.toUpperCase()} </Text> 
            </View>
            
            <FlatList
                data={datos2}
                renderItem={({ item }) => <Cardprod item={item} />}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2} // Establece el número de columnas
            // contentContainerStyle={{marginTop: 10}}
                showsVerticalScrollIndicator={false} // Oculta el indicador de desplazamiento vertical
            />

      </View>
    );
}

export default Catalogo;

// Estilos adicionales para el ScrollView y las categorías
const styles = StyleSheet.create({
    container: {
        flex: 1,
        //justifyContent: "flex-start",
        //alignItems: "center",
        paddingVertical: 20,
        paddingHorizontal: 10,
        backgroundColor: Colors.dark.background,
    },
    loading: {
       // flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.dark.background,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    searchInput: {
        flex: 1,
        height: 50,
        borderColor: '#ccc',
        color: '#fff',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        marginRight: 10,
    },
    searchButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    searchButton: {
        backgroundColor: 'transparent',
        borderColor: '#2980b9',
        borderWidth: 2,
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    headerIcons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    titulo: {
        fontSize: 16,
        textAlign: "center",
        marginVertical: 10,
        color: Colors.dark.text,
    },
    categoryItem: {
        fontSize: 14,
        textAlign: "center",
        marginVertical: 10,
        color: Colors.dark.text,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        backgroundColor: "#fff",
        color: "#000",
        marginHorizontal: 10,
        alignItems: "center",
        
      
    },
   
});