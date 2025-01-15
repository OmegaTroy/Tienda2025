import { useState, useEffect } from "react";
import baseURL from "../../Components/url";
import { costeDeEnvio } from "../../util/util";
import PreferenciaDePagos from "../../Components/PreferenciaDePagos/PreferenciaDePagos";
import { useEnvio } from "../../hooks/useEnvio";
import React from "react";
import { toast, ToastContainer } from "react-toastify";

const Checkout = () => {
  const [productos, setProductos] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [ciudad, setCiudad] = useState("");
  const [direccion, setDireccion] = useState("");
  const [codigoPostal, setCodigoPostal] = useState("");
  const [tienda, setTienda] = useState("");
  const [precio, setPrecio] = useState(0);
  const [precioTotal, setPrecioTotal] = useState(0);
  const [deliveryMethod, setDeliveryMethod] = useState("delivery");
  const [isValidEnvio, setIsValidEnvio] = useState(false);
  const [isEnvioConfirmed, setIsEnvioConfirmed] = useState(false); // Nuevo estado
  const { fetchEnvio, fetchRetiro, data } = useEnvio();

  // Función para obtener los productos
  const fetchProductos = async () => {
    try {
      const response = await fetch(`${baseURL}/productosGet.php`);
      const dataJson = await response.json();
      setProductos(dataJson.productos);
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
    if (productos.length > 0) {
      const productosId = JSON.parse(localStorage.getItem("cart")) || [];
      const productosDelCarrito = productosId.map((item) => {
        const producto = productos.find(
          (producto) => producto.idProducto === item.idProducto
        );
        return { ...producto, cantidad: item.cantidad || 1 };
      });
      setCartItems(productosDelCarrito.filter(Boolean));
    }
  }, [productos]);

  // Cálculo del precio total
  useEffect(() => {
    const total = cartItems.reduce(
      (acc, item) => acc + item.precio * item.cantidad,
      0
    );
    setPrecio(total);
    setPrecioTotal(total + costeDeEnvio);
  }, [cartItems]);

  // Validar datos de envío
  useEffect(() => {
    if (direccion && ciudad && codigoPostal) {
      setIsValidEnvio(true);
    } else {
      setIsValidEnvio(false);
    }
  }, [direccion, ciudad, codigoPostal]);

  // Enviar datos de envío
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await localStorage.getItem("token");
      const usuario = JSON.parse(token);
      const idUsuario = usuario.usuario.idUsuario;
      if (idUsuario !== null) {
        await fetchEnvio(ciudad, idUsuario, direccion, codigoPostal);
        console.log(data);
        if (data.ok) {
          // Verifica que la respuesta del servidor indique éxito
          setIsEnvioConfirmed(true);
        } else {
          toast.error("Hubo un error al confirmar los datos de envío.");
        }
      } else {
        toast.error("No se encontró el usuario.");
      }
    } catch (error) {
      toast.error("Hubo un error al confirmar los datos de envío.");
    }
  };

  const handleRetiroSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await localStorage.getItem("token");
      const usuario = JSON.parse(token);
      const idUsuario = usuario.usuario.idUsuario;
      if (idUsuario !== null) {
        const response = await fetchRetiro(idUsuario, tienda);
        console.log(data);
        if (response.ok) {
          // Verifica que la respuesta del servidor indique éxito
          setIsEnvioConfirmed(true);
        } else {
          toast.error("Hubo un error al confirmar los datos de envío.");
        }
      } else {
        toast.error("No se encontró el usuario.");
      }
    } catch (error) {
      toast.error("Hubo un error al confirmar los datos de envío.");
    }
  };
  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", padding: "1rem" }}>
      <ToastContainer />
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "2rem",
        }}
      >
        {/* Columna izquierda - Carrito */}
        <div>
          <div className="form-section">
            <h2>Método de entrega</h2>
            <div className="form-radio-group">
              <div className="form-radio">
                <input
                  type="radio"
                  id="delivery"
                  name="deliveryMethod"
                  value="delivery"
                  checked={deliveryMethod === "delivery"}
                  onChange={() => setDeliveryMethod("delivery")}
                />
                <label name="delivery">Envío a domicilio</label>
              </div>
              <div className="form-radio">
                <input
                  type="radio"
                  id="pickup"
                  name="deliveryMethod"
                  value="pickup"
                  checked={deliveryMethod === "pickup"}
                  onChange={() => setDeliveryMethod("pickup")}
                />
                <label name="pickup">Retiro en tienda</label>
              </div>
            </div>
          </div>

          {deliveryMethod === "delivery" && (
            <form onSubmit={handleSubmit} className="form-section">
              <h2>Dirección de envío</h2>
              <div className="form-field">
                <label name="direccion">Dirección</label>
                <input
                  id="direccion"
                  name="direccion"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  type="text"
                  required
                  placeholder="Av. Principal 123"
                />
              </div>
              <div className="form-grid">
                <div className="form-field">
                  <label name="ciudad">Ciudad</label>
                  <input
                    id="ciudad"
                    name="ciudad"
                    value={ciudad}
                    onChange={(e) => setCiudad(e.target.value)}
                    type="text"
                    required
                    placeholder="Ciudad"
                  />
                </div>
                <div className="form-field">
                  <label name="codigoPostal">Código postal</label>
                  <input
                    id="codigoPostal"
                    name="codigoPostal"
                    value={codigoPostal}
                    onChange={(e) => setCodigoPostal(e.target.value)}
                    type="number"
                    required
                    placeholder="12345"
                  />
                </div>
              </div>
              <button className="btn" type="submit" disabled={!isValidEnvio}>
                Confirmar datos de Envio
              </button>
            </form>
          )}
          {deliveryMethod === "pickup" && (
            <form onSubmit={handleRetiroSubmit} className="form-section">
              <h2 className="text-xl font-semibold">Punto de retiro</h2>
              <div className="space-y-2">
                <label htmlFor="pickupLocation" className="block font-medium">
                  Selecciona la tienda
                </label>
                <select
                  id="pickupLocation"
                  className="w-full p-2 border rounded"
                  onChange={(e) => {
                    setTienda(e.target.value);
                    console.log(e.target.value); // Agrega esta línea para verificar
                  }}
                  required
                >
                  <option value="">Selecciona una tienda</option>
                  <option value="store1">Tienda Centro</option>
                  <option value="store2">Tienda Norte</option>
                  <option value="store3">Tienda Sur</option>
                </select>
              </div>
              <button className="btn" type="submit" disabled={!tienda}>
                Confirmar datos de retiro
              </button>
            </form>
          )}
        </div>

        {/* Columna derecha - Resumen */}
        <div>
          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "1rem",
            }}
          >
            <h2 style={{ fontSize: "1.25rem" }}>Resumen</h2>
            <div style={{ marginTop: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Subtotal</span>
                <span>AR${precio}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "0.5rem",
                }}
              >
                <span>Gastos de envío</span>
                <span>AR${costeDeEnvio}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: "bold",
                  fontSize: "1.125rem",
                  marginTop: "1rem",
                }}
              >
                <span>Total estimado</span>
                <span>AR${precioTotal}</span>
              </div>
              {isEnvioConfirmed ? (
                <PreferenciaDePagos
                  precio={precioTotal}
                  cartItems={cartItems}
                />
              ) : (
                <span>Confirma los datos de envío para proceder al pago.</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
