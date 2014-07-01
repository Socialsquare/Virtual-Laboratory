<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

require_once( APPPATH . 'libraries/REST_Controller.php');

/**
 * POST for creation, ie the uri intented for the related GET operation does not exist yet
 * PUT for updates, ie a resource is returned with the GET operation
 */
class Actions extends REST_Controller {
	/**
	 * @return list of instruments
	 */
	public function index_get() {
		$this->load->database();
		$query = $this->db->query("SELECT id,name FROM actions");
		if(!$query) {
			echo '{"error": "Error selecting list of actions."}';
			return;
		}
		echo json_encode($query->result());
	}
}

/* End of file actions.php */
/* Location: ./application/controllers/actions.php */