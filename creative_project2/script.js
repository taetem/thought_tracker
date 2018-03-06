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
            console.log(json);
				var results = "";
				results += '<h2>Sentiment scores: ' + " </h2>";
				for (var i=0; i<json.documents.length; i++) {
					var sentimentScore = json.documents[i].score
				    results += "<p>" + sentimentScore + "</p>";

				    if (sentimentScore > 0.5) {
				    	results += "<p> Your thought is positive. </p>"
				    } else if (sentimentScore === 0.5) {
				    	results += "<p> Your thought is neutral. </p>"
				    } else {
				    	results += "<p> Your thought is negative. </p>"
				    }
				}
				for (var i=0; i<json.errors.length; i++) {
					if (!(jQuery.isEmptyObject(json.errors[0].id))) {
						results += '<h2>Sentiment errors: ' + " </h2>";
					}
				    results += "<p>" + json.errors[i].id + ": " + json.errors[i].message + "</p>"
				}
				$("#cognitiveResults").html(results);
        })
        .fail(function() {
            var results = "<h2>Failed to query Microsoft Cognitive Services API. Please try again later.</h2>";
            $("#cognitiveResults").html(results);
        });
    });
});