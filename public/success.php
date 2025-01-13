<?php

$paymentId = $_GET['payment_id'];
$status = $_GET['status'];
$payment = $_GET['payment_type'];
$order_id = $_GET['merchant_order_id'];


echo "Payment ID: $paymentId <br>";
echo "Status: $status <br>";
echo "Payment: $payment <br>";
echo "Order ID: $order_id <br>";
