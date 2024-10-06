<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Collect and sanitize form data
    $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);

    // Check if the email is valid
    if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
        // Recipient email address
        $to = 'amit3445078@gmail.com';
        $subject = 'New Subscription Request';
        $message = "New subscription request:\n\nEmail: $email";
        $headers = 'From: no-reply@ar-magic.com' . "\r\n" .
                   'Reply-To: no-reply@ar-magic.com' . "\r\n" .
                   'X-Mailer: PHP/' . phpversion();

        // Send email
        if (mail($to, $subject, $message, $headers)) {
            $successMessage = 'Subscription request sent successfully!';
        } else {
            $errorMessage = 'Failed to send subscription request.';
        }
    } else {
        $errorMessage = 'Invalid email address.';
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <title>Interactive Particles Text</title>
    <link rel="stylesheet" href="./style.css" />
    <style>
        .message {
            font-size: 1.4rem; /* Adjusted to fit your design */
            margin-bottom: 1rem;
            text-align: center;
        }
        .success {
            color: #57e6e6;
        }
        .error {
            color: #ff6f6f;
        }
    </style>
</head>
<body>
    <script type="x-shader/x-vertex" id="vertexshader">
      attribute float size;
      attribute vec3 customColor;
      varying vec3 vColor;

      void main() {
        vColor = customColor;
        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
        gl_PointSize = size * ( 300.0 / -mvPosition.z );
        gl_Position = projectionMatrix * mvPosition;
      }
    </script>
    <script type="x-shader/x-fragment" id="fragmentshader">
      uniform vec3 color;
      uniform sampler2D pointTexture;

      varying vec3 vColor;

      void main() {
        gl_FragColor = vec4( color * vColor, 1.0 );
        gl_FragColor = gl_FragColor * texture2D( pointTexture, gl_PointCoord );
      }
    </script>

    <div id="magic"></div>
    <div class="playground">
        <div class="bottomPosition">
            <?php if (isset($successMessage)): ?>
                <p class="message success"><?php echo htmlspecialchars($successMessage); ?></p>
            <?php elseif (isset($errorMessage)): ?>
                <p class="message error"><?php echo htmlspecialchars($errorMessage); ?></p>
            <?php endif; ?>
            <form action="index.php" method="post">
                <div class="webflow-style-input">
                    <input class="" type="email" name="email" placeholder="Join the waiting list" required />
                    <button type="submit">&rarr;</button>
                </div>
            </form>
        </div>
    </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r125/three.min.js"></script>
    <script src="./script.js"></script>
</body>
</html>