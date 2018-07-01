'use strict';

/*
 * define fontawesome icons for different operations
 */
function operation_icons(operation) {
	// votes
	if(operation=='upvote')                         return '<img class="operation_icon" src="'+chrome.extension.getURL("icons/thumbs-up.png")+'"/>';
	if(operation=='downvote')                       return '<img class="operation_icon" src="'+chrome.extension.getURL("icons/thumbs-down.png")+'"/>';
    if(operation=='unvote')                         return '<img class="operation_icon" src="'+chrome.extension.getURL("icons/cross.png")+'"/>';
	
	// witness
	if(operation=='account_witness_vote')           return '<i class="fa fa-check"   style="color:green;"></i>';
	if(operation=='feed_publish')                   return '<i class="fa fa-usd"></i>';
	
	// rewards
	if(operation=='author_reward')                  return '<img class="operation_icon" src="'+chrome.extension.getURL("icons/dollar.png")+'"/>';
	if(operation=='curation_reward')                return '<img class="operation_icon" src="'+chrome.extension.getURL("icons/dollar.png")+'"/>';
	if(operation=='producer_reward')                return '<img class="operation_icon" src="'+chrome.extension.getURL("icons/dollar.png")+'"/>';
	if(operation=='comment_benefactor_reward')      return '<img class="operation_icon" src="'+chrome.extension.getURL("icons/dollar.png")+'"/>';
	if(operation=='claim_reward_balance')           return '<img class="operation_icon" src="'+chrome.extension.getURL("icons/dollar.png")+'"/>';
	
	// transfers
	if(operation=='transfer')                       return '<img class="operation_icon" src="'+chrome.extension.getURL("icons/transfer.png")+'"/>';
	if(operation=='transfer_to_vesting')            return '<i class="fa fa-arrow-up"></i>';
	
	// delegates
	if(operation=='delegate_vesting_shares')        return '<i class="fa fa-users"></i>';
	
	// account operations
	if(operation=='account_create_with_delegation') return '<i class="fa fa-user"></i>';
	
	// comments
	if(operation=='post')                           return '<img class="operation_icon" src="'+chrome.extension.getURL("icons/post.png")+'"/>';
    if(operation=='comment')                        return '<img class="operation_icon" src="'+chrome.extension.getURL("icons/comment.png")+'"/>';
	if(operation=='delete_comment')                 return '<i class="fa fa-trash"></i>';
	if(operation=='reblog')                         return '<i class="fa fa-retweet"></i>';
	
	// follow
	if(operation=='follow')                         return '<img class="operation_icon" src="'+chrome.extension.getURL("icons/follow.png")+'"/>';
	if(operation=='unfollow')                       return '<img class="operation_icon" src="'+chrome.extension.getURL("icons/unfollow.png")+'"/>';
	
    return '';
}

/*
 * find numbers of latest record from user's account history
 */
async function find_last_record(user, numbers) {
  let result;

  try{
    result = await steem.api.getAccountHistoryAsync(user, Number.MAX_SAFE_INTEGER, numbers);
  }catch(e){
    console.log(e);
  }

  return result;
}

// based on operation, construct html output
function operation_html(operation) {
  if(operation[0]=='vote')                             return vote_html(operation[1]);

  // rewards
  if(operation[0]=='claim_reward_balance')             return claim_reward_balance_html(operation[1]);
  if(operation[0]=='curation_reward')                  return curation_reward_html(operation[1]);
  if(operation[0]=='author_reward')                    return author_reward_html(operation[1]);
  if(operation[0]=='comment_benefactor_reward')        return comment_benefactor_reward_html(operation[1]);

  // witness
  if(operation[0]=='feed_publish')                     return feed_publish_html(operation[1]);
  if(operation[0]=='account_witness_vote')             return account_witness_vote_html(operation[1]);
  if(operation[0]=='producer_reward')                  return producer_reward_html(operation[1]);
  
  // comments
  if(operation[0]=='comment')                          return comment_html(operation[1]);
  if(operation[0]=='delete_comment')                   return delete_comment_html(operation[1]);
  

  // transfers, power up, power down
  if(operation[0]=='transfer')                         return transfer_html(operation[1]);  
  if(operation[0]=='transfer_to_vesting')              return transfer_to_vesting_html(operation[1]);
  if(operation[0]=='withdraw_vesting')                 return withdraw_vesting_html(operation[1]);
  
  // delegation
  if(operation[0]=='delegate_vesting_shares')          return delegate_vesting_shares_html(operation[1]);
  
  // account creation with delegation
  if(operation[0]=='account_create_with_delegation')   return account_create_with_delegation_html(operation[1]);
  
  // custom_json
  if(operation[0]=='custom_json')                      return custom_json_html(operation[1]);
    
  return 'UNSUPPORTED operation: ' + operation[0] + ', please report to @yuxi';
}

/*
 * generate html for vote operations
 */
function vote_html(v) {
  let voter    = v['voter'];
  let author   = v['author'];
  let permlink = v['permlink'];
  let weight   = v['weight'];

  let oper = 'upvote';
  
  if(weight<0) {
    oper = 'downvote';
  }else if(weight==0) {
    oper = 'unvote';
  }

  let w = weight==0? '':'[' + weight / 100 + '%]';
  
  return operation_icons(oper) + ' ' + voter + ' ' + oper + ' ' + author + ' ' + w + ' @' + author + '/' + permlink ;
}

