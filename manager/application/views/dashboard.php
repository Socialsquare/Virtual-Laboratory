<div class="container">
  <div class="row">
    <div class="col-md-12"><h1>Virtuelt Laboratorium Dashboard</h1></div>
  </div>

  <div class="row">
    <div class="col-md-12"><h2>Config XML</h2></div>
  </div>
 
  <div class="row">
    <div class="col-md-12">Se config fil: <?php echo '<a href="' . site_url('../api/uploads/config/config.xml') . '">config.xml</a>'; ?></div>
  </div>

  <div class="row">
    <div class="col-md-12">
      <form id="upload-config-form">
        <fieldset>
          <div class="form-group">
            <label for="config-file-input">Upload XML fil: </label>
            <input type="file" name="config-file" id="config-file-input" />
            <div id="upload-message" class="help-block"></div>
          </div>
          <div class="form-group"><button type="submit" class="btn btn-default">Upload</button></div>
        </fieldset>
      </form>
    </div>
  </div>

  <div class="row">
    <div class="col-md-12"><h2>Forsøg</h2></div>
  </div>

  <div class="row">
    <div class="col-md-12"><?php echo '<a href="' . site_url('experiment_editor') . '" class="btn btn-primary">Nyt forsøg</a>'; ?></div>
  </div>

  <div class="row">
    <div class="col-md-12">
      <ul>
<?php
foreach($experiments as $experiment) {
?>
    <li><?php echo '<a href="' . site_url('experiment_editor/update/' . $experiment['id']) . '">' . $experiment['title'] . '</a>'; ?></li>
<?php
}
unset($experiment);
?>
      </ul>
    </div>
  </div>
</div>