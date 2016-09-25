function caseO(id, endPoint, apiGroup)
{
    this.id = id;
    this.endPoint = endPoint;
	this.apiGroup = apiGroup;
}

function findBestReservations(day, fromTime, cases, resultCallBack)
{	
	this.getReservationsData = function(day, cases, whenDataReadyFunc, resultCallBack)
	{
		this.day = day;
		this.cases = cases;
		this.casesResCounter = 0;
		
		this.casesReservationsList = {};
		
		this.get_time = function(data) {
			var time = data.split(':')
			return time[0]*3600+time[1]*60;
		};

		this.get_Obj = function(trObj, index) {
			var value0 = trObj.getElementsByClassName('BTN_OK')[index].getAttribute('value').split('-');
			var slot0 = trObj.getElementsByClassName('sloty')[index].innerHTML.split('/');
			return {
				from: this.get_time(value0[0]),
				to: this.get_time(value0[1]),
				current: parseInt(slot0[0].substring(2)),
				max: parseInt(slot0[1].substring(0, slot0[1].length-1))
			};
		};
		
		this.getReservationsList = function(c_case) {
			$.ajax({
				type: "GET",
				url: "http://robi24.cal24.pl/robi24/grab.php?test="+c_case.endPoint+"&day="+this.day/1000+"&group=" + c_case.apiGroup,
			})
			.done(data => {
				var xmlString = data
				, parser = new DOMParser()
				, doc = parser.parseFromString(xmlString, "text/xml"); 
				
				var trs = doc.getElementsByTagName('tr');
				var array = [];
				_.forEach(trs, tr => {
					if(tr.innerHTML.indexOf("<th") > -1) return;
					if(tr.getElementsByClassName('BTN_OK')[0] == null) return;
					if(typeof tr.getElementsByClassName('BTN_OK')[0] !== 'undefined' &&
						!_.isEmpty(tr.getElementsByClassName('sloty')[0].innerHTML)) {
						var o1 = this.get_Obj(tr,0);
						if(o1.current<o1.max) array.push(o1);
					}
					if(typeof tr.getElementsByClassName('BTN_OK')[1] !== 'undefined' &&
						!_.isEmpty(tr.getElementsByClassName('sloty')[1].innerHTML)) {
						var o2 = this.get_Obj(tr,1);
						if(o2.current<o2.max) array.push(o2);
					}
				});
				this.getReservationsListCallback(c_case.id, array);
			})
		};
		
		this.getReservationsListCallback = function(caseId, data)
		{
			this.casesReservationsList[caseId] = data;
			this.casesResCounter++;
			if(this.casesResCounter == cases.length)
				this.finallCallback();
		};
		
		this.finallCallback = function()
		{
			//console.log("saving");
			whenDataReadyFunc(this.casesReservationsList, resultCallBack);
		};
		
		for (var i = 0; i < this.cases.length; i++) 
		{
			this.getReservationsList(this.cases[i]);
		}
	};
	
	this.whenDataReady = function (reservationsData, resultCallBack){
		this.get_stime = function(data) {
			mm = Math.floor((data/60)%60);
			hh = Math.floor((data/3600)%60);
			return hh+":"+mm;
		};
		
		this.reservation_obj = function(id, obj){
			return {
				caseId: id, 
				from: get_stime(obj.from),
				to: get_stime(obj.to)
			};
		};
		
		var ids = Object.keys(reservationsData);
		
		var notBefore = fromTime;
		result = []
		for (; ids.length > 0 ;) 
		{
			for (var i = 0; i < ids.length; i++) 
			{
				var wsk = 0;
				//console.log(ids[i]);
				for (var j = 0; j < reservationsData[ids[i]].length; j++) 
				{
					//console.log(reservationsData[ids[i]][j]['from'], fromTime);
					if(reservationsData[ids[i]][j]['from'] < notBefore)
						wsk++;
				}
				//console.log(wsk);
				reservationsData[ids[i]] = reservationsData[ids[i]].slice(wsk, reservationsData[ids[i]].length);
			}
		

			var curBestId = null;
			for (var i = 0; i < ids.length; i++) 
			{
				if(typeof reservationsData[ids[i]][0] === 'undefined') {
					resultCallBack("err");
					return;
				}
				if(curBestId == null || reservationsData[ids[i]][0]['from'] < reservationsData[curBestId][0]['from'])
					curBestId = ids[i];
			}
			notBefore = reservationsData[curBestId][0]['to'];
			result.push(this.reservation_obj(curBestId, reservationsData[curBestId][0]));
			ids.splice(ids.indexOf(curBestId), 1);
		}
		
		resultCallBack(result);
	}
	
	this.getReservationsData(day, cases, this.whenDataReady, resultCallBack);
}
/*
	function fappinartor()
{
	var day = new Date(2016, 09, 29).getTime(); //YYYY, mm, dd

	var caseId = 1;
	var endPoint = "http://udbialoleka.rezerwacje.um.warszawa.pl/ajaxcall.php";
	var group = 1;
	
	getReservationsList(caseId, endPoint, day, group);
}


*/


//parserEnd