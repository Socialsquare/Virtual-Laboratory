<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Dashboard extends CI_Controller {

	public function index() {
		$data['title'] = 'Virtuelt Laboratorium Manager - Dashboard';
		
		$this->load->helper('restclient');
		
		$experiments = get('experiments');
		if($experiments == NULL) {
			$experiments = array();
		}
		$data['experiments'] = $experiments;
		
		loadview($this, 'dashboard', $data);
	}
}

/* End of file dashboard.php */
/* Location: ./application/controllers/dashboard.php */