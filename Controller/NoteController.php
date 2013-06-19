<?php

class SaveNote {

  function POST($noteId) {
    $note  = new Note();
    $isNew = (isset($noteId[1]) == false);
    $note->save($_POST, $isNew);
  }
  
  function GET() {
    /* Do Nothing, POST only request... */
  }
}

class ReadNote {
  
  function GET($noteId) {
    $noteId = isset($noteId[1]) ? $noteId[1] : false;
    $note = new Note();
    $note->getNote($noteId);
  }
}

class DeleteNote {
  
  function POST($noteId) {
    $note = new Note();
    $note->delete($noteId[1]);
  }
  
  function GET() {
    /* Do Nothing, POST only request... */
  }
}
