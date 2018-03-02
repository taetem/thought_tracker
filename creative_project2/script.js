$(document).ready(function() {
	function Generator() {};

	Generator.prototype.rand =  Math.floor(Math.random() * 26) + Date.now();

	Generator.prototype.getId = function() {
		return this.rand++;
	};
	var idGen =new Generator();
	var submitButton = $("#cognitiveSubmit");
	console.log(submitButton);
	 $("#cognitiveSubmit").click(function(e) {
	 	var docID = idGen.getId();
		e.preventDefault();
		var value = $("#cognitiveInput").val();
        console.log(value);
		var dataToSend = { 
		    documents: [
		    	{"id": docID.toString(), "text": value, "language": "en"}
		    ]
		};
		 var params = {
            // Request parameters
        };
      
        $.ajax({
            url: "https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment?" + $.param(params),
            beforeSend: function(xhrObj){
                // Request headers
                xhrObj.setRequestHeader("Content-Type","application/json");
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","63ba8921f40a4571a47dd8b13dcc52de");
            },
            type: "POST",
            // Request body
            data: JSON.stringify(dataToSend),
        })
        .done(function(json) {
            alert("success");
            console.log(json);
				var results = "";
				results += '<h2>Sentiment scores: ' + " </h2>";
				for (var i=0; i<json.documents.length; i++) {
				    results += "<p>" + json.documents[i].score + "</p>";
				}
				results += '<h2>Sentiment errors: ' + " </h2>";
				for (var i=0; i<json.errors.length; i++) {
				    results += "<p>" + json.errors[i].id + ": " + json.errors[i].message + "</p>"
				}
				$("#cognitiveResults").html(results);
        })
        .fail(function() {
            alert("error");
        });
    });
});