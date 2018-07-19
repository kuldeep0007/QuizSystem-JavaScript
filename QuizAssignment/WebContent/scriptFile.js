	var queNo = 0;
	var score = 0;
	var jsonQuestionObject;
	var totalque;
	var userAnswerMap = new Map();

//***************************************index.html script*********************************************
		function loadBody(){
		  		$("#indexBody").load("login.html");
		  	}

//***************************************login.html script**********************************************
		function validateUser(){
			var userId = document.getElementById("userId").value;
			var userPass = document.getElementById("passId").value;
			let flag = 0;
			$.get("loginDetails.json", function (data,status){
				var jsonDataObject = JSON.parse(data);
				if((userId == jsonDataObject['uid']) && (userPass == jsonDataObject['upass'])){
					 $("#btnSubmitId").removeClass("btn-danger").addClass("btn-success");
					//alert("login success");
					$("#indexBody").load("quizRules.html");
					flag = 1;
				}
				else{
					 $("#btnSubmitId").removeClass("btn-success").addClass("btn-danger");
					 flag = 0;
					//alert("login failed");
				}
			});
			
			if( flag == 0){
				return false;
			}
			else{
				return true;
			}
		}

//*************************************************quizRules.html***************************************
		function startQuiz(){
			var checkTnc = document.getElementById("chktnc");
			if(checkTnc.checked != true){
				$("#labelCheckTnc").addClass("alert alert-danger");
			}
			else{
				$("#labelCheckTnc").removeClass("alert alert-danger");
				$("#indexBody").load("quizQuestions.html",function() {
					loadFirstQuestion();
				});	
			}
		}
		//loading first question
		function loadFirstQuestion(){	
			$.get("quizQuestions.json", function(data,status){
				jsonQuestionObject = JSON.parse(data);
				totalque = Object.keys(jsonQuestionObject).length;
				$("#queId").html(jsonQuestionObject[queNo].que);
				$("#opt0Id").html(jsonQuestionObject[queNo].options[0]);
				$("#opt1Id").html(jsonQuestionObject[queNo].options[1]);
				$("#opt2Id").html(jsonQuestionObject[queNo].options[2]);
				$("#opt3Id").html(jsonQuestionObject[queNo].options[3]);
				initlizeUserAnswerMap();
				createDynQuesList();
			});	
		}
		//initlizing userAnswerArray
		function initlizeUserAnswerMap(){
			for(var i = 0; i < totalque; i++){
				userAnswerMap.set(i, undefined);
			}
		}
		
		function validateCheck(){
			var checkTnc = document.getElementById("chktnc");
			if(checkTnc.checked == false){
				$("#labelCheckTnc").addClass("alert alert-danger");
			}
			else{
				$("#labelCheckTnc").removeClass("alert alert-danger");
			}
		}


	
