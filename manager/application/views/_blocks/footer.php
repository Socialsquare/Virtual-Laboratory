  <script src="http://code.jquery.com/jquery.js"></script>
  <script src="<?php echo site_url('assets/js/bootstrap.min.js'); ?>"></script>
  <script src="<?php echo site_url('assets/js/virtueltlaboratoriummanager.js'); ?>"></script>
  <script>
var phpVariables = {};
<?php
if(isset($page_variables)) {
	foreach($page_variables as $variable_name => $variable) {
?>
phpVariables.<?php echo $variable_name; ?> = '<?php echo $variable; ?>';
<?php
	}
	unset($variable_name);
	unset($variable);
}
?>
  </script>
<?php
if(isset($page_scripts)) {
	foreach($page_scripts as $script_url) {
?>
  <script src="<?php echo $script_url; ?>"></script>
<?php
	}
	unset($script_url);
}
?>
 </body>
</html>