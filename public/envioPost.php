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
    $ciudad = $_POST['ciudad'];
    $idUsuario = $_POST['idUsuario'];
    $direccion = $_POST['direccion'];
    $codigoPostal = $_POST['codigoPostal'];

    $sqlVerificar = "SELECT * FROM `usuarios` WHERE idUsuario = :idUsuario";
    $stmtVerificar = $conexion->prepare($sqlVerificar);
    $stmtVerificar->bindParam(':idUsuario', $idUsuario);
    $stmtVerificar->execute();
    $existeUsuario = $stmtVerificar->fetch();

    if ($existeUsuario) {
      $sqlVerificar = "UPDATE `usuarios` SET
        ciudad = :ciudad,
        direccion = :direccion,
        codigoPostal = :codigoPostal
        WHERE idUsuario = :idUsuario";

      $stmtVerificar = $conexion->prepare($sqlVerificar);
      $stmtVerificar->bindParam(':ciudad', $ciudad);
      $stmtVerificar->bindParam(':direccion', $direccion);
      $stmtVerificar->bindParam(':codigoPostal', $codigoPostal);
      $stmtVerificar->bindParam(':idUsuario', $idUsuario); 
      $stmtVerificar->execute();

      $sqlInsert = "INSERT INTO `opcionenvio` (ciudad, idUsuario, direccion, codigoPostal)
        VALUES (:ciudad, :idUsuario, :direccion, :codigoPostal)";
      $stmt = $conexion->prepare($sqlInsert);
      $stmt->bindParam(':ciudad', $ciudad);
      $stmt->bindParam(':idUsuario', $idUsuario); 
      $stmt->bindParam(':direccion', $direccion);
      $stmt->bindParam(':codigoPostal', $codigoPostal);
      $stmt->execute();

      echo json_encode(["mensaje" => "Datos de envío confirmados", "usuario" => $existeUsuario]);
    } else {
      echo json_encode(["error" => "Por favor, complete todos los campos correctamente"]);
    }
  }
} catch (PDOException $error) {
  echo json_encode(["error" => "Error de conexión: " . $error->getMessage()]);
}
