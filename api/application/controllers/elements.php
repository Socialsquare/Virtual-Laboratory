<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

require_once( APPPATH . 'libraries/REST_Controller.php');

class Elements extends REST_Controller {
	/**
	 * @return list of elements
	 */
	public function index_get() {
		$this->load->database();
		$query = $this->db->query("SELECT id,name FROM elements");
		if(!$query) {
			echo '{"error": "Error selecting list of elements."}';
			return;
		}
		echo json_encode($query->result());
	}
}

/* End of file elements.php */
/* Location: ./application/controllers/elements.php */