/*
 * generate html for claiming account balance operations
 */
function claim_reward_balance_html(c) {
  return operation_icons('claim_reward_balance') + ' ' + c['account'] + ' claiming ' + c['reward_steem'] + ', ' + c['reward_sbd'] + ', ' + c['reward_vests'];
}

/*
 * curation rewards
 */
function curation_reward_html(c) {
  return operation_icons('curation_reward') + ' ' + 'Curation reward: ' + c['reward'] + ' for @' +c['comment_author'] + '/' + c['comment_permlink']; 
}

/*
 * author's rewards
 */
function author_reward_html(a) {
  return operation_icons('author_reward') + ' ' + a['author'] + '\' author reward for ' + a['permlink'] + ': ' + a['sbd_payout'] + ', ' + a['steem_payout'] + ', ' + a['vesting_payout'];
}

/*
 * producer's rewards
 */
function producer_reward_html(p) {
  return operation_icons('producer_reward') + ' ' + 'Producer reward: ' + p['vesting_shares'];
}

function comment_benefactor_reward_html(c) {
  return operation_icons('comment_benefactor_reward') + ' ' + c['benefactor'] + "'s benefactor reward: " + c['reward'] + ' for @' + c['author'] + '/' + c['permlink'];
}

/*
 * feed price
 */
function feed_publish_html(f) {
  return f['publisher'] + ' feed price: ' + f['exchange_rate']['base'];
}

/*
 * vote for witness
 */
function account_witness_vote_html(a) {
  let approve = a['approve']==true?' approved ':' unapproved ';

  return a['account'] + approve + a['witness'] + ' as witness';
} 

/*
 * posts and comments
 */
function comment_html(c) {
  if(c['title']=='') {
    return operation_icons('comment') + ' ' + c['author'] + ' left a comment ' + '@' + c['author'] + '/' + c['permlink'] + ' -> ' + truncate_string(c['body'].trim());
  }else{
    return operation_icons('post') + ' ' + c['author'] + ' published a post: ' +  truncate_string(c['title'].trim());
  }
}

/* 
 * delete a comment
 */
function delete_comment_html(d) {
  return d['author'] + ' deleted a comment: @' + d['author'] + '/' + d['permlink'];
}


/*
 * transfer
 */
function transfer_html(t) {
  return operation_icons('transfer') + ' ' + t['from'] + ' transferred ' + t['amount'] + ' to ' + t['to'] + '. Memo: ' + truncate_string(t['memo']);
} 

/*
 * power up
 */
function transfer_to_vesting_html(t) {
  return t['from'] + ' powered up ' + t['amount'] + ' to ' + t['to'];
}

/*
 * withdraw vesting
 */
function withdraw_vesting_html(w) {
  return w['account'] + ' powering down ' + w['vesting_shares'];
}

/*
 * SP delegation 
 */
function delegate_vesting_shares_html(d) {
  return d['delegator'] + ' delegates ' + d['vesting_shares'] + ' to ' + d['delegatee'];
} 
 

/*
 * account creation
 */
function account_create_with_delegation_html(a) {
  return a['creator'] + ' created account ' + a['new_account_name'] + ' with fee ' + a['fee'];
}

// Process custom json events
function custom_json_html(c) {
  let j = JSON.parse(c['json']);
  let operation_id = j[0];
  if(operation_id=='follow') {
    return custom_json_follow_html(j[1]);
  }else if(operation_id=='reblog'){
    return custom_json_reblog(j[1]);
  }else{
    return 'UNIMPLEMENTED custom_json operation' + operation_id + ' ' + operation_id + ', please report to @yuxi';
  }
}

// following event
function custom_json_follow_html(json) {
  let what = json['what'].length==0? " unfollow ":" following ";    
  let icon = json['what'].length==0? operation_icons('unfollow') + ' ':operation_icons('follow') + ' ';
  return icon + json['follower'] + what + json['following'];
}

// reblog event
function custom_json_reblog(c) {
  return c['account'] + ' reblogged @' + c['author'] + '/' + c['permlink'];
}

/* 
 * truncate string if it's too long
 */
function truncate_string(s) {
  let string_length = 40;
  return (s.length > string_length) ? s.substr(0,string_length-1) + '...' : s;
}

// Update page
async function updateui() {
	let pattern = /@[^\/]*/;
	let username_array = window.location.href.match(pattern);
	
	if(username_array) {
		let username = username_array[0];
		
    	let numbers = 100;  // use a fixed number for now, will be configurable later
		
		// get numbers of records from user account history
	    let result  = await find_last_record(username.substring(1,username.length), numbers);
        let html    = '<div style="padding-top:1em; float:left; width:30%"><h4>Steem mate ['+username+']</h4>';

		// construct html output
        for(let r in result.reverse()) {
            let trx_id         = result[r][1]['trx_id'];
            let block          = result[r][1]['block'];
            let trx_in_block   = result[r][1]['trx_in_block'];
            let op_in_trx      = result[r][1]['op_in_trx'];
            let virtual_op     = result[r][1]['virtual_op'];
            let timestamp      = result[r][1]['timestamp'];
            let op             = result[r][1]['op'];

            html = html + '<p class="operation_border">' + timestamp + ' ' + operation_html(op) + '</p>';
        }
        html = html + '</div>';

		// Add a div to show the additional info
        $( '#content div div.App__content div.UserProfile div div.row:eq(1)' ).prepend( html );
	}
	
}

updateui();