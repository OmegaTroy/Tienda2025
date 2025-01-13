<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
// Cargar variables de entorno desde el archivo .env
require __DIR__ . '/vendor/autoload.php';

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Obtener los valores de las variables de entorno
$servidor = $_ENV['DB_HOST'] . ':' . $_ENV['DB_PORT'];
$usuario = $_ENV['DB_USER'];
$contrasena = $_ENV['DB_PASS'];
$dbname = $_ENV['DB_NAME'];

// Crear una conexión a la base de datos
try {
  $dsn = "mysql:host=$servidor;dbname=$dbname";
  $conexion = new PDO($dsn, $usuario, $contrasena);
  $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);


  // Verificar si se ha enviado el parámetro 'id' por GET
  if (isset($_GET['id'])) {
    $id = $_GET['id'];

    // Preparar y ejecutar la consulta para buscar al usuario por ID
    $stmt = $pdo->prepare("SELECT * FROM usuarios WHERE id = :id");
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    $stmt->execute();

    // Verificar si se encontró al usuario
    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($usuario) {
      // Devolver los datos del usuario en formato JSON
      echo json_encode($usuario);
    } else {
      // Si no se encuentra el usuario, devolver un mensaje de error
      echo json_encode(['mensaje' => 'Usuario no encontrado']);
    }
  } else {
    echo json_encode(['mensaje' => 'ID no proporcionado']);
  }
} catch (PDOException $error) {
  echo json_encode(['error' => 'Error de conexión: ' . $error->getMessage()]);
}
