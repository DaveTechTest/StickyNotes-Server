<?php

class Note {

  /**
   * Get all notes
   */
  public function getNote($id) {
    global $db;
    if(!isset($id) || $id == 0) {
      // Get all notes
      $sql   = "SELECT * FROM notes";
      $rows  = mysql_query($sql);
      $notes = array();
      while ($row = mysql_fetch_assoc($rows)) {
        $row['top']       = $row['toppos'];
        $row['left']      = $row['leftpos'];
        $row['text']      = $row['textnote'];
        $row['timestamp'] = $row['timenote'];        
        unset($row['toppos']);
        unset($row['leftpos']);        
        unset($row['textnote']);
        unset($row['timenote']);
        $notes[] = $row;
      }
      header('Content-Type: text/javascript; charset=utf8');
      echo json_encode($notes);      
      mysql_free_result($rows);
      mysql_close($db);
    }
  }
  
  /**
   * Save/Update a note
   */
  public function save($data, $newNote) {
    global $db;
    $sql        = "";
    $_id        = intval($data['id']);
    $_top       = mysql_real_escape_string($data['top']);
    $_left      = mysql_real_escape_string($data['left']);
    $_text      = mysql_real_escape_string($data['text']);   
    $_color     = mysql_real_escape_string($data['color']);
    $_zIndex    = intval($data['zIndex']);
    $_username  = isset($data['username']) ? mysql_real_escape_string($data['username']) : 'unused';
  
    if ($newNote) {
      // Note is not present in the database
      $sql = "INSERT INTO   sticky_note.notes (noteid, username, color, 
                            leftpos, toppos, zIndex, textnote, timenote) 
                   VALUES   ($_id, '$_username', '$_color', '$_left', '$_top', 
                              $_zIndex, '$_text', UNIX_TIMESTAMP());";
                
    } else {
      // Update an existing note
      $sql = "UPDATE   sticky_note.notes 
                 SET   username = '$_username', color = '$_color', leftpos = '$_left',
                       toppos = '$_top', zIndex = $_zIndex, textnote = '$_text', timenote = UNIX_TIMESTAMP( )
               WHERE   noteid = $_id";
    }
    
    mysql_query($sql);
    mysql_close($db);
    //print_r($data);
  }
  
  /**
   * Delete a note by id
   */
  public function delete($noteId) {
    global $db;
    $noteId = intval($noteId);
    $sql = "DELETE FROM   sticky_note.notes
                  WHERE   noteid = $noteId";
    mysql_query($sql);
    mysql_close($db);
  }
  
}
