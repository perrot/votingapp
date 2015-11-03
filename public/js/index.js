var count=3;
function addOption(){
  $( '<input type="text" name="option'+count+'" class="form-control" placeholder="New Option" style="width:40%;margin:auto" required>' ).appendTo( "#optionList" );
count++;
}
function go(link) {
  window.location.href=link;
  clear_bg();
  $(this).parent().css('background','lightgray');
console.log($(this).parent().css('background'));
}
function clear_bg() {
  $('#signup').attr('style', 'background:white');
  $('#home').attr('style', 'background:white');
  $('#login').attr('style', 'background:white');
  $('#voteplex').attr('style', 'background:white');
}
