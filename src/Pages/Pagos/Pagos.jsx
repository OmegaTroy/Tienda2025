import { useState, useEffect } from "react";
import "./Pagos.css";
import baseURL from "../../Components/url";
import PreferenciaDePagos from "../../Components/PreferenciaDePagos/PreferenciaDePagos";

const Checkout = () => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [productos, setProductos] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [deliveryMethod, setDeliveryMethod] = useState("delivery");

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
    if (productos.length > 0) {
      const productosId = JSON.parse(localStorage.getItem("cart")) || [];
      const productosDelCarrito = productosId.map((item) => {
        return productos.find(
          (producto) => producto.idProducto === item.idProducto
        );
      });
      setCartItems(productosDelCarrito.filter(Boolean)); // Filtrar posibles elementos no encontrados
    }
  }, [productos]); // Solo se ejecuta cuando 'productos' cambia

  // Manejo de la cantidad
  const handleQuantityChange = (action) => {
    if (action === "decrease" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    } else if (action === "increase") {
      setQuantity((prev) => prev + 1);
    }
  };

  // Función para procesar el pago

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", padding: "1rem" }}>
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
            <div className="form-section">
              <h2>Dirección de envío</h2>
              <div className="form-field">
                <label name="direccion">Dirección</label>
                <input
                  id="direccion"
                  name="direccion"
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
                    type="number"
                    required
                    placeholder="12345"
                  />
                </div>
              </div>
            </div>
          )}
          {deliveryMethod === "pickup" && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Punto de retiro</h2>
              <div className="space-y-2">
                <label htmlFor="pickupLocation" className="block font-medium">
                  Selecciona la tienda
                </label>
                <select
                  id="pickupLocation"
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Selecciona una tienda</option>
                  <option value="store1">Tienda Centro</option>
                  <option value="store2">Tienda Norte</option>
                  <option value="store3">Tienda Sur</option>
                </select>
              </div>
            </div>
          )}
        </div>

        <div>
          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "1rem",
            }}
          >
            <h2
              style={{
                fontSize: "1.25rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              Cesta ({cartItems.length})
              <button
                style={{
                  color: "#2563eb",
                  fontSize: "0.875rem",
                  textDecoration: "underline",
                }}
              >
                Borrar artículos seleccionados
              </button>
            </h2>
            {cartItems.length === 0 ? (
              <p>No hay productos en tu carrito.</p>
            ) : (
              cartItems.map((item, index) => (
                <div
                  key={index}
                  style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}
                >
                  <img
                    src={item.imagen || "/default-image.png"}
                    alt={item.nombre}
                    style={{
                      width: "96px",
                      height: "96px",
                      borderRadius: "4px",
                      objectFit: "cover",
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontWeight: "500" }}>{item.nombre}</h3>
                    <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                      {item.descripcion || "Sin descripción"}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: "1rem",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <button
                          onClick={() => handleQuantityChange("decrease")}
                          style={{
                            border: "1px solid #ddd",
                            padding: "0.5rem",
                            borderRadius: "4px",
                          }}
                        >
                          -
                        </button>
                        <span style={{ textAlign: "center", width: "32px" }}>
                          {quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange("increase")}
                          style={{
                            border: "1px solid #ddd",
                            padding: "0.5rem",
                            borderRadius: "4px",
                          }}
                        >
                          +
                        </button>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "1rem",
                        }}
                      >
                        <button
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "#6b7280",
                            cursor: "pointer",
                          }}
                        >
                          🗑
                        </button>
                        <span style={{ fontWeight: "500" }}>
                          AR${(item.precio * quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
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
                <span>
                  AR$
                  {cartItems
                    .reduce((acc, item) => acc + item.precio * quantity, 0)
                    .toFixed(2)}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "0.5rem",
                }}
              >
                <span>Gastos de envío</span>
                <span>AR$1000.00</span>
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
                <span>
                  AR$
                  {(
                    cartItems.reduce(
                      (acc, item) => acc + item.precio * quantity,
                      0
                    ) + 1000
                  ).toFixed(2)}
                </span>
              </div>
              <PreferenciaDePagos cartItems={cartItems} quantity={quantity} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
