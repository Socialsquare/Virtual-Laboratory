<!DOCTYPE html>
<html>
 <head>
  <title><?php echo $title; ?></title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <!-- Bootstrap -->
  <link href="<?php echo site_url('assets/css/bootstrap.min.css'); ?>" rel="stylesheet" />
  <link href="<?php echo site_url('assets/css/bootstrap-theme.min.css'); ?>" rel="stylesheet" />
  
<?php
if(isset($page_styles)) {
	foreach($page_styles as $style_url) {
?>
  <link href="<?php echo $style_url; ?>" rel="stylesheet" />
<?php
	}
	unset($style_url);
}
?>
 </head>
 <body>