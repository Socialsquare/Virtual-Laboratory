<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
 * Simplifies loading views that are composed of the same blocks.
 * @author: Chris Hjorth, www.chrishjorth.com
 */
 
function loadview($controller, $view, $data) {
	$controller->load->view('_blocks/header', $data);
	$controller->load->view($view, $data);
	$controller->load->view('_blocks/footer', $data);
}

/* End of file viewloader_helper.php */
/* Location: ./application/helpers/viewloader_helper.php */