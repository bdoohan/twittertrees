<?php

	if(isset($_POST['email'])) {
 
		$email_to = "email@address.com";
		$email_subject = "Form Email";
 
		$name = $_POST["name"]; // required
		$email_from = $_POST["email"]; // required
		$message = $_POST["message"]; // required
		$email_message = "Form details below.\n\n";
 
		function clean_string($string) {
			$bad = array("content-type","bcc:","to:","cc:","href");
			return str_replace($bad,"",$string);
		}
 
		$email_message .= "Name: ".clean_string($name)."\n";
		$email_message .= "Email: ".clean_string($email_from)."\n";
		$email_message .= "Message: ".clean_string($message)."\n";
 

		// create email headers
		$headers = 'From: '.$email_from."\r\n".
		'Reply-To: '.$email_from."\r\n" .
		'X-Mailer: PHP/' . phpversion();
		mail($email_to, $email_subject, $email_message, $headers);  
	}

?>
 
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="refresh" content="3;url=/contact.html">
	<title>Contact</title>
</head>
<body>
	Thanks! You will be redirected back in 3 seconds.
</body>
</html>