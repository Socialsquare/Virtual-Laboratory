<div class="container">
 <div class="row">
  <div class="col-md-12"><h1>Forsøgs Editor</h1></div>
 </div>
 <form id="experiment-editor-form" role="form">
  <div class="row">
   <div class="col-md-12">
    <fieldset>
     <div class="form-group">
      <label for="experiment-name">Forsøgs navn:</label><br />
      <input type="text" name="experiment-name" id="experiment-name" />
     </div>
    </fieldset>
   </div>
  </div>
  
  <div class="row">
   <div class="col-md-12">
    <fieldset>
     <div class="form-group">
      <label for="experiment-description">Beskrivelse:</label><br />
      <textarea name="experiment-description" id="experiment-description"></textarea>
     </div>
    </fieldset>
   </div>
  </div>
  
  <fieldset>
   <div class="row">
    <div class="col-md-12">
     <table class="table-bordered">
      <thead>
       <tr>
        <th></th>
        <th class="task" id="task-1-title">Opgave 1</th>
        <th class="task" id="task-2-title">Opgave 2</th>
        <th class="task" id="task-3-title">Opgave 3</th>
        <th class="task" id="task-4-title">Opgave 4</th>
        <th class="task" id="task-5-title">Opgave 5</th>
       </tr>
      </thead>
      <tbody>
       <tr>
        <th>Beskrivelse</th>
        <td><textarea name="task-1-description"></textarea></td>
        <td><textarea name="task-2-description"></textarea></td>
        <td><textarea name="task-3-description"></textarea></td>
        <td><textarea name="task-4-description"></textarea></td>
        <td><textarea name="task-5-description"></textarea></td>
       </tr>
       <tr>
        <th>Instrument/Udstyr</th>
        <td>
         <select name="task-1-instrument">
<?php
foreach($instruments as $instrument) {
	echo '<option value="' . $instrument['id'] . '">' . $instrument['name'] . '</option>';
}
unset($instrument);
?>
         </select>
        </td>
        <td>
         <select name="task-2-instrument">
<?php
foreach($instruments as $instrument) {
	echo '<option value="' . $instrument['id'] . '">' . $instrument['name'] . '</option>';
}
unset($instrument);
?>
         </select>
        </td>
        <td>
         <select name="task-3-instrument">
<?php
foreach($instruments as $instrument) {
	echo '<option value="' . $instrument['id'] . '">' . $instrument['name'] . '</option>';
}
unset($instrument);
?>
         </select>
        </td>
        <td>
         <select name="task-4-instrument">
<?php
foreach($instruments as $instrument) {
	echo '<option value="' . $instrument['id'] . '">' . $instrument['name'] . '</option>';
}
unset($instrument);
?>
         </select>
        </td>
        <td>
         <select name="task-5-instrument">
<?php
foreach($instruments as $instrument) {
	echo '<option value="' . $instrument['id'] . '">' . $instrument['name'] . '</option>';
}
unset($instrument);
?>
         </select>
        </td>
       </tr>
       <tr>
        <th>Actions</th>
        <td>
         <select name="task-1-action">
<?php
foreach($actions as $action) {
	echo '<option value="' . $action['id'] . '">' . $action['name'] . '</option>';
}
unset($action);
?>
         </select>
        </td>
        <td>
         <select name="task-2-action">
<?php
foreach($actions as $action) {
	echo '<option value="' . $action['id'] . '">' . $action['name'] . '</option>';
}
unset($action);
?>
         </select>
        </td>
        <td>
         <select name="task-3-action">
<?php
foreach($actions as $action) {
	echo '<option value="' . $action['id'] . '">' . $action['name'] . '</option>';
}
unset($action);
?>
         </select>
        </td>
        <td>
         <select name="task-4-action">
<?php
foreach($actions as $action) {
	echo '<option value="' . $action['id'] . '">' . $action['name'] . '</option>\n';
}
unset($action);
?>
         </select>
        </td>
        <td>
         <select name="task-5-action">
