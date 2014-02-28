$('#addNKW').on("click", function() {
	var $rows = $('#tmpl-nkw tr').clone();
	var index = $(this).closest("table").find(".isactive").length;
	$rows.find("*[name]").each(function() {
		this.name = this.name.replace("{index}", index);
	});
	$rows.find("*[id]").each(function() {
		this.id = this.id.replace("{index}", index);
	});
	$rows.find("*[for]").each(function() {
		this.htmlFor = this.htmlFor.replace("{index}", index);
	});
	$(this).closest("table").append($rows);
});
$('#addPWS').on("click", function() {
	var $rows = $('#tmpl-pws tr').clone();
	var index = $(this).closest("table").find(".isactive").length;
	$rows.find("*[name]").each(function() {
		this.name = this.name.replace("{index}", index);
	});
	$(this).closest("table").append($rows);
});
$('#addFKW').on("click", function() {
	var $rows = $('#tmpl-fkw tr').clone();
	var index = $(this).closest("table").find(".isactive").length;
	$rows.find("*[name]").each(function() {
		this.name = this.name.replace("{index}", index);
	});
	$rows.find("*[id]").each(function() {
		this.id = this.id.replace("{index}", index);
	});
	$rows.find("*[for]").each(function() {
		this.htmlFor = this.htmlFor.replace("{index}", index);
	});
	$(this).closest("table").append($rows);
});
$('table').on("click", '.isactive', function() {
	var $tr     = $(this).closest("tr");
	var counter = this.dataset.span;
	if (counter == 2) {
		$tr = $tr.add($tr.next());
	}
	$tr.find("input[name], select[name]").prop("disabled", !this.checked);
});
$('table').on("click", '.wurf', function() {
	$(this).nextAll().prop("disabled", !this.checked);
});
$('button').prop("disabled", false);
