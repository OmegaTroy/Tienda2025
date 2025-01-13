<?php

declare(strict_types=1);

header("Access-Control-Allow-Origin: http://localhost:3000"); // Cambia a "*" si deseas permitir cualquier origen
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

// Si es una solicitud OPTIONS, detén la ejecución aquí
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit();
}

use MercadoPago\MercadoPagoConfig;
use MercadoPago\Client\Preference\PreferenceClient;

require __DIR__ . '/vendor/autoload.php';

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

$TOKEN_ACCESS = $_ENV['MP_ACCESS_TOKEN'];

// Configura las credenciales de Mercado Pago
MercadoPagoConfig::setAccessToken($TOKEN_ACCESS);

// Crea el endpoint para generar una preferencia de pago
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  // Obtener los datos de la petición
  $data = json_decode(file_get_contents('php://input'), true);
  $client = new PreferenceClient();

  // Crear preferencia de pago
  $preference = $client->create([
    'items' => array(
      array(
        'id' => '1',
        'title' => 'Producto 1',
        'quantity' => 1,
        'currency_id' => 'ARS',
        'unit_price' => 1000,
      )
    ),
    'statement_descriptor' => 'Tienda Virtualtech',
    'external_reference' => $data['id'],
  ]);

  $preference->back_urls = array(
    'success' => "http://localhost:8080/tienda2025/public/success.php",
    'failure' => "http://localhost:8080/tienda2025/public/failure.php",
  );
  $preference->auto_return = 'approved';

  $preference->binary_mode = true;
  // Guardar preferencia de pago en la base de datos
  // Enviar respuesta con el ID de la preferencia de pago
  echo json_encode([
    'data' => $preference
  ]);
}
