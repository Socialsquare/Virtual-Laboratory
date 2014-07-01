<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

require_once( APPPATH . 'libraries/REST_Controller.php');

/**
 * POST for creation, ie the uri intented for the related GET operation does not exist yet
 * PUT for updates, ie a resource is returned with the GET operation
 */
class Experiments extends REST_Controller {

	public function index_get() {
		$this->load->database();
		$query = $this->db->query("SELECT id, title, description FROM experiments");
		if(!$query) {
			echo '{"error": "Error selecting experiments."}';
			return;
		}
		
		header('Access-Control-Allow-Origin: *');
		
		echo json_encode($query->result());
	}
	
	public function index_post() {		
		$title = $this->post('title', TRUE);
		$description = $this->post('description', TRUE);
		
		$this->load->database();
		
		$query = $this->db->query("SELECT id FROM experiments WHERE title=? LIMIT 1", array($title));
		if(!$query) {
			echo '{"error": "Error selecting experiment."}';
			return;
		}
		if($query->num_rows > 0) {
			echo '{"error": "An experiment with title \'' . $title . '\' already exists."}';
			return;
		}
		
		//Insert experiment and get new id
		$query = $this->db->query("INSERT INTO experiments(title,description) VALUES(?,?)", array($title, $description));
		if(!$query) {
			echo '{"error": "Error inserting experiment into database."}';
			return;
		}
		$query = $this->db->query("SELECT id FROM experiments WHERE title=? LIMIT 1", array($title));
		if(!$query) {
			echo '{"error": "Error selecting newly inserted experiment."}';
			return;
		}
		if($query->num_rows <= 0) {
			echo '{"error": "Something weird happened inserting experiment into database."}';
			return;
		}
		$experiment_id = $query->row()->id;
		
		//For each task insert task and assign has_task relationship
		
		$tasks = $this->post('tasks', TRUE);
		if(!$tasks) {
			echo '{"id": "' . $experiment_id . '"}';
			return;
		}
		
		foreach($tasks as $task) {
			$task_id = $this->create_task($task, $experiment_id);
			
			//For each task element assign has_input and has_output
			foreach($task['inputs'] as $input) {
				$query = $this->db->query("INSERT INTO has_inputs(task_id,element_id) VALUES(?,?)", array($task_id, $input));
				if(!$query) {
					echo '{"error": "Error inserting has_inputs relationship for task with id \'' . $task_id . '\' and input \'' . $input . '\'"}';
					return;
				}
			}
			unset($input);
			
			foreach($task['outputs'] as $output) {
				$query = $this->db->query("INSERT INTO has_outputs(task_id,element_id) VALUES(?,?)", array($task_id, $output));
				if(!$query) {
					echo '{"error": "Error inserting has_outputs relationship for task with id \'' . $task_id . '\' and output \'' . $output . '\'"}';
					return;
				}
			}
			unset($output);
		}
		unset($task);
		
		echo '{"id": "' . $experiment_id . '"}';
	}
	
	public function experiment_get($id) {
		$this->load->database();
		
		$query = $this->db->query("SELECT * FROM experiments WHERE id=? LIMIT 1", array($id));
		if(!$query) {
			echo '{"error": "Error selecting experiment with id \'' . $id . '\'."}';
			return;
		}
		$experiment = $query->row();
		
		//Select tasks
		$query = $this->db->query("SELECT tasks.id, tasks.description, tasks.instrument_id, tasks.action_id, tasks.video_id, tasks.question, tasks.answer1, tasks.answer1explanation, tasks.answer2, tasks.answer2explanation, tasks.answer3, tasks.answer3explanation, tasks.correct_answer FROM tasks, has_tasks WHERE has_tasks.experiment_id=? AND tasks.id=has_tasks.task_id", array($experiment->id));
		if(!$query) {
			echo '{"error": "Error selecting tasks for experiment with id \'' . $id . '\'."}';
			return;
		}
		$experiment->tasks = $query->result();
		
		//For each task select inputs and outputs
		foreach($experiment->tasks as $task) {
			$query = $this->db->query("SELECT elements.id, elements.name FROM elements, has_inputs WHERE has_inputs.task_id=? AND elements.id=has_inputs.element_id", array($task->id));
			if(!$query) {
				echo '{"error": "Error selecting inputs for task with id \'' . $task['id'] . '\'."}';
				return;
			}
			$task->inputs = $query->result();
			
			$query = $this->db->query("SELECT elements.id, elements.name FROM elements, has_outputs WHERE has_outputs.task_id=? AND elements.id=has_outputs.element_id", array($task->id));
			if(!$query) {
				echo '{"error": "Error selecting outputs for task with id \'' . $task['id'] . '\'."}';
				return;
			}
			$task->outputs = $query->result();
		}
		unset($task);

		header('Access-Control-Allow-Origin: *');
		
		echo json_encode($experiment);
	}
	
