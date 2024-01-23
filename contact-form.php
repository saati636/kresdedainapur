<?php

if(isset($_POST['email'])) {

    // Edit these two lines with your email address and the subject that you want to receive
    $email_to = 'kresdedcollege@gmail.com';
    $email_subject = "You've got an email from your website!";
	
	// - Do not edit below this line :)
    if(!isset($_POST['name']) ||
        !isset($_POST['email']) ||
        !isset($_POST['message'])) {
        die('');      
    }
     
    $name = $_POST['name']; 
    $email = $_POST['email'];
    $message = $_POST['message'];
     
    $email_message = "Form details below.\n\n";
     
    function clean_string($string) {
      $bad = array("content-type","bcc:","to:","cc:","href");
      return str_replace($bad,"",$string);
    }
     
    $email_message .= "Name: ".clean_string($name)."\n";
    $email_message .= "Email: ".clean_string($email)."\n";
    $email_message .= "Message: ".clean_string($message);
     
	$headers = 'From: '.$email."\r\n".
	'Reply-To: '.$email."\r\n" .
	'X-Mailer: PHP/' . phpversion();
	mail($email_to, $email_subject, $email_message, $headers); 
	
}

?>
