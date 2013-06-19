$(function() {  
  $(".basic").spectrum({ // Color picker event
      color: "#FFF046",
      change: function(color) { noteColor = color.toHexString(); }
  });

  $('#username').val(""); // FireFox fix
  $('.customSelect').customSelect();
  loadNotes();
});
