<?php
require_once('Controller/routes.php');
$urls = array(
    '/'                            => 'index',
    '/save-note'                   => 'PostNote',
    '/delete-note/(?P<number>\d+)' => 'DeleteNote'
);

class index {
  function GET($matches) {
    // This is the base page (background image with sticky notes...)
    require_once('View/index.html');
  }
}

glue::stick($urls);
