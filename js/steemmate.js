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

  if(operation[0]=='claim_reward_balance')             return claim_reward_balance_html(operation[1]);
  if(operation[0]=='curation_reward')                  return curation_reward_html(operation[1]);
  if(operation[0]=='author_reward')                    return author_reward_html(operation[1]);
  
    
  /*
  if(operation[0]=='account_create_with_delegation')   return account_create_with_delegation_html(operation[1]);
  if(operation[0]=='delegate_vesting_shares')          return delegate_vesting_shares_html(operation[1]);
  if(operation[0]=='transfer')                         return transfer_html(operation[1]);
  if(operation[0]=='producer_reward')                  return producer_reward_html(operation[1]);
  if(operation[0]=='comment')                          return comment_html(operation[1]);
  if(operation[0]=='delete_comment')                   return delete_comment_html(operation[1]);
  if(operation[0]=='comment_benefactor_reward')        return comment_benefactor_reward_html(operation[1]);
  if(operation[0]=='withdraw_vesting')                 return withdraw_vesting_html(operation[1]);
  if(operation[0]=='transfer_to_vesting')              return transfer_to_vesting_html(operation[1]);
  if(operation[0]=='feed_publish')                     return feed_publish_html(operation[1]);
  if(operation[0]=='account_witness_vote')             return account_witness_vote_html(operation[1]);
  if(operation[0]=='custom_json')                      return custom_json_html(operation[1]);
  */  
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
    oper = 'downvoted';
  }else if(weight==0) {
    oper = 'un-voted';
  }

  let w = weight==0? '':'[' + weight / 100 + '%]';
  
  return voter + ' ' + oper + ' ' + author + ' ' + w + ' @' + author + '/' + permlink ;
}

/*
 * generate html for claiming account balance operations
 */
function claim_reward_balance_html(c) {
  return c['account'] + ' claiming ' + c['reward_steem'] + ', ' + c['reward_sbd'] + ', ' + c['reward_vests'];
}

function curation_reward_html(c) {
  return 'Curation reward: ' + c['reward'] + ' for @' +c['comment_author'] + '/' + c['comment_permlink']; 
}

function author_reward_html(a) {
  return a['author'] + '\' author reward for ' + a['permlink'] + ': ' + a['sbd_payout'] + ', ' + a['steem_payout'] + ', ' + a['vesting_payout'];
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

            html = html + '<p>' + timestamp + ' ' + operation_html(op) + '</p>';
        }
        html = html + '</div>';

		// Add a div to show the additional info
        $( '#content div div.App__content div.UserProfile div div.row:eq(1)' ).prepend( html );
	}
	
}

updateui();