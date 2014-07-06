// make sure when a tradition is checked the resp. ritualkenntnis is checked, too
$('form').on("submit", function() {
	$('.sublist').each(function() {
		if ($(this).find('ul input:checked').length) {
			$(this).children('input').prop('checked', true);
		}
		else {
			$(this).children('input').prop('checked', false);
		}
	});
});
// disable/enable skill test dropdowns
$('#probe').on('click', function() {
	$(this).parent().find('select').prop('disabled', function(i, chk) {
		return !chk;
	});
});
$('#shm').on("click", function() {
	var state = this.checked;
	$(this).closest('li').find('li input').prop("checked", function() {
		return state;
	});
});
