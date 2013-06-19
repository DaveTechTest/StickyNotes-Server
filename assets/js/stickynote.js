/** 
 * A sticky note object based on one of the webkit samples
 * and highly re-factored to use mysql backed instead of Web SQL 
 * Other additions includes note's background color.
 * 
 * Addition and re-factoring: Davis Desormeaux
 * License: WebKit is open source software with portions licensed under the LGPL and BSD licenses. 
 *
 **/

var noteColor = "#FFF046";

var captured = null,
    highestZ = 0,
    highestId = 0,
    currentUser = "";

function postData(uri, message) {
  $.ajax({
    type: "POST",
    url: uri,
    dataType: "json",
    data: message, // message to send
    success: function (data) { /* var obj = $.parseJSON(data); */ }
  });
}

function getData(uri) {
  var returnVal = false;
  $.ajax({
    type: "GET",
    url: uri, /* + 'cache/'+  Math.floor(Math.random() * 99999), */
    success: function(data) {
      returnVal = data;
    }, error : function() {
      returnVal = false; 
    }, 
    async:false
  });
  return returnVal;
  
}

function Note() {
  
  var self = this;

  var note = document.createElement('div');

  $(note).css('background-color', noteColor);
  
  note.className = 'note';
  note.addEventListener('mousedown', function(e) { return self.onMouseDown(e) }, false);
  note.addEventListener('click', function() { return self.onNoteClick() }, false);
  this.note = note;

  var close = document.createElement('div');
  close.className = 'closebutton';
  close.addEventListener('click', function(event) { return self.close(event) }, false);
  note.appendChild(close);
  
  var edit = document.createElement('div');
  edit.className = 'edit';
  edit.setAttribute('contenteditable', true);
  edit.addEventListener('keyup', function() { return self.onKeyUp() }, false);
  note.appendChild(edit);
  this.editField = edit;
  
  var ts = document.createElement('div');
  ts.className = 'timestamp';
  ts.addEventListener('mousedown', function(e) { return self.onMouseDown(e) }, false);
  note.appendChild(ts);
  this.lastModified = ts;

  
  document.body.appendChild(note);
  
  return this;
}

Note.prototype = {
 
  get id() {
    if (!("_id" in this)) this._id = 0;
    return this._id;
  },

  set id(x) {
    this._id = x;
  },

  get text() {
    return this.editField.innerHTML;
  },

  set text(x) {
    this.editField.innerHTML = x;
  },

  get timestamp() {
    if (!("_timestamp" in this)) this._timestamp = 0;
    return this._timestamp;
  },

  set timestamp(x) {
    if (this._timestamp == x) return;
    this._timestamp = x;
    var date = new Date();
    date.setTime(parseFloat(x));
    this.lastModified.textContent = modifiedString(date);
  },

  getLeft: function() {
    return this.note.style.left;
  },

  setLeft: function(x) {
    this.note.style.left = x;
  },

  getTop: function() {
    return this.note.style.top;
  },

  setTop: function(x) {
    this.note.style.top = x;
  },

  get zIndex() {
    return this.note.style.zIndex;
  },

  set zIndex(x) {
    this.note.style.zIndex = x;
  },
    
  close: function(event) {
    this.cancelPendingSave();
    var note = this;
    var noteId = parseInt(note.id);
    postData('delete-note/'+ noteId, false);
    var duration = .25
    var self = this;
    setTimeout(function() { document.body.removeChild(self.note) }, duration * 1000);
  },

  saveSoon: function() {
    this.cancelPendingSave();
    var self = this;
    this._saveTimer = setTimeout(function() { self.save() }, 200);
  },

  cancelPendingSave: function() {
    if (!("_saveTimer" in this)) return;
    clearTimeout(this._saveTimer);
    delete this._saveTimer;
  },

  save: function() {
    this.cancelPendingSave();

    if ("dirty" in this) {
      this.timestamp = new Date().getTime();
      delete this.dirty;
    }

    var note = this;
    newNote.timestamp = note.timestamp;
    var noteToSave = { id: note.id, username: note.username, color: note.color, left: note.left, top: note.top, zIndex: note.zIndex, text: note.text, timestamp: note.timestamp };
    postData('save-note/'+ note.id, noteToSave);

  },

  saveAsNew: function() {
    this.timestamp = new Date().getTime();
    var note = this;
    var noteToSave = { id: note.id, username: note.username, color: note.color, left: note.left, top: note.top, zIndex: note.zIndex, text: '', timestamp: note.timestamp };
    // db.save(note.id, noteToSave);
    $(note.note).data('noteid', note.id);
    postData('save-note/', noteToSave);
  },

  onMouseDown: function(e) {
    captured = this;
    this.startX = e.clientX - this.note.offsetLeft;
    this.startY = e.clientY - this.note.offsetTop;
    this.zIndex = ++highestZ;

    var self = this;
    if (!("mouseMoveHandler" in this)) {
      this.mouseMoveHandler = function(e) { return self.onMouseMove(e) }
      this.mouseUpHandler = function(e) { return self.onMouseUp(e) }
    }

    document.addEventListener('mousemove', this.mouseMoveHandler, true);
    document.addEventListener('mouseup', this.mouseUpHandler, true);

    return false;
  },

  onMouseMove: function(e) {
    if (this != captured) return true;

    this.left = e.clientX - this.startX + 'px';
    this.top = e.clientY - this.startY + 'px';

    this.setLeft(this.left);
    this.setTop(this.top);
    return false;
      
  },

  onMouseUp: function(e) {
    document.removeEventListener('mousemove', this.mouseMoveHandler, true);
    document.removeEventListener('mouseup', this.mouseUpHandler, true);

    this.save();
    return false;
  },

  onNoteClick: function(e) {
    this.editField.focus();
    getSelection().collapseToEnd();
  },

  onKeyUp: function() {
    this.dirty = true;
    this.saveSoon();
  },
}

