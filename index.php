<?php
header('Access-Control-Allow-Origin: *');
require_once('config.php');
require_once('Model/Note.php');
require_once('Controller/Routes.php');
require_once('Controller/NoteController.php');

$routes = array('/'                            => 'index',       // Main Page
                '/save-note'                   => 'SaveNote',    // Save a new Note
                '/save-note/(?P<number>\d+)'   => 'SaveNote',    // Save a existing Note
                '/read-note'                   => 'ReadNote',    // Read all notes
                '/delete-note/(?P<number>\d+)' => 'DeleteNote'); // Delete a note

glue::stick($routes);

class index {
  function GET() {
    // This is the base page (background image with sticky notes...)
    require_once('View/MainView.html');
  }
}
