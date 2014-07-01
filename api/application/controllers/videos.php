<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

require_once( APPPATH . 'libraries/REST_Controller.php');

class Videos extends REST_Controller {
	/**
	 * @return list of videos
	 */
	public function index_get() {
		$this->load->database();
		$query = $this->db->query("SELECT id, name, file FROM videos");
		if(!$query) {
			echo '{"error": "Error selecting list of videos."}';
			return;
		}

		header('Access-Control-Allow-Origin: *');
		
		echo json_encode($query->result());
	}
}

/* End of file videos.php */
/* Location: ./application/controllers/videos.php */