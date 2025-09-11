<?php
header('Content-Type: application/json');

// Caminho para o arquivo de texto
$orders_file = 'orders.txt';

// Receber dados do pedido
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Validação dos dados
if (!$data || !isset($data['name'], $data['date'], $data['deliveryType'], $data['cep'], $data['street'], $data['number'], $data['neighborhood'], $data['city'], $data['state'], $data['whatsapp'], $data['flavor'], $data['price'], $data['groupCode'])) {
    echo json_encode(['success' => false, 'message' => 'Dados do pedido incompletos']);
    exit;
}

// Sanitizar dados
$name = filter_var($data['name'], FILTER_SANITIZE_STRING);
$date = filter_var($data['date'], FILTER_SANITIZE_STRING);
$deliveryType = filter_var($data['deliveryType'], FILTER_SANITIZE_STRING);
$deliveryNote = filter_var($data['deliveryNote'], FILTER_SANITIZE_STRING);
$cep = filter_var($data['cep'], FILTER_SANITIZE_STRING);
$street = filter_var($data['street'], FILTER_SANITIZE_STRING);
$number = filter_var($data['number'], FILTER_SANITIZE_STRING);
$neighborhood = filter_var($data['neighborhood'], FILTER_SANITIZE_STRING);
$city = filter_var($data['city'], FILTER_SANITIZE_STRING);
$state = filter_var($data['state'], FILTER_SANITIZE_STRING);
$whatsapp = filter_var($data['whatsapp'], FILTER_SANITIZE_STRING);
$flavor = filter_var($data['flavor'], FILTER_SANITIZE_STRING);
$price = filter_var($data['price'], FILTER_SANITIZE_STRING);
$groupCode = filter_var($data['groupCode'], FILTER_SANITIZE_STRING);

// Validar formatos
if (!preg_match('/^\d+,\d{2}$/', $price)) {
    echo json_encode(['success' => false, 'message' => 'Formato de preço inválido']);
    exit;
}
if (!preg_match('/^\(\d{2}\)\s\d{5}-\d{4}$/', $whatsapp)) {
    echo json_encode(['success' => false, 'message' => 'Formato de WhatsApp inválido']);
    exit;
}
if (!preg_match('/^\d{5}-\d{3}$/', $cep)) {
    echo json_encode(['success' => false, 'message' => 'Formato de CEP inválido']);
    exit;
}

// Montar a linha do pedido
$order_line = sprintf(
    "[%s] Nome: %s | Data de Entrega: %s | Tipo de Entrega: %s | Observação: %s | CEP: %s | Rua: %s | Número: %s | Bairro: %s | Cidade: %s | Estado: %s | WhatsApp: %s | Sabor: %s | Preço: R$ %s | Código do Grupo: %s\n",
    date('Y-m-d H:i:s'),
    $name,
    $date,
    $deliveryType,
    $deliveryNote,
    $cep,
    $street,
    $number,
    $neighborhood,
    $city,
    $state,
    $whatsapp,
    $flavor,
    $price,
    $groupCode
);

try {
    // Salvar no arquivo orders.txt
    $result = file_put_contents($orders_file, $order_line, FILE_APPEND | LOCK_EX);
    if ($result === false) {
        echo json_encode(['success' => false, 'message' => 'Erro ao salvar o pedido no arquivo']);
        exit;
    }
    echo json_encode(['success' => true, 'message' => 'Pedido salvo com sucesso']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Erro inesperado: ' . $e->getMessage()]);
}
?>
