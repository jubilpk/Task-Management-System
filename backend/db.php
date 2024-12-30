<?php
// Database connection settings
$host = 'localhost';
$dbname = 'task_management'; // The name of the database
$username = 'root';  // Default MySQL username in XAMPP
$password = '';  // Default password is empty in XAMPP

try {
    // Create the PDO instance for the database connection
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    // If the connection fails, show an error message
    echo "Connection failed: " . $e->getMessage();
    exit();
}
?>