//**************************quizQuestion.html script*************************************************************
	//function for next question
	function nextQuestion(){
		//***setting user answer in userAnswerMap
		 var optionsRadioGroup = document.getElementsByName("ansOption");
		 for(var i=0;i<optionsRadioGroup.length;i++){
			   if(optionsRadioGroup[i].checked == true){
				   userAnswerMap.set(queNo,i);
				   document.getElementById("btn"+queNo).className="btn-circle-answred";
			   }
		   }
		 
		//alert("question" +queNo+ "given option no "+ userAnswerMap.get(jsonQuestionObject[queNo].queno));
		queNo++;
		if(queNo == totalque-1){
			document.getElementById("btnNext").value= "Finish Quiz";
		}
		else{
			document.getElementById("btnPrev").disabled = false;
		}
		clearAllRadioBtns();
		//enableAllRadioBtns();
		
		//***Submit Quiz and go to result page
		if(queNo == totalque){
			$("#indexBody").load("quizResult.html",function() {
				insertRowsInTable();
			});
		}
		//***updating user previous answer
		
		if(userAnswerMap.get(queNo) != undefined){
			var optionsRadioGroup = document.getElementsByName("ansOption");
			//alert("question number"+queNo+"\n Map Child"+jsonQuestionObject[queNo].queno+"\n map child value or optionIndex"+userAnswerMap.get(jsonQuestionObject[queNo].queno))
			optionsRadioGroup[userAnswerMap.get(queNo)].checked = true;
		}
		(document.getElementById("crtAnsDiv")).style.display = 'none';
		
			$("#queId").html(jsonQuestionObject[queNo].que);
			$("#opt0Id").html(jsonQuestionObject[queNo].options[0]);
			$("#opt1Id").html(jsonQuestionObject[queNo].options[1]);
			$("#opt2Id").html(jsonQuestionObject[queNo].options[2]);
			$("#opt3Id").html(jsonQuestionObject[queNo].options[3]);
		
		
	}
	
	//***function for previous question
	function previousQuestion(){
		//***setting user selected answer in userAnswerMap
		var optionsRadioGroup = document.getElementsByName("ansOption");
		 for(var i=0;i<optionsRadioGroup.length;i++){
			   if(optionsRadioGroup[i].checked == true){
				   userAnswerMap.set(queNo,i);
				   document.getElementById("btn"+queNo).className="btn-circle-answred";
			   }
		   }
		queNo--;
		if(queNo == 0){
			document.getElementById("btnPrev").disabled = true;
		}
		else{
			document.getElementById("btnPrev").disabled = false;
			document.getElementById("btnNext").value= "Next";
		}
		clearAllRadioBtns();
		//enableAllRadioBtns();
		//***updating user previous answer
		if(userAnswerMap.get(queNo) != undefined){
			var optionsRadioGroup = document.getElementsByName("ansOption");
			optionsRadioGroup[userAnswerMap.get(queNo)].checked = true;
		}
		(document.getElementById("crtAnsDiv")).style.display = 'none';
		$.get("quizQuestions.json", function(data,status){
			jsonQuestionObject = JSON.parse(data);
			totalque = Object.keys(jsonQuestionObject).length;
			
			$("#queId").html(jsonQuestionObject[queNo].que);
			$("#opt0Id").html(jsonQuestionObject[queNo].options[0]);
			$("#opt1Id").html(jsonQuestionObject[queNo].options[1]);
			$("#opt2Id").html(jsonQuestionObject[queNo].options[2]);
			$("#opt3Id").html(jsonQuestionObject[queNo].options[3]);
		});
	}
	
	//**********called when options of a question are selected
	function showAnswer(){
		//dissableAllRadioBtns();
		(document.getElementById("crtAnsDiv")).style.display = 'block';
		$("#crtAns").html("Correct Answer : " + jsonQuestionObject[queNo].ans);
	}
	function clearAllRadioBtns(){
		   var optionsRadioGroup = document.getElementsByName("ansOption");
		   for(var i=0;i<optionsRadioGroup.length;i++){
			   if(optionsRadioGroup[i].checked == true){
				   optionsRadioGroup[i].checked = false;
			   }
		   }
	}
	//*** function to create dynamic button for selecting question
	function createDynQuesList(){
        for(var i = 0; i < totalque; i++){
        	var btnQue = document.createElement("input");
        	btnQue.type = "button";
        	btnQue.value = i;
        	btnQue.id = "btn"+i;
        	document.getElementById("slctQuestionDiv").appendChild(btnQue);
            btnQue.className="btn-circle";
            btnQue.onclick = function(){
            	  //***************************//***************************//**********		 
            	//***setting user answer in userAnswerMap
       		 var optionsRadioGroup = document.getElementsByName("ansOption");
       		 for(var i=0;i<optionsRadioGroup.length;i++){
       			   if(optionsRadioGroup[i].checked == true){
       				   userAnswerMap.set(queNo,i);
       				   document.getElementById("btn"+queNo).className="btn-circle-answred";
       			   }
       		   }
        	
            	queNo = parseInt(this.value);
            //***************************//***************************//**********	
            	if(queNo == totalque-1){
        			document.getElementById("btnNext").value= "Finish Quiz";
        		}
        		else{
        			document.getElementById("btnPrev").disabled = false;
        			document.getElementById("btnNext").value= "Next";
        		}
            	clearAllRadioBtns();
            	//***updating user previous answer
        		
        		if(userAnswerMap.get(queNo) != undefined){
        			var optionsRadioGroup = document.getElementsByName("ansOption");
        			optionsRadioGroup[userAnswerMap.get(queNo)].checked = true;
        		}
            	
        		(document.getElementById("crtAnsDiv")).style.display = 'none';
        		
    			$("#queId").html(jsonQuestionObject[queNo].que);
    			$("#opt0Id").html(jsonQuestionObject[queNo].options[0]);
    			$("#opt1Id").html(jsonQuestionObject[queNo].options[1]);
    			$("#opt2Id").html(jsonQuestionObject[queNo].options[2]);
    			$("#opt3Id").html(jsonQuestionObject[queNo].options[3]);
    		
            };
        }
    }
