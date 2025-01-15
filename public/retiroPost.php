<?php
header("Content-Type: application/json");
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

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
$rutaweb = $_ENV['RUTA_WEB'];


try {
  $dsn = "mysql:host=$servidor;dbname=$dbname";
  $conexion = new PDO($dsn, $usuario, $contrasena);
  $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

  if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $idUsuario = $_POST['idUsuario'];
    $tienda = $_POST['tienda'];

    $sqlVerificar = "SELECT * FROM `usuarios` WHERE idUsuario = :idUsuario";
    $stmtVerificar = $conexion->prepare($sqlVerificar);
    $stmtVerificar->bindParam(':idUsuario', $idUsuario);
    $stmtVerificar->execute();
    $existeUsuario = $stmtVerificar->fetch();

    if ($existeUsuario) {

      $sqlInsert = "INSERT INTO `retiros` (idUsuario,tienda)
        VALUES (:idUsuario,:tienda)";
      $stmt = $conexion->prepare($sqlInsert);
      $stmt->bindParam(':idUsuario', $idUsuario);
      $stmt->bindParam(':tienda', $tienda);
      $stmt->execute();

      echo json_encode(["mensaje" => "Datos de envío confirmados", "usuario" => $existeUsuario]);
    } else {
      echo json_encode(["error" => "Por favor, complete todos los campos correctamente"]);
    }
  }
} catch (PDOException $error) {
  echo json_encode(["error" => "Error de conexión: " . $error->getMessage()]);
}