<?php
foreach($actions as $action) {
	echo '<option value="' . $action['id'] . '">' . $action['name'] . '</option>';
}
unset($action);
?>
         </select>
        </td>
       </tr>
       <tr>
        <th>Input</th>
        <td>
         <input type="hidden" name="task-1-inputs" value="" />
         <button class="btn btn-primary btn-xs input-add-btn" data-tasknum="1">Rediger</button>
         <ul>
         </ul>
        </td>
        <td>
         <input type="hidden" name="task-2-inputs" value="" />
         <button class="btn btn-primary btn-xs input-add-btn" data-tasknum="2">Rediger</button>
         <ul>
         </ul>
        </td>
        <td>
         <input type="hidden" name="task-3-inputs" value="" />
         <button class="btn btn-primary btn-xs input-add-btn" data-tasknum="3">Rediger</button>
         <ul>
         </ul>
        </td>
        <td>
         <input type="hidden" name="task-4-inputs" value="" />
         <button class="btn btn-primary btn-xs input-add-btn" data-tasknum="4">Rediger</button>
         <ul>
         </ul>
        </td>
        <td>
         <input type="hidden" name="task-5-inputs" value="" />
         <button class="btn btn-primary btn-xs input-add-btn" data-tasknum="5">Rediger</button>
         <ul>
         </ul>
        </td>
       </tr>
       <tr>
        <th>Output</th>
        <td>
         <input type="hidden" name="task-1-outputs" value="" />
         <button class="btn btn-primary btn-xs output-add-btn" data-tasknum="1">Rediger</button>
         <ul>
         </ul>
        </td>
        <td>
         <input type="hidden" name="task-2-outputs" value="" />
         <button class="btn btn-primary btn-xs output-add-btn" data-tasknum="2">Rediger</button>
         <ul>
         </ul>
        </td>
        <td>
         <input type="hidden" name="task-3-outputs" value="" />
         <button class="btn btn-primary btn-xs output-add-btn" data-tasknum="3">Rediger</button>
         <ul>
         </ul>
        </td>
        <td>
         <input type="hidden" name="task-4-outputs" value="" />
         <button class="btn btn-primary btn-xs output-add-btn" data-tasknum="4">Rediger</button>
         <ul>
         </ul>
        </td>
        <td>
         <input type="hidden" name="task-5-outputs" value="" />
         <button class="btn btn-primary btn-xs output-add-btn" data-tasknum="5">Rediger</button>
         <ul>
         </ul>
        </td>
       </tr>
       <tr>
        <th>Video</th>
        <td>
          <select name="task-1-video">
<?php
foreach($videos as $video) {
  echo '<option value="' . $video['id'] . '">' . $video['name'] . '</option>';
}
unset($video);
?>
          </select>
        </td>
        <td>
          <select name="task-2-video">
<?php
foreach($videos as $video) {
  echo '<option value="' . $video['id'] . '">' . $video['name'] . '</option>';
}
unset($video);
?>
          </select>
        </td>
        <td>
          <select name="task-3-video">
<?php
foreach($videos as $video) {
  echo '<option value="' . $video['id'] . '">' . $video['name'] . '</option>';
}
unset($video);
?>
          </select>
        </td>
        <td>
          <select name="task-4-video">
<?php
foreach($videos as $video) {
  echo '<option value="' . $video['id'] . '">' . $video['name'] . '</option>';
}
unset($video);
?>
          </select>
        </td>
        <td>
          <select name="task-5-video">
