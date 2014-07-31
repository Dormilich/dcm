/*
Array.prototype.intersect = function (arr) {
	if (!Array.isArray(arr)) {
		throw new TypeError('Argument is not an Array.');
	}
	return this.filter(function (item) {
		return (arr.indexOf(item) > -1);
	});
};
Array.prototype.diff = function (arr) {
	if (!Array.isArray(arr)) {
		throw new TypeError('Argument is not an Array.');
	}
	return this.filter(function (item) {
		return (arr.indexOf(item) === -1);
	});
};
Array.prototype.unique = function () {
	return this.filter(function (item, index, src) {
		return (src.indexOf(item) === index);
	});
};
//*/
$('#pagenav a:first').trigger('click');

$('button:disabled').prop('disabled', false);

$('.tab-content').on('click', '.isactive', function() {
	var $tr    = $(this).closest('.row');
	var $check = $(this);
	if ($check.length) {
		$tr.find('.unlock').prop('disabled', !$check.prop('checked'));
		$tr.find('.lock').prop('disabled', true);
	}
});

$('#Nahkampf').on('change', '.row', function() {
	var taw = Number($(this).find('.nk-at').val()) + Number($(this).find('.nk-pa').val());
	$(this).find('.nk-taw').text(taw);
});

$('form').on('click', '.badge', function (evt) {
	var $ul = $(this).parent().find('ul');
	$ul.toggle();
	$(this).text($ul.find(':checked').length);
}).on('click', '.toggle-custom', function (evt) {
	var $input = $(this).next();
	$input.prop('disabled', !this.checked);
});
