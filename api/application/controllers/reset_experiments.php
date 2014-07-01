<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Reset_experiments extends CI_Controller {

	public function index()	{
		//redirect('http://www.virtueltlaboratorium.dk');
		$this->reset_exp();
	}
	
	/**
	 * This should be outcommented, only for development tests
	 */
	function reset_exp() {
		$this->load->database();
		
		//!TODO: Consider using truncate instead
		
		$query = $this->db->query("DELETE FROM has_outputs");
		if(!$query) {
			echo '{"error": "Error deleting has_outputs relationships."}';
			return;
		}
		
		$query = $this->db->query("DELETE FROM has_inputs");
		if(!$query) {
			echo '{"error": "Error deleting has_inputs relationships."}';
			return;
		}
		
		$query = $this->db->query("DELETE FROM has_tasks");
		if(!$query) {
			echo '{"error": "Error deleting has_tasks relationships."}';
			return;
		}
		
		$query = $this->db->query("DELETE FROM tasks");
		if(!$query) {
			echo '{"error": "Error deleting tasks."}';
			return;
		}
		
		$query = $this->db->query("DELETE FROM experiments");
		if(!$query) {
			echo '{"error": "Error deleting experiments."}';
			return;
		}
		
		echo '{"message": "All experiments deleted."}';
	}
}

/* End of file reset_experiments.php */
/* Location: ./application/controllers/reset_experiments.php */