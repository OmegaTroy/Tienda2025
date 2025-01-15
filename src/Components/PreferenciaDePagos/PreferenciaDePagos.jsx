import { useState, useEffect } from "react";
import baseURL from "../url";
import "./PreferenciaDePago.css";

const PreferenciaDePagos = ({precio}) => {
  // creando la petición para la preferencia de pago
  const [productos, setProductos] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [quantity, setQuantity] = useState(1);

  console.log(precio);
  // Función para obtener los productos
  const fetchProductos = async () => {
    try {
      const response = await fetch(`${baseURL}/productosGet.php`);
      const data = await response.json();
      console.log(data);
      setProductos(data.productos);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  };



  // Cargar los productos al iniciar
  useEffect(() => {
    fetchProductos();
  }, []);

  // Cargar productos del carrito desde el localStorage y mapearlos con los productos del backend
  useEffect(() => {
    const productosFechado = async () => {
      if (productos.length > 0) {
        const productosId = JSON.parse(localStorage.getItem("cart")) || [];
        setQuantity(productosId[0].cantidad);
        const productosDelCarrito = productosId.map((item) => {
          return productos.find(
            (producto) => producto.idProducto === item.idProducto
          );
        });
        await setCartItems(productosDelCarrito.filter(Boolean)); // Filtrar posibles elementos no encontrados
      }
    };
    productosFechado();
  }, [productos]); // Solo se ejecuta cuando 'productos' cambia

  const createPreference = async () => {
    if (cartItems.length === 0) {
      console.error("Error: No hay productos en el carrito.");
      return;
    }

    const { titulo, idProducto} = cartItems[0]; // Accede directamente al producto
    console.log("Datos enviados al backend:", {
      idProducto,
      titulo,
      quantity,
      precio
    });

    try {
      const response = await fetch(
        `http://localhost:8080/tienda2025/public/preferenciaDePago.php`,
        {
          method: "POST",
          body: JSON.stringify({
            id: idProducto,
            title: titulo,
            quantity: quantity,
            price: precio,
          }),
        }
      );

      const data = await response.json();
      console.log("Respuesta del backend:", data.data);

      if (data) {
        const mp = new window.MercadoPago(
          "APP_USR-ac48bda1-5b83-4dd2-9c82-e562e4d9c9c8",
          {
            locale: "es-AR",

          },
        );

        mp.checkout({
          preference: {
            id: data.data.id,
          },
          autoOpen: true,

        });
      } else {
        console.error("Error: No se recibió un ID de preferencia válido");
      }
    } catch (error) {
      console.error("Error al crear la preferencia:", error);
    }
  };
  return (
    <button onClick={createPreference} className="mp-button">
      Pagar con Mercado Pago
    </button>
  );
};

export default PreferenciaDePagos;
