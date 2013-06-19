$(function() {  
  $(".basic").spectrum({ // Color picker event
      color: "#FFF046",
      change: function(color) { noteColor = color.toHexString(); }
  });

  $('#username').val(""); // FireFox fix
  $('.customSelect').customSelect();
  loadNotes(); // Load archived noted
  try {
    setInterval('updateNotes()', 6000) // Update notes (multi-user)
  } catch (e) {/* Can't read/update DOM tree */}
});