/*	function dissableAllRadioBtns(){
		 var optionsRadioGroup = document.getElementsByName("ansOption");
		   for(var i=0;i<optionsRadioGroup.length;i++)
			   optionsRadioGroup[i].disabled = true;
	}
	
	function enableAllRadioBtns(){
		 var optionsRadioGroup = document.getElementsByName("ansOption");
		   for(var i=0;i<optionsRadioGroup.length;i++)
			   optionsRadioGroup[i].disabled = false;
	}*/
	
	//*************************************************quizResult.html***************************************	
	function insertRowsInTable(){
        var table = document.getElementById("resultTable");
        for(var i = 0; i < totalque; i++){
           var row = table.insertRow(i+1);
           for(var j = 0; j < 3; j++){
               var cell = row.insertCell(j);
               //cell.innerHTML=i+","+j;
              // cell.className="alert alert-danger";
              if(j==0){
            	  cell.innerHTML=i;
              }
              if(j==1){
            	  cell.innerHTML=jsonQuestionObject[i].options[userAnswerMap.get(i)];
              }
              if(j==2){
            	  if(jsonQuestionObject[i].options[userAnswerMap.get(i)] == jsonQuestionObject[i].ans){
            		  cell.innerHTML="1 Mark";
            		  row.className="alert alert-success";
            		  score++;
            	  }else{
            		  cell.innerHTML="0 Mark";
            		  row.className="alert alert-danger";
            	  }
              }
           }
       }
        showUserResult();
	}
	
	function showUserResult(){
		var uResult = (score / totalque) * 100;
		if(uResult >= 70){
			 $("#resultPnl").removeClass("panel-primary").addClass("panel-success");
			 (document.getElementById("usrRemark")).innerHTML = "Excellent Job !! You are doing Great";
		}else if(uResult <70 && uResult >=50){
			 $("#resultPnl").removeClass("panel-primary").addClass("panel-warning");
			 (document.getElementById("usrRemark")).innerHTML = "Good Job !! You can do Better";
		}else if(uResult <50){
			 $("#resultPnl").removeClass("panel-primary").addClass("panel-danger");
			 (document.getElementById("usrRemark")).innerHTML = "Upsss !! You need Serious Improvement";
		}
		
		(document.getElementById("ttlQuestion")).innerHTML="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Total number of Questions : "+totalque;
		(document.getElementById("uncorrAns")).innerHTML="Total number of Wrong Answer : "+(totalque-score);
		(document.getElementById("corrAns")).innerHTML="Total number of Correct Answer : "+score;
		(document.getElementById("usrResult")).innerHTML="Your Result is : "+uResult+" %";
	}
	//***************************************