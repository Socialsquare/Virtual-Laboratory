/**
 * @author: Chris Hjorth, www.chrishjorth.com
 */

$(document).ready(function() {
	//Dashboard ready
	$('#upload-config-form').on('submit', handleConfigFileSubmit);
	
	//Editor ready
	if(phpVariables.experiment_id) {
		loadExperiment(phpVariables.experiment_id);
	}
	$('#experiment-editor-form').on('submit', handleExperimentEditorSubmit);
	$('body').on('click', '.input-add-btn', handleAddInput);
	$('body').on('click', '.output-add-btn', handleAddOutput);
	$('body').on('click', '.quiz-btn', handleQuiz);
	$('#experiment-editor-delete-btn').on('click', handleDeleteExperiment);

	//Unbind events registered in modals
	$('body').on('hide.bs.modal', '#input-modal', function(event) {
		$('body').off('click', '.input-modal-add-btn', addInputs);
	});
	$('body').on('hide.bs.modal', '#output-modal', function(event) {
		$('body').off('click', '.output-modal-add-btn', addOutputs);
	});
	$('body').on('hide.bs.modal', '#quiz-modal', function(event) {
		$('body').off('click', '#quiz-modal .modal-body input[type="radio"]', handleQuizRadio);
		$('body').off('click', '#quiz-modal .save-btn', handleQuizSave);
	});
});

/* !DASHBOARD */
function handleConfigFileSubmit(event) {
	event.preventDefault();
	var url = getBaseURL() + 'api/config/config-file';
	var file = $('#upload-config-form input[name="config-file"]').get(0).files[0];
	ajaxFileUpload(url, 'config-file', file, function(error, data) {
		if(error) {
			console.log('Error uploading config file. Error: ' + error);
			$('#upload-message').html('Error uploading configuration file.');
			return;
		}
		$('#upload-message').html('Configuration file uploaded successfully.');
	});
}

/* !EXPERIMENT EDITOR */

/**
 * @assertion: Each task has a TH with class .task assigned so that we can know the amount of tasks that are being submitted with the experiment.
 */
function handleExperimentEditorSubmit(event) {
	event.preventDefault();
	var $form = $(this);
	
	var tasks = [];
	var i;
	for(i = 0; i < $('.task').length; i++) {
		var taskNum = i + 1;
		var task = {
			id: $form.find('#task-' + taskNum + '-title').data('taskID'),
			description: $form.find('textarea[name="task-' + taskNum + '-description"]').val(),
			instrument: $form.find('select[name="task-' + taskNum + '-instrument"]').val(),
			action: $form.find('select[name="task-' + taskNum + '-action"]').val(),
			inputs: $form.find('input[name="task-' + taskNum + '-inputs"]').val().split(','),
			outputs: $form.find('input[name="task-' + taskNum + '-outputs"]').val().split(','),
			video: $form.find('select[name="task-' + taskNum + '-video"]').val(),
			question: null,
			answer1: null,
			answer1explanation: null,
			answer2: null,
			answer2explanation: null,
			answer3: null,
			answer3explanation: null,
			correct_answer: 0
		};

		if(!$('#task-' + taskNum + '-quiz-container').is(':empty')) {
			task.question = $('#task-' + taskNum + '-quiz-container input[name="task-' + taskNum + '-quiz-question"]').val();
			task.answer1 = $('#task-' + taskNum + '-quiz-container input[name="task-' + taskNum + '-quiz-answer1"]').val();
			task.answer2 = $('#task-' + taskNum + '-quiz-container input[name="task-' + taskNum + '-quiz-answer2"]').val();
			task.answer3 = $('#task-' + taskNum + '-quiz-container input[name="task-' + taskNum + '-quiz-answer3"]').val();
			task.correct_answer = parseInt($('#task-' + taskNum + '-quiz-container input[name="task-' + taskNum + '-quiz-correct-answer"]').val(), 10);
			task.answer1explanation = $('#task-' + taskNum + '-quiz-container input[name="task-' + taskNum + '-quiz-answer1explanation"]').val();
			task.answer2explanation = $('#task-' + taskNum + '-quiz-container input[name="task-' + taskNum + '-quiz-answer2explanation"]').val();
			task.answer3explanation = $('#task-' + taskNum + '-quiz-container input[name="task-' + taskNum + '-quiz-answer3explanation"]').val();
		}
		
		if(isTaskValid(task)) {
			tasks.push(task);
		}
	}
	
	var experiment = {
		title: $form.find('input[name="experiment-name"]').val(),
		description: $form.find('textarea[name="experiment-description"]').val(),
		tasks: tasks
	};

	console.log(experiment);

	if(phpVariables.experiment_id) {
		updateExperiment(phpVariables.experiment_id, experiment);
	}
	else {
		postExperiment(experiment);
	}
}

