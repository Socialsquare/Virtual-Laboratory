<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

require_once( APPPATH . 'libraries/REST_Controller.php');

class Dna_elements extends REST_Controller {
	/**
	 * @return list of dna elements
	 */
	public function index_get() {
		$this->load->database();
		$query = $this->db->query("SELECT id,name,color,sequence,description,link,comment,type FROM dnaelements");
		if(!$query) {
			echo '{"error": "Error selecting list of dnaelements."}';
			return;
		}
		
		header('Access-Control-Allow-Origin: *');

		echo json_encode($query->result());
	}
}

/* End of file dna_elements.php */
/* Location: ./application/controllers/dna_elements.php */