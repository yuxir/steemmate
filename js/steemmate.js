'use strict';

/*
 * define fontawesome icons for different operations
 */
function operation_icons(operation) {
	// votes
	if(operation=='upvote')                         return '<i class="fa fa-thumbs-up"   style="color:green;"></i>';
	if(operation=='downvote')                       return '<i class="fa fa-thumbs-down" style="color:black;"></i>';
	
	// witness
	if(operation=='account_witness_vote')           return '<i class="fa fa-check"   style="color:green;"></i>';
	if(operation=='feed_publish')                   return '<i class="fa fa-usd"></i>';
	
	// rewards
	if(operation=='author_reward')                  return '<i class="fa fa-usd"></i>';
	if(operation=='curation_reward')                return '<i class="fa fa-usd"></i>';
	if(operation=='producer_reward')                return '<i class="fa fa-usd"></i>';
	if(operation=='comment_benefactor_reward')      return '<i class="fa fa-usd"></i>';
	if(operation=='claim_reward_balance')           return '<i class="fa fa-usd"></i>';
	
	// transfers
	if(operation=='transfer')                       return '<i class="fa fa-exchange"></i>';
	if(operation=='transfer_to_vesting')            return '<i class="fa fa-arrow-up"></i>';
	
	// delegates
	if(operation=='delegate_vesting_shares')        return '<i class="fa fa-users"></i>';
	
	// account operations
	if(operation=='account_create_with_delegation') return '<i class="fa fa-user"></i>';
	
	// comments
	if(operation=='comment')                        return '<i class="fa fa-file"></i>';
	if(operation=='delete_comment')                 return '<i class="fa fa-trash"></i>';
	if(operation=='reblog')                         return '<i class="fa fa-retweet"></i>';
	
	// follow
	if(operation=='follow')                         return '<i class="fa fa-user-plus"></i>';
	if(operation=='unfollow')                       return '<i class="fa fa-user-minus"></i>';
	
    return '';
}

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