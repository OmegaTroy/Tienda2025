<?php

declare(strict_types=1);

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

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

MercadoPagoConfig::setAccessToken($TOKEN_ACCESS);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $data = json_decode(file_get_contents('php://input'), true);
  $client = new PreferenceClient();

  // Crear una lista de ítems para la preferencia de pago
  $items = array_map(function ($product) {
    return [
      'id' => $product['id'],
      'title' => $product['title'],
      'quantity' => $product['quantity'],
      'currency_id' => 'ARS',
      'unit_price' => $product['price'],
    ];
  }, $data['products']);

  // Crear preferencia de pago
  try {
    $preference = $client->create([
      'items' => $items,
      'statement_descriptor' => 'Tienda Virtualtech',
      'external_reference' => uniqid(), // Usa un ID único para la referencia externa
    ]);
    $preference->binary_mode = true;

    echo json_encode([
      'data' => $preference
    ]);
  } catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
      'error' => 'Error al crear la preferencia',
      'details' => $e->getMessage()
    ]);
  }
}
