import React, { useEffect, useState } from 'react';
import { Text, View, FlatList, StyleSheet, TouchableOpacity, TextInput, Alert, Modal, ScrollView  } from "react-native";
import { Colors } from "@/constants/Colors";
import Cardprod from '../components/Cardprod';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Importa los íconos
const API1 = 'https://dummyjson.com/products/category-list';
const API2 = 'https://dummyjson.com/products/category/';

const Tienda = () => {
    const [datos, setDatos] = useState([]);
    const [datos2, setDatos2] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cat, setCat] = useState("beauty");
    const [titulo, setTitulo] = useState("beauty");
    const [buscar, setBuscar] = useState(''); 
    const [cart, setCart] = useState([]);
    const [modalVisible, setModalVisible] = useState(false); // State for modal visibility


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
        const URI = API2 + cat;
        try {
            const response = await fetch(URI);
            const data = await response.json();
            setDatos2(data.products);
        } catch (error) {
            console.error(error);
        }
    };

    const getBuscar = async (APIBuscar) => {
        try {
            const response = await fetch(APIBuscar);
            const data = await response.json();
            setDatos2(data.products);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getDatos();
        getDatos2();
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
    };

    const manejodeBusqueda = async () => {
        if (buscar.trim()) { // Verifica que el texto no esté vacío
            const valor = encodeURIComponent(buscar);
            setTitulo(buscar);
            const APIBuscar=`https://dummyjson.com/products/search?q=${valor}`;
            getBuscar(APIBuscar);   
        }
    };

    // Función para agregar productos al carrito
    const agregar = (producto) => {
        setCart((currItems) => {
            const isItemInCart = currItems.find((item) => item.id === producto.id);

            if (isItemInCart) {
                // Si el producto ya está en el carrito, muestra un mensaje
                Alert.alert("Producto ya existe", "Este producto ya está en el carrito.");
                return currItems; // No se modifica el carrito
            } else {
                // Si no está en el carrito, se agrega
                //Alert.alert("Agregado", "Se agregó al carrito.");
                return [...currItems, { ...producto, cantidad: 1 }];
            }
        });
    };

    // Función para eliminar productos del carrito
    const eliminarProductoDelCarrito = (id) => {
        setCart((currItems) => currItems.filter((item) => item.id !== id));
        Alert.alert("Eliminado", "El producto ha sido eliminado del carrito.");
    };

    // Function to increase quantity
    const aumentarCantidad = (id) => {
      setCart((currItems) => 
          currItems.map(item => 
              item.id === id ? { ...item, cantidad: item.cantidad + 1 } : item
          )
      );
  };

  // Function to decrease quantity
  const disminuirCantidad = (id) => {
    setCart((currItems) => {
        return currItems.reduce((updatedItems, item) => {
            if (item.id === id) {
                // Si la cantidad es mayor que 1, disminuye la cantidad
                if (item.cantidad > 1) {
                    updatedItems.push({ ...item, cantidad: item.cantidad - 1 });
                }
                // Si la cantidad es 1, no lo agrega a updatedItems (se elimina)
            } else {
                updatedItems.push(item); // Mantiene el resto de los items
            }
            return updatedItems;
        }, []);
    });
};
    // Calcular total de productos en el carrito
    const totalProductosEnCarrito = cart.reduce((total, item) => total + item.cantidad, 0);

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
                      <TouchableOpacity onPress={() => filtrarPorCategorias(item)}>
                          <Text style={styles.categoryItem}>{item}</Text>
                      </TouchableOpacity>
                  )}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingVertical: 5 }} // Espacio vertical adicional
              />
          </View>
          
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}} >
              <Text style={styles.titulo}> {titulo.toUpperCase()} </Text> 
              <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.cartInfo}>
                <Text style={[styles.categoryItem, styles.categoryItem2 ]}>Carrito: {cart.length} / {totalProductosEnCarrito} </Text>
            </TouchableOpacity>
          </View>
  {/* Modal for cart details */}
<Modal
    animationType="slide"
    transparent={true}
    visible={modalVisible}
    onRequestClose={() => setModalVisible(false)}
