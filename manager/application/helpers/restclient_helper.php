<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
 * Simplifies cURL usage for working with REST APIs.
 * @author: Chris Hjorth, www.chrishjorth.com
 */
 
//define('API_URL', 'http://virtueltlaboratorium.site/api/');
define('API_URL', 'http://www.virtueltlaboratorium.dk/api/');
 
function get($resource) {
	$curl_handle = curl_init();
	curl_setopt($curl_handle, CURLOPT_URL, API_URL . $resource);
	curl_setopt($curl_handle, CURLOPT_RETURNTRANSFER, 1);
	$buffer = curl_exec($curl_handle);  
	curl_close($curl_handle);
	return json_decode($buffer, true);
}

/* End of file restclient_helper.php */
/* Location: ./application/helpers/restclient_helper.php */