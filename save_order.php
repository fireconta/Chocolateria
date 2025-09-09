<?php
header('Content-Type: application/json');

// Receber dados do POST
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Validar dados recebidos
$required_fields = ['name', 'date', 'cep', 'street', 'number', 'neighborhood', 'city', 'state', 'whatsapp', 'flavor', 'price', 'groupCode'];
foreach ($required_fields as $field) {
    if (!isset($data[$field]) || empty(trim($data[$field]))) {
        echo json_encode(['success' => false, 'error' => "Campo $field está vazio ou não foi fornecido"]);
        exit;
    }
}

// Formatar dados para o arquivo
$order_text = "Nome: {$data['name']}\n\n";
$order_text .= "Data de Entrega: {$data['date']}\n\n";
$order_text .= "CEP: {$data['cep']}\n\n";
$order_text .= "Rua: {$data['street']}\n\n";
$order_text .= "Número: {$data['number']}\n\n";
$order_text .= "Bairro: {$data['neighborhood']}\n\n";
$order_text .= "Cidade: {$data['city']}\n\n";
$order_text .= "Estado: {$data['state']}\n\n";
$order_text .= "WhatsApp: {$data['whatsapp']}\n\n";
$order_text .= "Sabor: {$data['flavor']}\n\n";
$order_text .= "Preço: R$ {$data['price']}\n\n";
$order_text .= "Código do Grupo: {$data['groupCode']}\n\n\n\n";

// Caminho do arquivo
$file = 'orders.txt';

// Salvar no arquivo (append mode)
try {
    file_put_contents($file, $order_text, FILE_APPEND | LOCK_EX);
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
