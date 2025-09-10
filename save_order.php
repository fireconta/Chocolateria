<?php
header('Content-Type: application/json');

// Configurações do banco de dados (ajuste conforme necessário)
$host = 'localhost';
$dbname = 'chocolatria';
$username = 'seu_usuario';
$password = 'sua_senha';

try {
    // Conexão com o banco de dados
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

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

    // Validar formato do preço
    if (!preg_match('/^\d+,\d{2}$/', $price)) {
        echo json_encode(['success' => false, 'message' => 'Formato de preço inválido']);
        exit;
    }

    // Validar formato do WhatsApp
    if (!preg_match('/^\(\d{2}\)\s\d{5}-\d{4}$/', $whatsapp)) {
        echo json_encode(['success' => false, 'message' => 'Formato de WhatsApp inválido']);
        exit;
    }

    // Validar formato do CEP
    if (!preg_match('/^\d{5}-\d{3}$/', $cep)) {
        echo json_encode(['success' => false, 'message' => 'Formato de CEP inválido']);
        exit;
    }

    // Preparar e executar a query
    $stmt = $pdo->prepare('
        INSERT INTO orders (
            name, delivery_date, delivery_type, delivery_note, cep, street, number, 
            neighborhood, city, state, whatsapp, flavor, price, group_code, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    ');
    $stmt->execute([
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
    ]);

    echo json_encode(['success' => true, 'message' => 'Pedido salvo com sucesso']);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Erro ao salvar o pedido: ' . $e->getMessage()]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Erro inesperado: ' . $e->getMessage()]);
}
?>
