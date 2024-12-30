<?php

// Your Turnstile Secret Key
$secretKey = '1x00000000000000000000AA';

// Check if the CAPTCHA token is provided
if (isset($_POST['cf-turnstile-response'])) {
    $token = $_POST['cf-turnstile-response'];

    // Get the user's IP address
    $userIP = $_SERVER['REMOTE_ADDR'];

    // Prepare data for POST request to Turnstile verification endpoint
    $data = [
        'secret' => $secretKey,
        'response' => $token,
        'remoteip' => $userIP
    ];

    // Make the request to the Turnstile API
    $url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
    $options = [
        'http' => [
            'method' => 'POST',
            'header' => 'Content-Type: application/x-www-form-urlencoded',
            'content' => http_build_query($data)
        ]
    ];

    // Use stream_context_create() to make the request
    $context = stream_context_create($options);
    $response = file_get_contents($url, false, $context);

    // Decode the JSON response from Cloudflare
    $responseData = json_decode($response, true);

    // Check if the CAPTCHA was successfully validated
    if ($responseData['success']) {
        // CAPTCHA validated successfully
        header('Location: success.html'); // Redirect to success page or different URL
            exit;
    } else {
        // CAPTCHA validation failed
        echo 'Error: CAPTCHA validation failed!';
    }
} else {
    // If no CAPTCHA response was submitted
    echo 'Error: CAPTCHA response missing!';
}

?>
