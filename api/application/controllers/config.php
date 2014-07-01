<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

require_once( APPPATH . 'libraries/REST_Controller.php');

define('CONFIG_FILE_FOLDER', './uploads/config/');

/**
 * POST for creation, ie the uri intented for the related GET operation does not exist yet
 * PUT for updates, ie a resource is returned with the GET operation
 */
class Config extends REST_Controller {
	

	public function index_get() {
		redirect('welcome');
	}
	
	public function config_file_get() {
		$this->load->helper('file');
		
		$config_file_path = CONFIG_FILE_FOLDER . 'config.xml';
		
		header('Content-Type: application/xml');
		
		$file_info = get_file_info($config_file_path);
		
		header('Content-Length: ' . $file_info['size']);
			 
		$config_file = read_file($config_file_path);
		
		echo $config_file;
		exit;
	}
	
	public function config_file_post() {
		$config['upload_path'] = './' . CONFIG_FILE_FOLDER;
		$config['allowed_types'] = 'xml';
		$config['max_size']	= '5000'; //in KB
		$config['overwrite'] = TRUE;
		$config['file_name'] = 'config.xml';

		$this->load->library('upload', $config);
		
		header('Access-Control-Allow-Origin: *');
		
		if (!$this->upload->do_upload('config-file')) {
			echo '{"error": "' . $this->upload->display_errors() . '"}';
			return;
		}
		
		$this->load->database();

		$error = $this->clear_config();
		if($error != NULL) {
			echo '{"error": ' . json_encode($error) . '}';
			return;
		}
		
		$error = $this->parse_config_file();

		if($error == NULL) {
			$url = base_url() . 'config/config-file';
			echo '{"url": "' . $url . '"}';
		}
		else {
			echo '{"error": ' . json_encode($error) . '}';
		}
	}

	private function clear_config() {
		//Clear Scenes, Instruments, Actions and Elements
		$query = $this->db->query("TRUNCATE TABLE scenes");
		if(!$query) {
			return "Error truncating scenes table.";
		}

		$query = $this->db->query("TRUNCATE TABLE instruments");
		if(!$query) {
			return "Error truncating instruments table";
		}

		$query = $this->db->query("TRUNCATE TABLE actions");
		if(!$query) {
			return "Error truncating actions table";
		}

		$query = $this->db->query("TRUNCATE TABLE elements");
		if(!$query) {
			return "Error truncating elements table";
		}

		$query = $this->db->query("TRUNCATE TABLE videos");
		if(!$query) {
			return "Error truncating videos table";
		}

		$query = $this->db->query("TRUNCATE TABLE dnaelements");
		if(!$query) {
			return "Error truncating dnaelements table";
		}
		
		return NULL;
	}
	
	private function parse_config_file() {
		$config_file_path = CONFIG_FILE_FOLDER . 'config.xml';
		$parsed_xml = simplexml_load_file($config_file_path);
		if(!$parsed_xml) {
			return "Error parsing xml file.";
		}
		
		$this->parse_scenes($parsed_xml);
		
		$this->parse_instruments($parsed_xml);
		
		$this->parse_actions($parsed_xml);
		
		$this->parse_elements($parsed_xml);

		$this->parse_videos($parsed_xml);

		$this->parse_dna($parsed_xml);
	}
	
	private function parse_scenes($parsed_xml) {
		foreach($parsed_xml->scenes->scene as $scene) {
			//Check if scene already exists
			/*$query = $this->db->query("SELECT id FROM scenes WHERE id='?' LIMIT 1", array($scene->id));
			if(!$query) {
				return "Error selecting scene with id '" . $scene->id . "'.";
			}
			if($query->num_rows > 0) {
				$query = $this->db->query("UPDATE scenes SET name='?' WHERE id='?' LIMIT 1", array($scene->name, $scene->id));
				if(!$query) {
					return "Error updating scene with id '" . $scene->id . "' with name '" . $scene->name . "'.";
				}
			}
			else {*/
				$query = $this->db->query("INSERT INTO scenes(id, name) VALUES('?', '?')", array($scene->id, $scene->name));
				if(!$query) {
					return "Error inserting XML scene with id '" . $scene->id . "' and name '" . $scene->name . "' into database.";
				}
			//}
		}
		unset($scene);
	}
	