	public function experiment_put($id) {
		$title = $this->put('title', TRUE);
		$description = $this->put('description', TRUE);
		
		$this->load->database();
		
		$query = $this->db->query("UPDATE experiments SET title=?, description=? WHERE id=? LIMIT 1", array($title, $description, $id));
		if(!$query) {
			echo '{"error": "Error updating experiment with id \'' . $id . '\'."}';
			return;
		}
		
		//For each task insert task and assign has_task relationship
		$tasks = $this->put('tasks', TRUE);

		foreach($tasks as $task) {
			$task_description = $task['description'];
			$task_instrument = $task['instrument'];
			$task_action = $task['action'];
			$task_video = $task['video'];
			$task_question = $task['question'];
			$task_answer1 = $task['answer1'];
			$task_answer1explanation = $task['answer1explanation'];
			$task_answer2 = $task['answer2'];
			$task_answer2explanation = $task['answer2explanation'];
			$task_answer3 = $task['answer3'];
			$task_answer3explanation = $task['answer3explanation'];
			$task_correct_answer = $task['correct_answer'];
			
			if(isset($task['id'])) {
				$task_id = $task['id'];
				$query = $this->db->query("UPDATE tasks SET description=?, instrument_id=?, action_id=?,  video_id=?, question=?, answer1=?, answer1explanation=?, answer2=?, answer2explanation=?, answer3=?, answer3explanation=?, correct_answer=? WHERE id=? LIMIT 1", array($task_description, $task_instrument, $task_action, $task_video, $task_question, $task_answer1, $task_answer1explanation, $task_answer2, $task_answer2explanation, $task_answer3, $task_answer3explanation, $task_correct_answer, $task_id));
				if(!$query) {
					echo '{"error": "Error updating task with id \'' . $task_id . '\'."}';
					return;
				}
			}
			else {
				//A new task has been added
				$task_id = $this->create_task($task, $id);
			}
			
			//Delete all inputs for this task
			$query = $this->db->query("DELETE FROM has_inputs WHERE task_id=?", $task_id);
			if(!$query) {
				echo '{"error": "Error deleting has_inputs relationships for task with id \'' . $task_id . '\'"}';
				return;
			}
			
			//Insert inputs
			foreach($task['inputs'] as $input) {
				$query = $this->db->query("INSERT INTO has_inputs(task_id,element_id) VALUES(?,?)", array($task_id, $input));
				if(!$query) {
					echo '{"error": "Error inserting has_inputs relationship for task with id \'' . $task_id . '\' and input \'' . $input . '\'"}';
					return;
				}
			}
			unset($input);
			
			//Delete all outputs for this task
			$query = $this->db->query("DELETE FROM has_outputs WHERE task_id=?", $task_id);
			if(!$query) {
				echo '{"error": "Error deleting has_outputs relationships for task with id \'' . $task_id . '\'"}';
				return;
			}
			
			//Insert outputs
			foreach($task['outputs'] as $output) {
				$query = $this->db->query("INSERT INTO has_outputs(task_id,element_id) VALUES(?,?)", array($task_id, $output));
				if(!$query) {
					echo '{"error": "Error inserting has_outputs relationship for task with id \'' . $task_id . '\' and output \'' . $output . '\'"}';
					return;
				}
			}
			unset($output);
		}
		unset($task);
		
		echo '{"id": "' . $id . '"}';
	}

	public function experiment_delete($id) {
		$this->load->database();

		//Get task id's
		$query = $this->db->query("SELECT task_id FROM has_tasks WHERE experiment_id=?", array($id));

		//Remove tasks
		foreach ($query->result() as $task_id) {
			$query = $this->db->query('DELETE FROM tasks WHERE id=?', $task_id);
			if(!$query) {
				echo '{"error": "Error deleting task with id \'' . $task_id . '\'"}';
				return;
			}
		}
		unset($task_id);

		//Remove experiment-task relationships
		$query = $this->db->query("DELETE FROM has_tasks WHERE experiment_id=?", array($id));
		if(!$query) {
			echo '{"error": "Error deleting experiment-task relationship for experiment with id \'' . $id . '\'"}';
			return;
		}

		//Remove experiment
		$query = $this->db->query("DELETE FROM experiments WHERE id=?", array($id));
		if(!$query) {
			echo '{"error": "Error deleting experiment with id \'' . $id . '\'"}';
			return;
		}

		echo '{}';
	}
	
	private function create_task($task, $experiment_id) {
		$task_description = $task['description'];
		$task_instrument = $task['instrument'];
		$task_action = $task['action'];
		$task_video = $task['video'];
		$task_question = $task['question'];
		$task_answer1 = $task['answer1'];
		$task_answer1explanation = $task['answer1explanation'];
		$task_answer2 = $task['answer2'];
		$task_answer2explanation = $task['answer2explanation'];
		$task_answer3 = $task['answer3'];
		$task_answer3explanation = $task['answer3explanation'];
		$task_correct_answer = $task['correct_answer'];
		$creation_time = date('Y-m-d H:i:s');
		$query = $this->db->query("INSERT INTO tasks(description,instrument_id,action_id,video_id,question,answer1,answer1explanation,answer2,answer2explanation,answer3,answer3explanation,correct_answer,creation_time) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)", array($task_description, $task_instrument, $task_action, $task_video, $task_question, $task_answer1, $task_answer1explanation, $task_answer2, $task_answer2explanation, $task_answer3, $task_answer3explanation, $task_correct_answer, $creation_time));
		if(!$query) {
			echo '{"error": "Error inserting new task into database."}';
			return;
		}
		$query = $this->db->query("SELECT id FROM tasks WHERE description=? AND instrument_id=? AND action_id=? AND creation_time=? LIMIT 1", array($task_description, $task_instrument, $task_action, $creation_time));
		if(!$query) {
			echo '{"error": "Error selecting newly inserted task with instrument \'' . $task_instrument . '\' and action \'' . $task_action . '\'."}';
			return;
		}
		if($query->num_rows <= 0) {
			echo '{"error": "Something weird happened inserting task into database."}';
			return;
		}
		$task_id = $query->row()->id;
		$query = $this->db->query("INSERT INTO has_tasks(experiment_id,task_id) VALUES(?,?)", array($experiment_id, $task_id));
		if(!$query) {
			//!TODO: Look for orphan tasks once in a while
			echo '{"error": "Error inserting has_tasks relationship for experiment with id \'' . $experiment_id . '\' and task with id \'' . $task_id . '\'"}';
			return;
		}
		return $task_id;
	}
}

/* End of file experiments.php */
/* Location: ./application/controllers/experiments.php */