<?php
header('Content-Type: application/json');
$pdo = new PDO('mysql:host=localhost;dbname=task_management', 'root', ''); // Adjust DB credentials
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// Handle different HTTP methods
switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        handleGetRequest($pdo);
        break;
    case 'POST':
        handlePostRequest($pdo);
        break;
    case 'PUT':
        handlePutRequest($pdo);
        break;
    case 'DELETE':
        handleDeleteRequest($pdo);
        break;
}

function handleGetRequest($pdo) {
    // Check if 'id' parameter is provided in the query string
    $id = isset($_GET['id']) ? intval($_GET['id']) : null;

    if ($id) {
        // Fetch a single task by ID
        $stmt = $pdo->prepare("SELECT * FROM tasks WHERE id = ?");
        $stmt->execute([$id]);
        $task = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($task) {
            echo json_encode($task);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Task not found']);
        }
    } else {
        // Fetch all tasks if no ID is provided
        $stmt = $pdo->query("SELECT * FROM tasks");
        $tasks = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($tasks);
    }
}

function handlePostRequest($pdo) {
    $data = json_decode(file_get_contents('php://input'), true);
    $stmt = $pdo->prepare("INSERT INTO tasks (name, description, due_date) VALUES (?, ?, ?)");
    $stmt->execute([$data['name'], $data['description'], $data['due_date']]);
    echo json_encode(['message' => 'Task added successfully']);
}

function handlePutRequest($pdo) {
    $data = json_decode(file_get_contents('php://input'), true);
    $stmt = $pdo->prepare("UPDATE tasks SET name = ?, description = ?, due_date = ?, status = ? WHERE id = ?");
    $stmt->execute([$data['name'], $data['description'], $data['due_date'], $data['status'], $data['id']]);
    echo json_encode(['message' => 'Task updated successfully']);
}

function handleDeleteRequest($pdo) {
    $data = json_decode(file_get_contents('php://input'), true);
    $stmt = $pdo->prepare("DELETE FROM tasks WHERE id = ?");
    $stmt->execute([$data['id']]);
    echo json_encode(['message' => 'Task deleted successfully']);
}
