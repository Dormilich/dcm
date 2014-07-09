Number.prototype.round = function (digits) {
	return parseFloat(this.toFixed(digits));
}

$('button').prop("disabled", false);

$('form').on("submit", function() {
	$(this).find(".panel-footer").remove();
});

$('#armor').on("click", '.isactive', function() {
	$(this).closest('.row').find('*[name]').prop("disabled", !this.checked);
});

$('#liste').on("click", 'input', function() {
	var ids = ["ko", "br", "ru", "ba", "ra", "la", "rb", "lb", "rs", "be"]
	function round(val)
	{
		return parseFloat((+val).toFixed(2));
	}
	if (this.checked) {
		ids.forEach(function(id) {
			var inp   = document.getElementById(id);
			inp.value = round(+inp.value + +this.dataset[id]);
		}, this);
	}
	else {
		ids.forEach(function(id) {
			var inp   = document.getElementById(id);
			inp.value = round(inp.value - this.dataset[id]);
		}, this);
	}
});

$('#add').on("click", function() {
	var idx  = $(this).closest('.panel').find('.panel-body .row').length;
	var $row = $(this).closest('.row');
	var $tr  = $row.clone();
	$tr.find('button').remove();
	$tr.find('*[name]').each(function () {
		this.name = this.name.replace("{index}", idx);
	});
	$(this).closest('.panel').find('.panel-body').append($tr);
	$row.find('input').each(function () {
		this.value = this.defaultValue;
	});
	$tr.find('input').each(function () {
		this.id = '';
	});
}).on("click", function() {
	$('#liste').find(':checked').prop("checked", false);
});
