$(function() {  
  $(".basic").spectrum({ // Color picker event
      color: "#FFF046",
      change: function(color) { noteColor = color.toHexString(); }
  });

  $('#username').val(""); // FireFox fix
  $('.customSelect').customSelect();
  loadNotes(); // Load archived noted
  setInterval('updateNotes()', 5000) // Update notes (multi-user)
});