/**
 * Fetch notes assigned to username
 */
function loadNotes() {
  
  var noteArr = getData('read-note/');
  if(noteArr != false && noteArr != "") noteArr = JSON.parse(noteArr); 
  for (var i=0; i<noteArr.length; i++) {
    var note = new Note();
    note.id = noteArr[i]['noteid'];
    note.text = noteArr[i]['text'];
    note.timestamp = noteArr[i]['timestamp'];
    note.left = noteArr[i]['left'];
    note.top = noteArr[i]['top'];
    note.zIndex = noteArr[i]['zIndex'];
    note.color = noteArr[i]['color'];
    note.setLeft(note.left);
    note.setTop(note.top);
    $(note.note).css('background-color', note.color);
    $(note.note).data('noteid', note.id);
    if (note.id > highestId) highestId = note.id;
    if (note.zIndex > highestZ) highestZ = note.zIndex;		
  }
}


/**
 * Updates notes if another currently logged-in user add/remove or change a note
 */
function updateNotes() {
  
  var noteArr = getData('read-note/');
  if(noteArr != false && noteArr != "") noteArr = JSON.parse(noteArr); 
  var idArr = [];
  for (var i=0; i<noteArr.length; i++) {
    var found = false;
    var noteId = noteArr[i]['noteid'];
    idArr.push(noteId);
    $('.note').each(function(index) {
      var existingId = $(this).data('noteid');
      if(existingId == noteId) {
        console.log("Updating note");
        found = true;
        // Existing Note
        var existingNote = $(this).find('.edit');
        try {
          // Try to check if this is the element be-eing edited
          var hoverElement;
          $('*').live('mouseenter', function() { hoverElement = this});
          if (hoverElement != existingNote) {
            existingNote.html(noteArr[i]['text']);
          }
        } catch(e) {/* Not inside a text box */}
        
        $(this).css('background-color', noteArr[i]['color']);
        $(this).css('left', noteArr[i]['left']);
        $(this).css('top', noteArr[i]['top']);        
        $(this).css('zIndex', noteArr[i]['zIndex']); 
        $(this).data('noteid', noteId);          
      }
    });

    if(found == false) {
      // New note
      console.log("New Note!");
      var note = new Note();
      note.text = noteArr[i]['text'];
      note.timestamp = noteArr[i]['timestamp'];
      note.left = noteArr[i]['left'];
      note.top = noteArr[i]['top'];
      note.zIndex = noteArr[i]['zIndex'];
      note.color = noteArr[i]['color'];
      note.setLeft(note.left);
      note.setTop(note.top);
      $(note.note).css('background-color', note.color);
      $(note.note).data('noteid', noteId);
      console.log(">>> New note id:" +noteId);
    }
    if (noteArr[i]['zIndex'] > highestZ) highestZ = noteArr[i]['zIndex'];    
    if (noteArr[i]['noteid']> highestId) highestId = noteArr[i]['noteid'];
  }

  // Check for removed Note
  $('.note').each(function(index) {
    if($.inArray($(this).data('noteid'), idArr) == -1) {
      // Found a note that was deleted
      $(this).remove();
      return false;
    }
  });
}

function modifiedString(date) {
  return 'Last Modified: ' + date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
}

function newNote() {
  var note = new Note();
  note.id = ++highestId;
  note.timestamp = new Date().getTime();
  note.left = Math.round(Math.random() * 400) + 'px';
  note.top = Math.round(Math.random() * 500) + 'px';
  note.zIndex = ++highestZ;
  note.username = 'unused';
  note.color = noteColor;
  note.saveAsNew();
}
