<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Permitir solicitudes desde cualquier origen (no seguro para producción)

require __DIR__ . '/vendor/autoload.php';

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Obtener los valores de las variables de entorno
$servidor = $_ENV['DB_HOST'] . ':' . $_ENV['DB_PORT'];
$usuario = $_ENV['DB_USER'];
$contrasena = $_ENV['DB_PASS'];
$dbname = $_ENV['DB_NAME'];

try {
  // Establecer conexión a la base de datos
  $dsn = "mysql:host=$servidor;dbname=$dbname";
  $conexion = new PDO($dsn, $usuario, $contrasena);
  $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

  // Verificar el método de la solicitud
  $metodo = $_SERVER['REQUEST_METHOD'];

  // Si es un método GET, obtener todos los usuarios o un usuario específico
  if ($metodo == 'GET') {
    $idUsuario = isset($_GET['idUsuario']) ? $_GET['idUsuario'] : null;

    if ($idUsuario) {
      // Obtener usuario por idUsuario
      $sqlSelect = "SELECT * FROM usuarios WHERE idUsuario = :idUsuario";
      $sentencia = $conexion->prepare($sqlSelect);
      $sentencia->bindParam(':idUsuario', $idUsuario, PDO::PARAM_INT);

      // Ejecutar la consulta
      if ($sentencia->execute()) {
        $resultado = $sentencia->fetch(PDO::FETCH_ASSOC);

        $usuario = [
          "idUsuario" => $resultado['idUsuario'],
          "nombre" => $resultado['nombre'],
          "email" => $resultado['email'],
          "rol" => $resultado['rol'],
        ];
        if ($resultado) {
          echo json_encode(["usuario" => $usuario]);
        } else {
          echo json_encode(["error" => "Usuario no encontrado."]);
        }
      } else {
        echo json_encode(["error" => "Error al ejecutar la consulta SQL: " . implode(", ", $sentencia->errorInfo())]);
      }
    } else {
      // Obtener todos los usuarios si no se proporciona idUsuario
      $sqlSelect = "SELECT idUsuario, nombre, email, rol, createdAt FROM usuarios";
      $sentencia = $conexion->prepare($sqlSelect);

      if ($sentencia->execute()) {
        $resultado = $sentencia->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(["usuarios" => $resultado]);
      } else {
        echo json_encode(["error" => "Error al ejecutar la consulta SQL: " . implode(", ", $sentencia->errorInfo())]);
      }
    }
  } elseif ($metodo == 'DELETE') {
    // Eliminar usuario por id
    $idUsuario = isset($_GET['idUsuario']) ? $_GET['idUsuario'] : null;

    if (!$idUsuario) {
      echo json_encode(["error" => "Se requiere proporcionar un ID de usuario para eliminarlo."]);
      exit;
    }

    $sqlDelete = "DELETE FROM usuarios WHERE idUsuario = :idUsuario";
    $sentencia = $conexion->prepare($sqlDelete);
    $sentencia->bindParam(':idUsuario', $idUsuario, PDO::PARAM_INT);

    if ($sentencia->execute()) {
      echo json_encode(["mensaje" => "Usuario eliminado correctamente"]);
    } else {
      echo json_encode(["error" => "Error al eliminar al usuario: " . implode(", ", $sentencia->errorInfo())]);
    }
  } elseif ($metodo == 'PUT') {
    // Actualizar rol de usuario
    $idUsuario = isset($_GET['idUsuario']) ? $_GET['idUsuario'] : null;
    $datos = json_decode(file_get_contents("php://input"), true);

    if (!$idUsuario || !$datos) {
      echo json_encode(["error" => "Se requiere proporcionar un ID y datos para actualizar al usuario."]);
      exit;
    }

    $sqlUpdate = "UPDATE usuarios SET rol = :rol WHERE idUsuario = :idUsuario";
    $sentencia = $conexion->prepare($sqlUpdate);
    $sentencia->bindParam(':rol', $datos['rol']);
    $sentencia->bindParam(':idUsuario', $idUsuario, PDO::PARAM_INT);

    if ($sentencia->execute()) {
      echo json_encode(["mensaje" => "Rol de usuario actualizado correctamente"]);
    } else {
      echo json_encode(["error" => "Error al actualizar el rol del usuario: " . implode(", ", $sentencia->errorInfo())]);
    }
  }
} catch (PDOException $error) {
  // Manejar errores específicos de la conexión
  echo json_encode(["error" => "Error de conexión: " . $error->getMessage()]);
} catch (Exception $error) {
  // Manejar otros tipos de errores
  echo json_encode(["error" => "Error desconocido: " . $error->getMessage()]);
}
