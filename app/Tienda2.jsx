import React, { useEffect, useState } from 'react';
import { Text, View, FlatList, StyleSheet, TouchableOpacity, TextInput, Alert, Modal, ScrollView } from "react-native";
import { Colors } from "@/constants/Colors";
import Cardprod from '../components/Cardprod';
import Icon from 'react-native-vector-icons/MaterialIcons';

const API1 = 'https://dummyjson.com/products/category-list';
const API2 = 'https://dummyjson.com/products/category/';

const Tienda2 = () => {
    const [datos, setDatos] = useState([]);
    const [datos2, setDatos2] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cat, setCat] = useState("beauty");
    const [titulo, setTitulo] = useState("beauty");
    const [buscar, setBuscar] = useState('');
    const [cart, setCart] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    const fetchData = async (url, setter) => {
        try {
            const response = await fetch(url);
            const data = await response.json();
            setter(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(API1, setDatos);
        fetchData(API2 + cat, (data) => setDatos2(data.products));
    }, [cat]);

    const filtrarPorCategorias = (item) => {
        setCat(item);
        setTitulo(item);
        fetchData(API2 + item, (data) => setDatos2(data.products));
    };

    const manejodeBusqueda = async () => {
        if (buscar.trim()) {
            const valor = encodeURIComponent(buscar);
            setTitulo(buscar);
            fetchData(`https://dummyjson.com/products/search?q=${valor}`, (data) => setDatos2(data.products));
        }
    };

    const agregar = (producto) => {
        setCart((currItems) => {
            const isItemInCart = currItems.find((item) => item.id === producto.id);
            if (isItemInCart) {
                Alert.alert("Producto ya existe", "Este producto ya está en el carrito.");
                return currItems;
            }
            return [...currItems, { ...producto, cantidad: 1 }];
        });
    };

    const eliminarProductoDelCarrito = (id) => {
        setCart((currItems) => currItems.filter((item) => item.id !== id));
        Alert.alert("Eliminado", "El producto ha sido eliminado del carrito.");
    };

    const cambiarCantidad = (id, incremento) => {
        setCart((currItems) => currItems.map(item => 
            item.id === id ? { ...item, cantidad: item.cantidad + incremento } : item
        ));
    };

    const totalProductosEnCarrito = cart.reduce((total, item) => total + item.cantidad, 0);

    if (loading) {
        return (
            <View style={styles.loading}>
                <Text style={{ color: Colors.dark.text }}>Cargando...</Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: Colors.dark.background }]}>
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
                contentContainerStyle={{ paddingVertical: 5 }}
            />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={styles.titulo}>{titulo.toUpperCase()}</Text>
                <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.cartInfo}>
                    <Text style={[styles.categoryItem, styles.categoryItem2]}>
                        Carrito: {cart.length} / {totalProductosEnCarrito}
                    </Text>
                </TouchableOpacity>
            </View>

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
                                            <TouchableOpacity onPress={() => cambiarCantidad(item.id, -1)}>
                                                <Icon name="remove-circle-outline" size={35} color="#c0392b" />
                                            </TouchableOpacity>
                                            <Text style={styles.quantityText}>{item.cantidad}</Text>
                                            <TouchableOpacity onPress={() => cambiarCantidad(item.id, 1)}>
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
                renderItem={({ item }) => (
                    <Cardprod
                        item={item}
                        pedir={agregar}
                        isInCart={cart.some(cartItem => cartItem.id === item.id)}
                        eliminar={eliminarProductoDelCarrito}
                    />
                )}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

export default Tienda2;

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
    searchButton: {
        backgroundColor: 'transparent',
        borderColor: '#2980b9',
        borderWidth: 2,
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    searchButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    titulo: {
        fontSize: 14,
        textAlign: "center",
        marginVertical: 5,
        color: Colors.dark.text,
    },
    categoryItem: {
        fontSize: 14,
        textAlign: "center",
        marginVertical: 1,
        color: "#000",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        backgroundColor: "#fff",
        marginHorizontal: 10,
        alignItems: "center",
        minHeight: 30,
    },
    categoryItem2: {
        backgroundColor: "#d35400",
        color: "#ecf0f1",
        fontWeight: 'bold',
    },
    cartInfo: {
        marginVertical: 10,
        alignItems: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '95%',
        maxHeight: '90%',
        marginVertical: 30,
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    cartItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        paddingVertical: 5,
    },
    productInfo: {
        // Define estilos para la información del producto aquí
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
    actionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityText: {
        minWidth: 25,
        fontSize: 16,
        textAlign: 'center',
    },
    closeButton: {
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#2980b9',
        borderRadius: 5,
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});