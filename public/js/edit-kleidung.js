$('button').prop("disabled", false);

$('#armor').on("click", '.isactive', function() {
	$(this).closest('li').find('*[name]').prop("disabled", !this.checked);
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
	var idx  = $(this).closest('.panel').find('li').length;
	var $src = $(this).closest('.panel-footer').find('input[type="number"]');
	var $row = $('#template').find('li').clone();
	var $inp = $row.find('input[type="number"]');
	
	$row.find('*[name]').each(function () {
		this.name = this.name.replace("{index}", idx);
	});
	$src.each(function (index) {
		$inp[index].value = this.value;
	});
	$('#armor').append($row);

	$src.val(0);
}).on("click", function() {
	$('#liste').find(':checked').prop("checked", false);
});
