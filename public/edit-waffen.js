// activate tabs
$('#tab-header').on("click", "a", function (evt) {
	evt.preventDefault();
	$(this).tab("show");
});
$('#tab-header a:first').tab("show");

// remove template from form
$('form').on("submit", function () {
	$(this).find('.dcm-template').remove();
});

// add weapon panel
$('.add').on("click", function () {
	var index  = $(this).closest('form').find('.panel').length - 1;
	var $tmpl  = $(this).closest('form').find('.dcm-template');
	var $panel = $tmpl.clone();
	$panel.removeClass('dcm-template');
	$panel.find("*[name]").each(function() {
		this.name = this.name.replace("{index}", index);
	});
	$panel.find("*[id]").each(function() {
		this.id = this.id.replace("{index}", index);
	});
	$panel.find("*[for]").each(function() {
		this.htmlFor = this.htmlFor.replace("{index}", index);
	});
	$panel.insertBefore($tmpl);
});

// delete weapon panel
$('.tab-content').on("click", '.del', function () {
	$(this).closest('.panel').remove();
});
/*
$('table').on("click", '.wurf', function() {
	$(this).nextAll().prop("disabled", !this.checked);
});
*/
$('button').prop("disabled", false);