function isTaskValid(task) {
	if(task.description === '') {
		return false;
	}
	
	return true;
}

function postExperiment(experiment) {
	var url = getBaseURL() + 'api/experiments';
	$.ajax(url, {
		data: experiment,
		type: 'POST',
		dataType: 'json',
		success: function(data, textStatus, jqXHR) {
			if(data.id) {
				console.log('Experiment id: ' + data.id);
			}
			else if(data.error) {
				console.log('Error saving experiment: ' + data.error);
			}
			else {
				//This should not happen by assertion, it means the server is screwring something up
				console.log('Undefined error posting experiment.');
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Error posting experiment. Status: ' + textStatus + ' - ' + errorThrown);
		}
	});
}

function updateExperiment(experimentID, experiment) {
	var url = getBaseURL() + 'api/experiments/' + experimentID;
	$.ajax(url, {
		data: experiment,
		type: 'PUT',
		dataType: 'json',
		success: function(data, textStatus, jqXHR) {
			if(data.id) {
				console.log('Experiment id: ' + data.id);
			}
			else if(data.error) {
				console.log('Error updating experiment: ' + data.error);
			}
			else {
				//This should not happen by assertion, it means the server is screwring something up
				console.log('Undefined error putting experiment.');
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log(jqXHR);
			console.log('Error putting experiment. Status: ' + textStatus + ' - ' + errorThrown);
		}
	});
}

function handleAddInput(event) {
	event.preventDefault();
	$('.input-checkbox').attr('checked', false); //Clear input checkboxes
	
	//Setup checkboxes
	var inputs = $(this).parent().find('input[type="hidden"]').val().split(',');
	var i;
	for(i = 0; i < inputs.length; i++) {
		$('.input-checkbox[name="' + inputs[i] + '"]').prop('checked', true);
	}
	
	$('#input-modal').modal('show');
	
	$('body').on('click', '.input-modal-add-btn', this, addInputs);
}

function addInputs(event) {
	//Get checked inputs
	var checkedInputs = $('.input-checkbox:checked').map(function() {
		var $checkbox = $(this);
		var input = {
			name: $checkbox.parent().text(),
			id: $checkbox.attr('name')
		};
        return input;
    });
    
    var $triggerButton = $(event.data);
	populateInputs($triggerButton.data('tasknum'), checkedInputs);
	$('#input-modal').modal('hide');
}

function populateInputs(taskNum, inputsArray) {
	var html = '';
	var commaInputIDs = '';
	var i = 0;
	for(i = 0; i < inputsArray.length; i++) {
		html += '<li>' + inputsArray[i].name + '</li>';
		commaInputIDs += inputsArray[i].id + ',';
	}
	commaInputIDs = commaInputIDs.substring(0, commaInputIDs.length - 1); //Remove last comma
	var $hiddenInput = $('input[name="task-' + taskNum + '-inputs"]');
	$hiddenInput.val(commaInputIDs);
	$hiddenInput.parent().find('ul').html(html);
}

function handleAddOutput(event) {
	event.preventDefault();
	
	$('.input-checkbox').attr('checked', false); //Clear input checkboxes
	
	//Setup checkboxes
	var outputs = $(this).parent().find('input[type="hidden"]').val().split(',');
	var i;
	for(i = 0; i < outputs.length; i++) {
		$('.output-checkbox[name="' + outputs[i] + '"]').prop('checked', true);
	}
	
	$('#output-modal').modal('show');
	
	$('body').on('click', '.output-modal-add-btn', this, addOutputs);
}

function addOutputs(event) {
	//Get checked inputs
	var checkedOutputs = $('.output-checkbox:checked').map(function() {
		var $checkbox = $(this);
		var input = {
			name: $checkbox.parent().text(),
			id: $checkbox.attr('name')
		};
        return input;
    });
    
    var $triggerButton = $(event.data);
	populateOutputs($triggerButton.data('tasknum'), checkedOutputs);
	$('#output-modal').modal('hide');
}

function populateOutputs(taskNum, outputsArray) {
	var html = '';
	var commaOutputIDs = '';
	var i = 0;
	for(i = 0; i < outputsArray.length; i++) {
		html += '<li>' + outputsArray[i].name + '</li>';
		commaOutputIDs += outputsArray[i].id + ',';
	}
	commaOutputIDs = commaOutputIDs.substring(0, commaOutputIDs.length - 1); //Remove last comma
	var $hiddenInput = $('input[name="task-' + taskNum + '-outputs"]');
	$hiddenInput.val(commaOutputIDs);
	$hiddenInput.parent().find('ul').html(html);
}

function handleQuiz(event) {
	event.preventDefault();

	$('#quiz-modal').modal('show');

	//Reset quiz fields based on task
	var taskNum = $(this).data('tasknum');
	if(!$('#task-' + taskNum + '-quiz-container').is(':empty')) {
		//Enable quiz and fill with data
		$('#quiz-modal input[name="quiz-status-radio"]:first').click();
		handleQuizRadio(null);
		$('#quiz-modal #quiz-question').val($('#task-' + taskNum + '-quiz-container input[name="task-' + taskNum + '-quiz-question"]').val());
		$('#quiz-modal #quiz-answer1').val($('#task-' + taskNum + '-quiz-container input[name="task-' + taskNum + '-quiz-answer1"]').val());
		$('#quiz-modal #quiz-answer2').val($('#task-' + taskNum + '-quiz-container input[name="task-' + taskNum + '-quiz-answer2"]').val());
		$('#quiz-modal #quiz-answer3').val($('#task-' + taskNum + '-quiz-container input[name="task-' + taskNum + '-quiz-answer3"]').val());
		$('#quiz-modal select[name="quiz-correct-answer"]').val($('#task-' + taskNum + '-quiz-container input[name="task-' + taskNum + '-quiz-correct-answer"]').val());
		$('#quiz-modal #quiz-answer1explanation').val($('#task-' + taskNum + '-quiz-container input[name="task-' + taskNum + '-quiz-answer1explanation"]').val());
		$('#quiz-modal #quiz-answer2explanation').val($('#task-' + taskNum + '-quiz-container input[name="task-' + taskNum + '-quiz-answer2explanation"]').val());
		$('#quiz-modal #quiz-answer3explanation').val($('#task-' + taskNum + '-quiz-container input[name="task-' + taskNum + '-quiz-answer3explanation"]').val());
	}
	else {
		//Clear data and disable quiz
		$('#quiz-modal #quiz-question').val('');
		$('#quiz-modal #quiz-answer1').val('');
		$('#quiz-modal #quiz-answer2').val('');
		$('#quiz-modal #quiz-answer3').val('');
		$('#quiz-modal select[name="quiz-correct-answer"]').val('1');
		$('#quiz-modal #quiz-answer1explanation').val('');
		$('#quiz-modal #quiz-answer2explanation').val('');
		$('#quiz-modal #quiz-answer3explanation').val('');
		$('#quiz-modal input[name="quiz-status-radio"]:last').click();
		handleQuizRadio(null);
	}

	$('body').on('click', '#quiz-modal .modal-body input[type="radio"]', handleQuizRadio);
	$('body').on('click', '#quiz-modal .save-btn', this, handleQuizSave);
}

function handleQuizRadio(event) {
	if($('#quiz-modal input[name="quiz-status-radio"]:checked').val() === 'on') {
		$('#quiz-fieldset').attr('disabled', false);
	}
	else {
		$('#quiz-fieldset').attr('disabled', true);
	}
}

function handleQuizSave(event) {
	var taskNum = $(event.data).data('tasknum');
	var quizContainer = $('#task-' + taskNum + '-quiz-container');
	quizContainer.empty();
	if($('#quiz-modal input[name="quiz-status-radio"]:checked').val() === 'on') {
		quizContainer.append('<input type="hidden" name="task-' + taskNum + '-quiz-question" value="' + $('#quiz-modal #quiz-question').val() + '" />');
		quizContainer.append('<input type="hidden" name="task-' + taskNum + '-quiz-answer1" value="' + $('#quiz-modal #quiz-answer1').val() + '" />');
		quizContainer.append('<input type="hidden" name="task-' + taskNum + '-quiz-answer2" value="' + $('#quiz-modal #quiz-answer2').val() + '" />');
		quizContainer.append('<input type="hidden" name="task-' + taskNum + '-quiz-answer3" value="' + $('#quiz-modal #quiz-answer3').val() + '" />');
		quizContainer.append('<input type="hidden" name="task-' + taskNum + '-quiz-correct-answer" value="' + $('#quiz-modal select[name="quiz-correct-answer"]').val() + '" />');
		quizContainer.append('<input type="hidden" name="task-' + taskNum + '-quiz-answer1explanation" value="' + $('#quiz-modal #quiz-answer1explanation').val() + '" />');
		quizContainer.append('<input type="hidden" name="task-' + taskNum + '-quiz-answer2explanation" value="' + $('#quiz-modal #quiz-answer2explanation').val() + '" />');
		quizContainer.append('<input type="hidden" name="task-' + taskNum + '-quiz-answer3explanation" value="' + $('#quiz-modal #quiz-answer3explanation').val() + '" />');
	}
	
	$('#quiz-modal').modal('hide');
}

function loadExperiment(experimentID) {
	var url = getBaseURL() + 'api/experiments/' + experimentID;
	$.ajax(url, {
		type: 'GET',
		dataType: 'json',
		success: function(data, textStatus, jqXHR) {
			var userErrorMessage = 'Der skete en fejl ved at hente data fra serveren.';
			if(data.error) {
				console.log('Error: ' + data.error);
				alert(userErrorMessage);
				return;
			}
			populateExperimentEditor(data);
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Error uploading file with AJAX POST: ' + textStatus + '. ' + errorThrown);
			alert(userErrorMessage);
		}
	});
}

function populateExperimentEditor(experiment) {
	var $form = $('#experiment-editor-form');
	$form.find('input[name="experiment-name"]').val(experiment.title);
	$form.find('textarea[name="experiment-description"]').val(experiment.description);
	var i;
	for(i = 0; i < experiment.tasks.length; i++) {
		var taskNum = i + 1;
		$form.find('#task-' + taskNum + '-title').data('taskID', experiment.tasks[i].id);
		$form.find('textarea[name="task-' + taskNum + '-description"]').val(experiment.tasks[i].description);
		$form.find('select[name="task-' + taskNum + '-instrument"]').val(experiment.tasks[i].instrument_id);
		$form.find('select[name="task-' + taskNum + '-action"]').val(experiment.tasks[i].action_id);
		$form.find('select[name="task-' + taskNum + '-video"]').val(experiment.tasks[i].video_id);
		if(experiment.tasks[i].question !== '' && experiment.tasks[i].question !== null) {
			var quizContainer = $form.find('#task-' + taskNum + '-quiz-container');
			quizContainer.append('<input type="hidden" name="task-' + taskNum + '-quiz-question" value="' + experiment.tasks[i].question + '" />');
			quizContainer.append('<input type="hidden" name="task-' + taskNum + '-quiz-answer1" value="' + experiment.tasks[i].answer1 + '" />');
			quizContainer.append('<input type="hidden" name="task-' + taskNum + '-quiz-answer2" value="' + experiment.tasks[i].answer2 + '" />');
			quizContainer.append('<input type="hidden" name="task-' + taskNum + '-quiz-answer3" value="' + experiment.tasks[i].answer3 + '" />');
			quizContainer.append('<input type="hidden" name="task-' + taskNum + '-quiz-correct-answer" value="' + experiment.tasks[i].correct_answer + '" />');
			quizContainer.append('<input type="hidden" name="task-' + taskNum + '-quiz-answer1explanation" value="' + experiment.tasks[i].answer1explanation + '" />');
			quizContainer.append('<input type="hidden" name="task-' + taskNum + '-quiz-answer2explanation" value="' + experiment.tasks[i].answer2explanation + '" />');
			quizContainer.append('<input type="hidden" name="task-' + taskNum + '-quiz-answer3explanation" value="' + experiment.tasks[i].answer3explanation + '" />');
		}
		populateInputs(taskNum, experiment.tasks[i].inputs);
		populateOutputs(taskNum, experiment.tasks[i].outputs);
	}
}

function handleDeleteExperiment() {
	if(!phpVariables.experiment_id) {
		console.log('Error: No experiment id');
		return;
	}

	var answer = confirm("Sikker på du vil slette dette experiment?");
	if(!answer) {
		return;
	}

	var experiment = {
		id: phpVariables.experiment_id
	};
	var url = getBaseURL() + 'api/experiments/' + phpVariables.experiment_id;
	$.ajax(url, {
		data: experiment,
		type: 'DELETE',
		dataType: 'json',
		success: function(data, textStatus, jqXHR) {
			location.href = getBaseURL() + 'manager/dashboard';
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log(jqXHR);
			console.log('Error deleting experiment. Status: ' + textStatus + ' - ' + errorThrown);
		}
	});
}

/* !UTILITIES */
function ajaxFileUpload(url, inputname, file, callback) {
	var formData = new FormData();
	formData.append(inputname, file);
	$.ajax(url, {
		type: 'POST',
		success: function(data, textStatus, jqXHR) {
			if(data.error) {
				callback(data.error);
				return;
			}
			callback(null, data);
		},
		error: function(jqXHR, textStatus, errorThrown) {
			var error = 'Error uploading file with AJAX POST: ' + textStatus + '. ' + errorThrown;
			callback(error);
		},
		data: formData,
		dataType: 'json',
		//Options to tell jQuery not to process data or worry about content-type.
		cache: false,
		contentType: false,
		processData: false
	});
}

/**
 * Expects a localhost to server mapping as follows for the web root:
 * localhost: http://localhost/~User/sitename/
 * server: http://sitename
 * where sitename does not necessarily need to be the same for the two. It is the depth of the paths that count.
 * @return the base url.
 */
function getBaseURL(subfolder) {
	subfolder = (typeof subfolder !== 'undefined') ? subfolder : '';
	var pathArray = window.location.pathname.split("/");
	var baseURL = window.location.protocol + "//" + window.location.host + "/";
	if(window.location.host == "localhost") {
		baseURL = baseURL + pathArray[1] + "/" + pathArray[2] + "/";
	}
	baseURL += subfolder;
	return baseURL;
}