>
    <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Detalles del Carrito</Text>
            <ScrollView>
            {cart.length > 0 ? (
                cart.map((item) => (
                    <View key={item.id} style={styles.cartItem}>
                        <View style={styles.productInfo}>
                            <Text style={styles.productSKU}>{item.sku}</Text>
                            <Text style={styles.productTitle}>{item.title.substring(0, 36)}</Text>
                        </View>
                        <View style={styles.actionContainer}>
                            <TouchableOpacity onPress={() => disminuirCantidad(item.id)}>
                                <Icon name="remove-circle-outline" size={35} color="#c0392b" />
                            </TouchableOpacity>
                            <Text style={styles.quantityText}>{item.cantidad}</Text>
                            <TouchableOpacity onPress={() => aumentarCantidad(item.id)}>
                                <Icon name="add-circle-outline" size={35} color="#27ae60" />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))
            ) : (
                <Text>No hay productos en el carrito.</Text>
            )}
             </ScrollView>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
        </View>
    </View>
</Modal>




          <FlatList
              data={datos2}
              renderItem={({ item }) => 
                  <Cardprod 
                      item={item} 
                      pedir={agregar} 
                      isInCart={cart.some(cartItem => cartItem.id === item.id)} // Verifica si está en el carrito
                      eliminar={eliminarProductoDelCarrito} 
                  />
              }
              keyExtractor={(item) => item.id.toString()}
              numColumns={2} // Establece el número de columnas
              showsVerticalScrollIndicator={false} // Oculta el indicador de desplazamiento vertical
          />
      </View>
    );
}

export default Tienda;

// Estilos adicionales para el ScrollView y las categorías
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 10,
        backgroundColor: Colors.dark.background,
    },
    loading: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.dark.background,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    searchInputContainer: {
        flexDirection: 'row',
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
    titulo: {
        fontSize: 14,
        textAlign: "center",
        marginVertical: 5,
        color: Colors.dark.text,
    },
    
   categoryItem:{
       fontSize :14,
       textAlign:"center",
       marginVertical :1 ,
       color :Colors.dark.text ,
       paddingHorizontal :10 ,
       paddingVertical :5 ,
       borderRadius :5 ,
       backgroundColor :"#fff",
       color:"#000",
       marginHorizontal :10 ,
       alignItems :"center",
   },
   categoryItem2:{
   
    backgroundColor :"#d35400",
    color:"#ecf0f1",
    fontWeight: 'bold',
  
},
   cartInfo:{
       marginVertical: 10,
       alignItems:'center',
   },
   cartText:{
       fontSize: 16,
       color: Colors.dark.text,
   },
   cartInfo: {
    marginVertical: 10,
    alignItems: 'center',
},
cartText: {
    fontSize: 16,
    color: Colors.dark.text,
    textDecorationLine: 'underline', // Optional for indicating it's clickable
},
modalContainer:{
  flex: 1,
  justifyContent:'center',
  alignItems:'center',
  paddingVertical:20,
  backgroundColor:'rgba(0,0,0,0.5)', // Semi-transparent background
},
productSKU: {
  fontSize: 16,
  color: '#666',
  fontWeight: 'bold',
},
productTitle: {
  fontSize: 12,
  color: '#666',

},
quantityText: {
  minWidth:25,
  fontSize: 16,
  textAlign: 'center',
},
modalContent:{
  width:'95%',
  maxHeight:'90%',
  marginVertical:30,
  paddingVertical:10,
  paddingHorizontal:15,
  backgroundColor:'#fff',
  borderRadius:10,
},
modalTitle:{
  fontSize:18,
  fontWeight:'bold',
  marginBottom:10,
},
modalHeader:{
  flexDirection:'row',
  justifyContent:'space-between',
  marginBottom:10,
},
headerItem:{
  fontWeight:'bold',
  width:'30%',
},
cartItem:{
  flexDirection:'row',
  justifyContent:'space-between',
  alignItems:'center',
  marginBottom:5,
  borderBottomColor:'#ccc',
  borderBottomWidth:1,
  paddingVertical:5,
},
actionContainer:{
  flexDirection:'row',
  alignItems:'center',
},
closeButton:{
  marginTop:20,
  paddingVertical:10,
  paddingHorizontal:20,
  backgroundColor:'#2980b9',
  borderRadius:5,
},
closeButtonText:{
  color:'#fff',
  fontWeight:'bold',
  textAlign:'center',
}
});