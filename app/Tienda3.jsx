import React, { useEffect, useState } from 'react';
import { Text, View, FlatList, StyleSheet, TouchableOpacity, TextInput, Alert, Modal, ScrollView } from "react-native";
import { Colors } from "@/constants/Colors"; // Actualiza los colores según tu paleta
import Cardprod from '../components/Cardprod2';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Fontisto from '@expo/vector-icons/Fontisto';
import { FontAwesome } from '@expo/vector-icons';
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
    const [modalVisible, setModalVisible] = useState(false);
    const [cantidades, setCantidades] = useState({}); // Estado para las cantidades de cada producto

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
        const cantidadNumerica = parseInt(cantidades[producto.id] || '1'); // Obtener la cantidad específica del producto
        if (isNaN(cantidadNumerica)) {
            Alert.alert("Cantidad inválida", "Por favor, ingrese una cantidad válida.");
            return;
        }

        setCart((currItems) => {
            const isItemInCart = currItems.find((item) => item.id === producto.id);
            if (isItemInCart) {
                if (cantidadNumerica <= 0) {
                    // Si la cantidad es 0, elimina el producto del carrito
                    return currItems.filter(item => item.id !== producto.id);
                } else {
                    if (cantidadNumerica > 0) {
                        return currItems.map(item =>
                            item.id === producto.id
                                ? { ...item, cantidad: cantidadNumerica } // Cambiar la cantidad
                                : item
                        );
                    }
                }
            }
            // Si el producto no está en el carrito, agrégalo
            return [...currItems, { ...producto, cantidad: cantidadNumerica }];
        });
    };
    const eliminarProductoDelCarrito = (id) => {
        setCart((currItems) => currItems.filter((item) => item.id !== id));
        setCantidades((prev) => ({ ...prev, [id]: '' }));
        Alert.alert("Eliminado", "El producto ha sido eliminado del carrito.");
    };

    const cambiarCantidad = (id, incremento) => {
        setCart((currItems) => {
            return currItems.map(item => {
                if (item.id === id) {
                    const nuevaCantidad = item.cantidad + incremento;
                    // Actualiza el estado de cantidades
                    setCantidades((prev) => ({ ...prev, [id]: nuevaCantidad }));
                    return { ...item, cantidad: nuevaCantidad };
                }
                return item;
            });
        });
    };
    const totalProductosEnCarrito = cart.reduce((total, item) => total + item.cantidad, 0);

    const handleCantidadChange = (id, value) => {
        // Verificar si el valor es un número entero mayor a 0
        const cantidadNumerica = parseInt(value, 10);

        // Solo actualizar si es un número entero válido y mayor a 0, o una cadena vacía (para permitir borrar)
        if ((cantidadNumerica > 0) || value === '') {
            setCantidades((prev) => ({ ...prev, [id]: value })); // Actualizar la cantidad específica del producto
        } else {
            // Opcional: puedes mostrar un mensaje de alerta si lo deseas
            Alert.alert("Entrada inválida", "Por favor, ingrese un número entero mayor a 0.");
        }
    };

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

            <View style={styles.header}>
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
                    <View style={styles.productContainer}>
                        <Cardprod item={item} />
                        <View style={styles.quantityContainer}>
                            <TextInput
                                style={styles.quantityInput}
                                keyboardType="numeric"
                                value={cantidades[item.id] ? cantidades[item.id].toString() : ''}
                                onChangeText={(value) => handleCantidadChange(item.id, value)}
                                placeholder=""
                                placeholderTextColor="#fff"
                                onFocus={() => handleCantidadChange(item.id, '')}
                                onBlur={() => {
                                    if (cantidades[item.id] > 0) {
                                        agregar(item); // Agregar automáticamente al carrito al perder el foco
                                    }
                                }}
                            />
                            {
                            <TouchableOpacity onPress={() => agregar(item)} >
                                <Fontisto name="shopping-basket-add" size={30} color="#27ae60" />
                            </TouchableOpacity>
}
                            {cart.some(cartItem => cartItem.id === item.id) && cantidades[item.id] > 0 && (
                                <TouchableOpacity onPress={() => eliminarProductoDelCarrito(item.id)}>
                                    <Fontisto name="shopping-basket-remove" size={30} color="#c0392b" />
                                </TouchableOpacity>
                            )}

                        </View>
                    </View>
                )}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

export default Tienda;

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
        borderRadius: 25,
        paddingHorizontal: 15,
        marginRight: 10,
        backgroundColor: '#fff',
    },
    searchButton: {
        backgroundColor: '#2980b9',
        borderRadius: 25,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    searchButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    titulo: {
        fontSize: 18,
        textAlign: "center",
        marginVertical: 5,
        color: Colors.dark.text,
    },
    categoryItem: {
        fontSize: 14,
        textAlign: "center",
        marginVertical: 5,
        color: "#000",
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 10,
        backgroundColor: "#fff",
        marginHorizontal: 10,
        marginBottom: 20,
        alignItems: "center",
        elevation: 3,
        minHeight: 40,
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
        width: '90%',
        maxHeight: '90%',
        marginVertical: 30,
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: '#fff',
        borderRadius: 15,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
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
        paddingVertical: 25,
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
        fontSize: 14,
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
    productContainer: {
        backgroundColor: '#2c3e50',
        borderRadius: 8,
        padding: 10,
        margin: 5,
        marginVertical: 8,
        elevation: 2,
        width: '50%', // Cambia el ancho a un porcentaje
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    quantityContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
        marginTop: 5,
        marginBottom: 10,


    },
    quantityInput: {
        width: 70,
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        textAlign: 'center',
        marginRight: 10,
        color: '#fff', // Cambiar el color del texto a blanco
        backgroundColor: '#333', // Fondo oscuro para el input
    },
    addButton: {
        backgroundColor: '#27ae60',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});