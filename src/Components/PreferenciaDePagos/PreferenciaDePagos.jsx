import { useState, useEffect } from "react";
import baseURL from "../url";
import "./PreferenciaDePago.css";

const PreferenciaDePagos = ({ precio }) => {
  const [productos, setProductos] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  // Función para obtener los productos
  const fetchProductos = async () => {
    try {
      const response = await fetch(`${baseURL}/productosGet.php`);
      const data = await response.json();
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
        const productosDelCarrito = productosId.map((item) => {
          const producto = productos.find(
            (producto) => producto.idProducto === item.idProducto
          );
          return producto
            ? { ...producto, cantidad: item.cantidad || 1 }
            : null;
        });
        console.log(productosDelCarrito);
        setCartItems(productosDelCarrito.filter(Boolean));
      }
    };
    productosFechado();
  }, [productos]);

  const createPreference = async () => {
    if (cartItems.length === 0) {
      console.error("Error: No hay productos en el carrito.");
      return;
    }

    const productsForPreference = cartItems.map((item) => ({
      id: item.idProducto,
      title: item.titulo, // Usar 'nombre' en lugar de 'titulo' si es el campo correcto
      quantity: item.cantidad,
      price: item.precio,
    }));

    try {
      const response = await fetch(
        `http://localhost:8080/tienda2025/public/preferenciaDePago.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ products: productsForPreference }),
        }
      );

      const data = await response.json();
      console.log(data);
      if (data && data.data) {
        const mp = new window.MercadoPago(
          "APP_USR-ac48bda1-5b83-4dd2-9c82-e562e4d9c9c8",
          {
            locale: "es-AR",
          }
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
