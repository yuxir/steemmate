'use strict';

async function updateui() {
  $( '#content div div.App__content div.UserProfile div div.row:eq(1)' ).prepend( '<div style="padding-top:1em; float:left; width:30%"><h4>Steem mate</h4></div>');
}

updateui();