<?php
foreach($videos as $video) {
  echo '<option value="' . $video['id'] . '">' . $video['name'] . '</option>';
}
unset($video);
?>
          </select>
        </td>
       </tr>
       <tr>
        <th>Forkært output quiz</th>
        <td>
          <div id="task-1-quiz-container"></div>
          <button class="btn btn-primary btn-xs quiz-btn" data-tasknum="1">Rediger</button>
        </td>
        <td>
          <div id="task-2-quiz-container"></div>
          <button class="btn btn-primary btn-xs quiz-btn" data-tasknum="2">Rediger</button>
        </td>
        <td>
          <div id="task-3-quiz-container"></div>
          <button class="btn btn-primary btn-xs quiz-btn" data-tasknum="3">Rediger</button>
        </td>
        <td>
          <div id="task-4-quiz-container"></div>
          <button class="btn btn-primary btn-xs quiz-btn" data-tasknum="4">Rediger</button>
        </td>
        <td>
          <div id="task-5-quiz-container"></div>
          <button class="btn btn-primary btn-xs quiz-btn" data-tasknum="5">Rediger</button>
        </td>
       </tr>
      </tbody>
     </table>
    </div>
   </div>
   
   <div class="row">
    <div class="col-md-12">
     <table class="table-bordered">
      <thead>
       <tr>
        <th></th>
        <th class="task" id="task-6-title">Opgave 6</th>
        <th class="task" id="task-7-title">Opgave 7</th>
        <th class="task" id="task-8-title">Opgave 8</th>
        <th class="task" id="task-9-title">Opgave 9</th>
        <th class="task" id="task-10-title">Opgave 10</th>
       </tr>
      </thead>
      <tbody>
       <tr>
        <th>Beskrivelse</th>
        <td><textarea name="task-6-description"></textarea></td>
        <td><textarea name="task-7-description"></textarea></td>
        <td><textarea name="task-8-description"></textarea></td>
        <td><textarea name="task-9-description"></textarea></td>
        <td><textarea name="task-10-description"></textarea></td>
       </tr>
       <tr>
        <th>Instrument/Udstyr</th>
        <td>
         <select name="task-6-instrument">
<?php
foreach($instruments as $instrument) {
	echo '<option value="' . $instrument['id'] . '">' . $instrument['name'] . '</option>';
}
unset($instrument);
?>
         </select>
        </td>
        <td>
         <select name="task-7-instrument">
<?php
foreach($instruments as $instrument) {
	echo '<option value="' . $instrument['id'] . '">' . $instrument['name'] . '</option>';
}
unset($instrument);
?>
         </select>
        </td>
        <td>
         <select name="task-8-instrument">
<?php
foreach($instruments as $instrument) {
	echo '<option value="' . $instrument['id'] . '">' . $instrument['name'] . '</option>';
}
unset($instrument);
?>
         </select>
        </td>
        <td>
         <select name="task-9-instrument">
<?php
foreach($instruments as $instrument) {
	echo '<option value="' . $instrument['id'] . '">' . $instrument['name'] . '</option>';
}
unset($instrument);
?>
         </select>
        </td>
        <td>
         <select name="task-10-instrument">
<?php
foreach($instruments as $instrument) {
	echo '<option value="' . $instrument['id'] . '">' . $instrument['name'] . '</option>';
}
unset($instrument);
?>
         </select>
        </td>
       </tr>
       <tr>
        <th>Actions</th>
        <td>
         <select name="task-6-action">
<?php
foreach($actions as $action) {
	echo '<option value="' . $action['id'] . '">' . $action['name'] . '</option>';
}
unset($action);
?>
         </select>
        </td>
        <td>
         <select name="task-7-action">
<?php
foreach($actions as $action) {
	echo '<option value="' . $action['id'] . '">' . $action['name'] . '</option>';
}
unset($action);
?>
         </select>
        </td>
        <td>
         <select name="task-8-action">
<?php
foreach($actions as $action) {
	echo '<option value="' . $action['id'] . '">' . $action['name'] . '</option>';
}
unset($action);
?>
         </select>
        </td>
        <td>
         <select name="task-9-action">
<?php
foreach($actions as $action) {
	echo '<option value="' . $action['id'] . '">' . $action['name'] . '</option>';
}
unset($action);
?>
         </select>
        </td>
        <td>
         <select name="task-10-action">
