'use strict';

async function updateui() {
	let pattern = /@[^\/]*/;
	let username_array = window.location.href.match(pattern);
	
	if(username_array) {
        let username = username_array[0];
        let html     = '<div style="padding-top:1em; float:left; width:30%"><h4>Steem mate ['+username+']</h4></div>';
        $( '#content div div.App__content div.UserProfile div div.row:eq(1)' ).prepend( html );
	}
	
}

updateui();