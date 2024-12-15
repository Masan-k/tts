<?php
header('Content-Type: application/json');

// POSTデータを取得
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // フォームから送信されたデータを取得
    $text = isset($_POST['text']) ? $_POST['text'] : '';

    if (!empty($text)) {
        // 成功レスポンスを返す
        echo json_encode([
            'message' => 'Data received successfully',
            'receivedText' => $text
        ]);
    } else {
        // エラーレスポンスを返す
        http_response_code(400);
        echo json_encode([
            'error' => 'No text provided'
        ]);
    }
} else {
    // 他のリクエストには404を返す
    http_response_code(404);
    echo json_encode([
        'error' => 'Invalid request method'
    ]);
}
?>

