<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Experiment_editor extends CI_Controller {

	public function index() {
		$data['title'] = 'Virtuelt Laboratorium Manager - Forsøg Editor';
		
		$data = $this->get_editor_data($data);
		
		loadview($this, 'experiment_editor', $data);
	}
	
	public function update($experiment_id) {
		$data['title'] = 'Virtuelt Laboratorium Manager - Forsøg Editor';
		
		$data['experiment_id'] = $experiment_id;
		$data['page_variables'] = array('experiment_id' => $experiment_id);
		//We let javascript fetch and prefill the experiment
		
		$data = $this->get_editor_data($data);
		
		loadview($this, 'experiment_editor', $data);
	}
	
	private function get_editor_data($data) {
		$this->load->helper('restclient');
		
		$instruments = get('instruments');
		if($instruments == NULL) {
			$instruments = array();
		}
		$data['instruments'] = $instruments;
		
		$actions = get('actions');
		if($actions == NULL) {
			$actions = array();
		}
		$data['actions'] = $actions;
		
		$elements = get('elements');
		if($elements == NULL) {
			$elements = array();
		}
		$data['elements'] = $elements;

		$videos = get('videos');
		if($videos == NULL) {
			$videos = array();
		}
		$data['videos'] = $videos;
		
		return $data;
	}
}

/* End of file experiment_editor.php */
/* Location: ./application/controllers/experiment_editor.php */