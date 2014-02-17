(function() {
	var $ = document.getElementById.bind(document);
	// control <progress>
	function Progress(el)
	{
		if (!(el instanceof HTMLProgressElement)) {
			throw new Error("No progress bar found.");
		}
		el.value = 0;
		el.classList.remove("hide");
		var obj = Object.create(Progress._proto);
		Object.defineProperty(obj, "src", {
			value: el,
			writable:   false,
			enumerable: true
		});
		return obj;
	}
	Progress._proto = {
		update: function (percent) {
			this.src.value = percent;
		},
		end: function() {
			this.src.classList.add("hide");	
		}
	};
	// read file and send to server as JSON
	function sendFile(file, url, prog)
	{
		var reader      = new FileReader();
		var xhr         = new XMLHttpRequest();
		var progressBar = Progress(prog);
		// XHR events for upload progress
		xhr.upload.addEventListener("progress", function(evt) {
			if (evt.lengthComputable) {
				var percentage = Math.round(evt.loaded * 100 / evt.total);
				progressBar.update(percentage);
			}
		}, false);
		xhr.upload.addEventListener("load", function(evt) {
			progressBar.update(100);
			progressBar.end();
		});
		// XHR Response error handling
		xhr.onreadystatechange = function(evt) {
			if (this.readyState === 4 && this.status === 200) {
				$('success').textContent = file.name+": "+this.responseText;
			}
			if (this.readyState === 4 && this.status >= 300) {
				$('error').textContent = "Fehler ("+file.name+"): "+this.statusText;
			}
		};
		// start XHR
		xhr.open("POST", url);
		xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
		// FileReader events
		reader.onload = function (evt) {
			xhr.send(evt.target.result);
		};
		// start reading File
		reader.readAsText(file);
	}
	// for all submit buttons
	var sbm = document.getElementsByClassName("sbm");
	[].forEach.call(sbm, function(elem) {
		elem.addEventListener("click", function(evt) {
			$('error').textContent   = "";
			$('success').textContent = "";
			var upl  = this.parentNode.querySelector("input");
			var prog = this.parentNode.querySelector("progress");
			// send file only if there is one
			if (upl.files.length) {
				sendFile(upl.files[0], upl.dataset.url, prog);
			}
		});
	});
})();