<?php
foreach($actions as $action) {
	echo '<option value="' . $action['id'] . '">' . $action['name'] . '</option>';
}
unset($action);
?>
         </select>
        </td>
       </tr>
       <tr>
        <th>Input</th>
        <td>
         <input type="hidden" name="task-6-inputs" value="" />
         <button class="btn btn-primary btn-xs input-add-btn" data-tasknum="6">Rediger</button>
         <ul>
         </ul>
        </td>
        <td>
         <input type="hidden" name="task-7-inputs" value="" />
         <button class="btn btn-primary btn-xs input-add-btn" data-tasknum="7">Rediger</button>
         <ul>
         </ul>
        </td>
        <td>
         <input type="hidden" name="task-8-inputs" value="" />
         <button class="btn btn-primary btn-xs input-add-btn" data-tasknum="8">Rediger</button>
         <ul>
         </ul>
        </td>
        <td>
         <input type="hidden" name="task-9-inputs" value="" />
         <button class="btn btn-primary btn-xs input-add-btn" data-tasknum="9">Rediger</button>
         <ul>
         </ul>
        </td>
        <td>
         <input type="hidden" name="task-10-inputs" value="" />
         <button class="btn btn-primary btn-xs input-add-btn" data-tasknum="10">Rediger</button>
         <ul>
         </ul>
        </td>
       </tr>
       <tr>
        <th>Output</th>
        <td>
         <input type="hidden" name="task-6-outputs" value="" />
         <button class="btn btn-primary btn-xs output-add-btn" data-tasknum="6">Rediger</button>
         <ul>
         </ul>
        </td>
        <td>
         <input type="hidden" name="task-7-outputs" value="" />
         <button class="btn btn-primary btn-xs output-add-btn" data-tasknum="7">Rediger</button>
         <ul>
         </ul>
        </td>
        <td>
         <input type="hidden" name="task-8-outputs" value="" />
         <button class="btn btn-primary btn-xs output-add-btn" data-tasknum="8">Rediger</button>
         <ul>
         </ul>
        </td>
        <td>
         <input type="hidden" name="task-9-outputs" value="" />
         <button class="btn btn-primary btn-xs output-add-btn" data-tasknum="9">Rediger</button>
         <ul>
         </ul>
        </td>
        <td>
         <input type="hidden" name="task-10-outputs" value="" />
         <button class="btn btn-primary btn-xs output-add-btn" data-tasknum="10">Rediger</button>
         <ul>
         </ul>
        </td>
       </tr>
       <tr>
        <th>Video</th>
        <td>
          <select name="task-6-video">
<?php
foreach($videos as $video) {
  echo '<option value="' . $video['id'] . '">' . $video['name'] . '</option>';
}
unset($video);
?>
          </select>
        </td>
        <td>
          <select name="task-7-video">
<?php
foreach($videos as $video) {
  echo '<option value="' . $video['id'] . '">' . $video['name'] . '</option>';
}
unset($video);
?>
          </select>
        </td>
        <td>
          <select name="task-8-video">
<?php
foreach($videos as $video) {
  echo '<option value="' . $video['id'] . '">' . $video['name'] . '</option>';
}
unset($video);
?>
          </select>
        </td>
        <td>
          <select name="task-9-video">
<?php
foreach($videos as $video) {
  echo '<option value="' . $video['id'] . '">' . $video['name'] . '</option>';
}
unset($video);
?>
          </select>
        </td>
        <td>
          <select name="task-10-video">
<?php
foreach($videos as $video) {
  echo '<option value="' . $video['id'] . '">' . $video['name'] . '</option>';
}
unset($video);
?>
          </select>
        </td>
       </tr>
       <tr>
        <th>Forkært output quiz</th>
        <td>
          <div id="task-6-quiz-container"></div>
          <button class="btn btn-primary btn-xs quiz-btn" data-tasknum="6">Rediger</button>
        </td>
        <td>
          <div id="task-7-quiz-container"></div>
          <button class="btn btn-primary btn-xs quiz-btn" data-tasknum="7">Rediger</button>
        </td>
        <td>
          <div id="task-8-quiz-container"></div>
          <button class="btn btn-primary btn-xs quiz-btn" data-tasknum="8">Rediger</button>
        </td>
        <td>
          <div id="task-9-quiz-container"></div>
          <button class="btn btn-primary btn-xs quiz-btn" data-tasknum="9">Rediger</button>
        </td>
        <td>
          <div id="task-10-quiz-container"></div>
          <button class="btn btn-primary btn-xs quiz-btn" data-tasknum="10">Rediger</button>
        </td>
       </tr>
      </tbody>
     </table>
    </div>
   </div>
   
   <div class="row">
    <div class="col-md-1 col-md-offset-11">
