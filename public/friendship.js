(function() {
	// template function for Typeahead dropdown
	function dropdownItem(obj) {
		return '<p><div>'+obj.name+'</div><div><small>'+obj.email+'</small></div></p>';
	}
	// add Friend to the Friend List
	function appendFriend(options) {
		var $li    = $('<li class="list-group-item"/>');
		var $label = $('<label class="checkbox-inline"/>');
		var $cbox  = $('<input type="checkbox" name="friends[]"/>');
		$cbox.val(options.id).prop("checked", !!options.checked);
		$label.append($cbox).append(options.name);
		$li.append($label);
		$('#friend-list').append($li);
	}
	// save Friend List
	function saveFriends() {
		$.post( 
			"/freunde", 
			$('#friend-list').find(':checked').serialize() 
		).done(function(data) {
			$('#friend-count').text(data.count);
		});
	}
	// create an Error Message
	function errorAlert(message) {
		var $div = $("<div/>").addClass("alert alert-warning alert-dismissable");
		var $btn = $('<button type="button" class="close" data-dismiss="alert" aria-hidden="true"><span class="fa fa-times"></span></button>');
		return $div.append($btn).append(message);
	}
	// Typeahead for finding Friends
	$('#friend-add').typeahead({
		hint:      true,
		highlight: true,
		minLength: 2
	}, {
		name:       "usernames",
		displayKey: "name",
		templates: {
			empty: '<div>—kein Name gefunden—</div>',
			suggestion: dropdownItem,
		},
		source: function (q, cb) {
			$.getJSON("/userlist", { name: q, skip: "own" }, cb);
		}
	}).on("typeahead:selected", function(evt, selection, datasetName) {
		appendFriend(selection);
	});
	// instead of a form reset
	$('#empty').on("click", function() {
		$('#username-search').val("");
	});
	// trigger for saving Friend List
	$('#friend-list').on("click", 'input', saveFriends);
	// Typeahead for requesting Friendship
	$('#friend-ask').typeahead({
		hint:      true,
		highlight: true,
		minLength: 2
	}, {
		name:       "usernames",
		displayKey: "name",
		templates: {
			empty: '<div>—kein Name gefunden—</div>',
			suggestion: dropdownItem,
		},
		source: function (q, cb) {
			$.getJSON("/userlist", { name: q, skip: "group" }, cb);
		}
	}).on("typeahead:selected", function(evt, selection, datasetName) {
		this.dataset.id = selection.id;
	});
	// send a Friendship request
	$('#ask').on("click", function() {
		var $friend = $('#friend-ask');
		var fid     = $friend.data("id");
		if ($friend.val() && fid) {
			$.get(
				"/friendship", 
				{ id: fid }
			).done(function() {
				// add friend to pending list
				var $li = $('<li class="list-group-item"/>').text( $friend.val() );
				$friend.closest('.panel-body').find('ul.list-group').append($li);
			}).fail(function(jqXHR) {
				var msg = jqXHR.responseText;
				// leave a message
				$friend.parent().append( errorAlert(msg) );
				console.log(jqXHR.status);
				console.log(msg);
			}).always(function() {
				// clean up
				$friend.val("");
				$friend.data("id", "");
			});
		}
	});
	// accept or reject Friendship
	$('#friend-requested').on("click", 'button', function() {
		var $input = $(this).closest('.input-group').find('input');
		var save, url;
		// native classList reliable enough?
		// add as Friend
		if ($(this).hasClass("btn-success")) {
			url  = "/friendship/accept";
			save = function() {
				appendFriend({
					id:      $input.data("user"),
					name:    $input.val(),
					checked: true
				});
				saveFriends();
			}
		}
		// reject Friendship
		else if ($(this).hasClass("btn-danger")) {
			url  = "/friendship/reject";
			save = function() {};
		}
		// you never know ...
		else {
			return null;
		}
		// send off request
		$.get(url, { message: $input.data("message") }).done(save).done(function() {
			// clean up
			$input.closest('.form-group').remove();
		}).fail(function(jqXHR) {
			// notify
			$input.closest('.form-group').append( errorAlert(jqXHR.responseText) );
		});
	});
})();