	private function parse_instruments($parsed_xml) {
		foreach($parsed_xml->instruments->instrument as $instrument) {
			//Check if instrument already exists
			/*$query = $this->db->query("SELECT id FROM instruments WHERE id='?' LIMIT 1", array($instrument->id));
			if(!$query) {
				return "Error selecting instrument with id '" . $instrument->id . "'.";
			}
			if($query->num_rows > 0) {
				$query = $this->db->query("UPDATE instruments SET name='?' WHERE id='?' LIMIT 1", array($instrument->name, $instrument->id));
				if(!$query) {
					return "Error updating instrument with id '" . $instrument->id . "' with name '" . $instrument->name . "'.";
				}
			}
			else {*/
				$query = $this->db->query("INSERT INTO instruments(id, name) VALUES('?', '?')", array($instrument->id, $instrument->name));
				if(!$query) {
					return "Error inserting XML instrument with id '" . $instrument->id . "' and name '" . $instrument->name . "' into database.";
				}
			//}
		}
		unset($instrument);
	}
	
	private function parse_actions($parsed_xml) {
		foreach($parsed_xml->actions->action as $action) {
			//Check if instrument already exists
			/*$query = $this->db->query("SELECT id FROM actions WHERE id='?' LIMIT 1", array($action->id));
			if(!$query) {
				return "Error selecting action with id '" . $action->id . "'.";
			}
			if($query->num_rows > 0) {
				$query = $this->db->query("UPDATE actions SET name='?' WHERE id='?' LIMIT 1", array($action->name, $action->id));
				if(!$query) {
					return "Error updating action with id '" . $action->id . "' with name '" . $action->name . "'.";
				}
			}
			else {*/
				$query = $this->db->query("INSERT INTO actions(id, name) VALUES('?', '?')", array($action->id, $action->name));
				if(!$query) {
					return "Error inserting XML action with id '" . $action->id . "' and name '" . $action->name . "' into database.";
				}
			//}
		}
		unset($action);
	}
	
	private function parse_elements($parsed_xml) {
		foreach($parsed_xml->elements->element as $element) {
			//Check if instrument already exists
			/*$query = $this->db->query("SELECT id FROM elements WHERE id='?' LIMIT 1", array($element->id));
			if(!$query) {
				return "Error selecting element with id '" . $element->id . "'.";
			}
			if($query->num_rows > 0) {
				$query = $this->db->query("UPDATE elements SET name='?' WHERE id='?' LIMIT 1", array($element->name, $element->id));
				if(!$query) {
					return "Error updating element with id '" . $element->id . "' with name '" . $element->name . "'.";
				}
			}
			else {*/
				$query = $this->db->query("INSERT INTO elements(id, name) VALUES('?', '?')", array($element->id, $element->name));
				if(!$query) {
					return "Error inserting XML element with id '" . $element->id . "' and name '" . $element->name . "' into database.";
				}
			//}
		}
		unset($element);
	}

	private function parse_videos($parsed_xml) {
		foreach ($parsed_xml->videos->video as $video) {
			//Check if dna element already exists
			$query = $this->db->query("INSERT INTO videos(id, name, file) VALUES('?', '?', '?')", array($video->id, $video->name, $video->file));
			if(!$query) {
				return "Error inserting XML element with name '" . $video->name . "' into database.";
			}
		}
	}

	private function parse_dna($parsed_xml) {
		foreach ($parsed_xml->dnaelements->dnaelement as $dna_element) {
			//Check if dna element already exists
			$query = $this->db->query("INSERT INTO dnaelements(id, name, color, sequence, description, link, comment, type) VALUES('?', '?', '?', '?', '?', '?', '?', '?')", array($dna_element->id, $dna_element->name, $dna_element->color, $dna_element->sequence, $dna_element->description, $dna_element->link, $dna_element->comment, $dna_element->type));
			if(!$query) {
				return "Error inserting XML element with id '" . $dna_element->id . "' and name '" . $dna_element->name . "' into database.";
			}
		}
	}
}

/* End of file welcome.php */
/* Location: ./application/controllers/welcome.php */