<?php
if(isset($experiment_id)) {
?>
     <button type="button" class="btn btn-primary" id="experiment-editor-delete-btn">Slet</button>
     <button type="submit" class="btn btn-primary">Opdater</button>
<?php
}
else {
?>
     <button type="submit" class="btn btn-primary">Gem</button>
<?php
}
?>
    </div>
   </div>
  </fieldset>
 </form>
  
 <!-- INPUT POPUP -->
 <form>
  <fieldset>
   <div class="modal fade" id="input-modal" role="dialog">
    <div class="modal-dialog">
     <div class="modal-content">
      <div class="modal-header">
       <button type="button" class="close" data-dismiss="modal">&times;</button>
       <h4 class="modal-title">Vælg input elementer</h4>
      </div>
      <div class="modal-body">
<?php
foreach($elements as $element) {
	echo '<div class="checkbox"><label><input type="checkbox" class="input-checkbox" name="' . $element['id'] . '" /> ' . $element['name'] . '</label></div>';
}
unset($element);
?>
      </div>
      <div class="modal-footer">
       <button type="button" class="btn btn-primary input-modal-add-btn">Tilføj</button>
      </div>
     </div>
    </div>
   </div>
  </fieldset> 
 </form>
 
 <!-- OUTPUT POPUP -->
 <form>
  <fieldset>
   <div class="modal fade" id="output-modal" role="dialog">
    <div class="modal-dialog">
     <div class="modal-content">
      <div class="modal-header">
       <button type="button" class="close" data-dismiss="modal">&times;</button>
       <h4 class="modal-title">Vælg ouput elementer</h4>
      </div>
      <div class="modal-body">
<?php
foreach($elements as $element) {
	echo '<div class="checkbox"><label><input type="checkbox" class="output-checkbox" name="' . $element['id'] . '" /> ' . $element['name'] . '</label></div>';
}
unset($element);
?>
      </div>
      <div class="modal-footer">
       <button type="button" class="btn btn-primary output-modal-add-btn">Tilføj</button>
      </div>
     </div>
    </div>
   </div>
  </fieldset> 
 </form>

 <form>
  <div class="modal fade" id="quiz-modal" role="dialog">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">Quiz</h4>
        </div>
        <div class="modal-body">
          <fieldset>
            <div class="form-group">
              <label>Quiz status:</label>
              <label class="radio-inline"><input type="radio" name="quiz-status-radio" id="quiz-status-radio1" value="on" />Slået til</label>
              <label class="radio-inline"><input type="radio" name="quiz-status-radio" id="quiz-status-radio2" value="off" checked />Slået fra</label>
            </div>
          </fieldset>
          <fieldset id="quiz-fieldset" disabled>
            <div class="form-group">
              <label for="quiz-question">Spørgsmål</label>
              <input type="text" class="form-control" id="quiz-question" placeholder="Indtast spørgsmål" />
            </div>
            <div class="form-group">
              <label for="quiz-answer1">Svar 1</label>
              <input type="text" class="form-control" id="quiz-answer1" placeholder="Indtast svar" />
            </div>
            <div class="form-group">
              <label for="quiz-answer2">Svar 2</label>
              <input type="text" class="form-control" id="quiz-answer2" placeholder="Indtast svar" />
            </div>
            <div class="form-group">
              <label for="quiz-answer3">Svar 3</label>
              <input type="text" class="form-control" id="quiz-answer3" placeholder="Indtast svar" />
            </div>
            <div class="form-group">
              <label>Korrekt svar:</label>
              <select name="quiz-correct-answer" class="form-control">
                <option>1</option>
                <option>2</option>
                <option>3</option>
              </select>
            </div>
            <div class="form-group">
              <label for="quiz-answer1explanation">Svar 1 forklaring</label>
              <input type="text" class="form-control" id="quiz-answer1explanation" placeholder="Indtast forklaring" />
            </div>
            <div class="form-group">
              <label for="quiz-answer2explanation">Svar 2 forklaring</label>
              <input type="text" class="form-control" id="quiz-answer2explanation" placeholder="Indtast forklaring" />
            </div>
            <div class="form-group">
              <label for="quiz-answer3explanation">Svar 3 forklaring</label>
              <input type="text" class="form-control" id="quiz-answer3explanation" placeholder="Indtast forklaring" />
            </div>
          </fieldset>
          <fieldset>
            <button type="button" class="btn btn-primary save-btn">Gem</button>
          </fieldset>
        </div>
      </div>
    </div>
  </div>
 </form>
 
</div>