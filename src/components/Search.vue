<template>
  <div class="Search search-box">
  	<form action="" name="preferred-pricing-form" id="preferred-pricing-form" method="post" accept-charset="utf-8" enctype="multipart/form-data">
	    <h1>{{ msg }}</h1>
	    <input autocomplete="false" id="searchInputBox" type="text" name="search" placeholder="Start typing the name of your company…" v-model.trim="searchKey" @keydown.down="searchDown" @keydown.up="searchUp" @keydown.enter.stop.prevent="searchSelected">
		<ul v-if="showCompanies()">
	   		<li v-if="checkIfAnyResult()">No Match Found</li>
	   		<li  :tabindex="index" :id="'searchHover'+index" v-for="(company,index) in filteredSearch" @click.stop.prevent="selectedCompany(company)" :class="{searchHover:(index == searchCounter)}" v-else >{{company.CompanyName}}</li>
	   	</ul>
	   	<div v-if="selectedCompanyDetails" class="selectedCompany">
        <p class="congratulations-msg">Congratulations! Your company qualifies so you are are eligible for Preferred Pricing!</p>
	   		<span><span class="detailsLabel">Name: </span>{{selectedCompanyDetails.CompanyName}}</span>	
		   	<span><span class="detailsLabel">Address: </span>{{selectedCompanyDetails.Address}}</span>	
		   	<span><span class="detailsLabel">City: </span>{{selectedCompanyDetails.City}}</span>	
		   	<span><span class="detailsLabel">Province: </span>{{selectedCompanyDetails.Prov}}</span>	
		   	<span><span class="detailsLabel">Postal Code: </span>{{selectedCompanyDetails.PostalCode}}</span>	
	   	</div>
	   	<div class="mandatory-parts">
        <div class="field-wrapper">
  	   		<label for="first_name">Name</label>
  		    <input type="text" name="first_name" v-validate="'required'" data-vv-as="Name" placeholder="Name *" v-model="customer.name" required>
          <span v-show="errors.has('first_name')" class="help is-danger"><i class="icon-info-2" aria-hidden="true"></i>
  {{ errors.first('first_name') }}</span>
        </div>
        <div class="field-wrapper">
  		    <label for="last_name">Last Name</label>
  		    <input type="hidden" name="last_name" placeholder="Last Name *" v-model="customer.name" required>
        </div>
        <div class="field-wrapper">
  		    <label for="email">Email</label>
  		    <input type="email" name="email" v-validate="'required|email'" data-vv-as="Email" placeholder="Email *" v-model="customer.email" required>
          <span v-show="errors.has('email')" class="help is-danger"><i class="icon-info-2" aria-hidden="true"></i>
  {{ errors.first('email') }}</span>
        </div>
        <div class="field-wrapper">
  		    <label for="phone">Phone</label>
  		    <input type="tel" name="phone" v-validate="{ required: true, regex: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/ }" data-vv-as="Phone" placeholder="Phone *" v-model="customer.phone" required>
          <span v-show="errors.has('phone')" class="help is-danger"><i class="icon-info-2" aria-hidden="true"></i>
  {{ errors.first('phone') }}</span>
        </div>
        <div class="field-wrapper">
  		    <label for="comments">Comments</label>	    
  		    <textarea name="comments" placeholder="Comments" v-model="customer.comments"></textarea>
        </div>
	    </div>	
	    <input type="submit" name="Send" value="Get Offer" @click.stop.prevent="submitForm">
	</form>
	<div v-if="formSubmittedWithoutError" class="successMsg">
		<!--[if lte IE 9]>
		  <style>
		    .path {stroke-dasharray: 0 !important;}
		  </style>
		<![endif]-->
		<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
  			<circle class="path circle" fill="none" stroke="#73AF55" stroke-width="6" stroke-miterlimit="10" cx="65.1" cy="65.1" r="62.1"/>
  			<polyline class="path check" fill="none" stroke="#73AF55" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" points="100.2,40.2 51.5,88.8 29.8,67.5 "/>
		</svg><span class="success">Your information has been submitted. Thank You.</span>
	</div>
	<div v-else-if="formSubmittedWithError" class="failureMsg">
		<!--[if lte IE 9]>
		  <style>
		    .path {stroke-dasharray: 0 !important;}
		  </style>
		<![endif]-->
		<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
		  <circle class="path circle" fill="none" stroke="#D06079" stroke-width="6" stroke-miterlimit="10" cx="65.1" cy="65.1" r="62.1"/>
		  <line class="path line" fill="none" stroke="#D06079" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" x1="34.4" y1="37.9" x2="95.8" y2="92.3"/>
		  <line class="path line" fill="none" stroke="#D06079" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" x1="95.8" y1="38" x2="34.4" y2="92.2"/>
		</svg><span class="error">There was an error. Please try again.</span>
	</div>
	<div v-else >
		
	</div>
  </div>
</template>

<script>
import companies from "../companies"

export default { 
    data () {
    return {
      msg: 'Search Company Name',
      customer: {
	      name:"",
	      email: "",
	      phone: "",
	      comments:"",
	      form_name: "ContactUs"
  	  },      
      selectedCompanyDetails: null,
      searchKey: '',
      searchCounter: 0,
      searchHover:false,
      formSubmitted: false,
      formSubmissionError: false,
      companies: companies
    }
  },
  methods:{
  	showCompanies: function(){
  		return this.searchKey.length > 2;
  	},
  	selectedCompany: function(company){
  		this.selectedCompanyDetails = company;  
  		this.searchKey="";
  	},
  	checkIfAnyResult: function(){
  		return this.filteredSearch.length < 1 && this.showCompanies();
  	},
  	searchDown: function(){
  		if(this.searchCounter < this.filteredSearch.length - 1){
  			this.searchCounter++;	
  			document.getElementById("searchHover"+this.searchCounter).focus();
			document.getElementById('searchInputBox').focus();  			
  		}
  	},
  	searchUp: function(){
  		if(this.searchCounter > 0){
  			this.searchCounter--;
  			document.getElementById("searchHover"+this.searchCounter).focus();
			document.getElementById('searchInputBox').focus();		
  		}  		
  	},  	
  	searchSelected: function(){  		
  		document.getElementsByClassName("searchHover")[0].click();
  		this.searchCounter= 0;
  	},  	
  	showSuccsessMsg: function(){
  		this.formSubmitted = true;
  		this.formSubmissionError = false;
  		setTimeout(function(){
  			this.formSubmitted = false,
  			this.formSubmissionError = false;
  			// console.log("Vitore" + this.formSubmitted);
  		}, 4000);
  		// console.log("bahire" + this.formSubmitted);
  	},
  	showErrorMsg: function(){
  		this.formSubmitted = false;
  		this.formSubmissionError = true;
  		setTimeout(function(){
  			this.formSubmitted = false,
  			this.formSubmissionError = false;
  		}, 4000);	
  	},
  	submitForm: function(){  	
  		var qs = require('qs');
  		var self=this;
  		if(self.selectedCompanyDetails !== null && self.customer.name !== "" && self.customer.email !== "" && self.customer.phone !== ""){
  			this.$http.post('https://form.edealer.ca/forms-v3/ThankYouExternal.html?WID=844',qs.stringify({
  			first_name:this.customer.name,
  			last_name:this.customer.name,
  			email:this.customer.email,
  			phone:this.customer.phone,
  			comments:this.customer.comments + '. Company Details:' + this.selectedCompanyDetails.CompanyName + ',' + this.selectedCompanyDetails.Address + ',' + this.selectedCompanyDetails.City + ',' + this.selectedCompanyDetails.Prov + ',' + this.selectedCompanyDetails.PostalCode,
  			form_name: this.customer.form_name
	  		}),{
	  			headers : {
	        		'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
	    		}
			})
  		.then(function(response){
  			if(response.data.status.trim().toLowerCase().indexOf('success') > -1){
  				// console.log("Yahoo");
  				self.customer.name="";
  				self.customer.email="";
  				self.customer.phone="";
  				self.customer.comments="";
  				self.selectedCompanyDetails=null;
  				self.showSuccsessMsg();
  			}else{
  				console.log("There was an error");
  				self.showErrorMsg();
  			}
  		}, function(response){  			
	  			console.log("There was an error");
	  			console.log(response);
	  			self.showErrorMsg();
  			});
  		}  		
  	}
  },
  computed:{
  	 filteredSearch: function () {
		    var self = this
		    return self.companies.filter(function (company) {		      
		      try{
		      	if(self.searchKey.length >= 3){
		      		if(company.CompanyName && self.searchKey){
		      			return company.CompanyName.toLowerCase().indexOf(self.searchKey.toLowerCase()) > -1;	
		      		}		      		
		      	}		      			      	
		      }
		      catch(err){
		      	console.log(err);
		      }
		    })
	 },
	 formSubmittedWithoutError: function(){
  		if(this.formSubmitted && !this.formSubmissionError){
  			return true;
  		}else{
  			return false;
  		}
  	},
  	formSubmittedWithError: function(){
  		if(this.formSubmitted && this.formSubmissionError){
  			return true;
  		}else{
  			return false;
  		}
  	}
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1{
	color:#034c9c;
  font-size: 24px;
}
div.search-box{
	position: relative;
	display: block;
	width: 100%;
	max-width: 600px;
	box-sizing: border-box;
	text-align: center;
	margin:0 auto;
  font-family: 'Yantramanav', sans-serif;
}
div.search-box input{
	width: 100%;	
	padding:10px 20px;
	margin:0;
  font-size: 16px;
	box-sizing: border-box;  

}
div.search-box label{
	text-align: left;
	display: block;
	margin: 0 auto;
	font-size:14px;
	font-weight: 700;
	color:#777;
	padding: 10px 10px 0px 0px;
	display: none;
}
h1{
	text-align: left;
}
ul{
	position: absolute;
	font-size: 0;
	padding: 0;
	margin:0;
	background-color: #f1f1f1;
	border: 1px solid #ccc;
	width: 100%;
	box-sizing: border-box;
	max-height: 270px;
	overflow-y: scroll;
	overflow-x: hidden;
	transition: all linear 200ms;
	-webkit-box-shadow: 2px 2px 8px -2px rgba(0,0,0,0.75);
	-moz-box-shadow: 2px 2px 8px -2px rgba(0,0,0,0.75);
	box-shadow: 2px 2px 8px -2px rgba(0,0,0,0.75);
  z-index: 99;

}
li{
	font-size: 14px;
	padding: 20px 10px;
	cursor: pointer;
  list-style: none;
}
li:nth-child(even){
	background-color: #fff;		
}
li:focus{
	background-color: #034c9c;
	color:#fff;
}
.selectedCompany{
	display: block;
	padding: 10px;
	margin:10px 0 20px;
}
.selectedCompany span{
	display: block;
	text-align: left;
	line-height: 24px;

}
.selectedCompany span.detailsLabel{
	display: inline-block;
	font-weight: 700;
	padding-right: 10px;
}
.search-box .mandatory-parts input, .search-box .mandatory-parts textarea{ 
	display: block;
	width: 100%;
	padding:10px 20px;
	margin:10px auto;
	box-sizing: border-box;
}
.search-box .mandatory-parts textarea{ 
	height: 75px;
  font-size: 16px;
}
.search-box input[type="submit"]{
	/*background-color: #034c9c;*/
  background-color: #47a23b;
	border:none;	
	color:#fff;
	outline: 0;
  -webkit-appearance: none;
   font-size:16px;
   max-width: 200px;
   float: right;
   clear: both;


}
div.search-box .searchHover{
	background-color: #034c9c;
	color:#fff;
	transition: all linear 100ms;
}
div.search-box  .congratulations-msg{
  text-align: left;
    font-size: 16px;
    margin: 0px 0 15px;
    color: #034ca9;
}
.successMsg{
	display: block;
	padding:20px;
	padding:10px;
	margin: 10px auto;
	border:1px solid green;
	transition: all linear 400ms;
}
.failureMsg{
	display: block;
	padding:10px;
	margin: 10px auto;
	border:1px solid red;
	transition: all linear 400ms;
}
div.field-wrapper{
  position: relative;
}
span.help.is-danger {
    color: #ca2b2b;
    font-size: 14px;
  /*  float: right;
    clear: both;
    padding-bottom: 15px;*/
    position: absolute;
    top: 25%;
    right: 10px;
}
/*--------------------------------------*/

svg {
  width: 30px;
    display: inline-block;
    margin: 0 auto;
    padding-right: 15px;
    vertical-align: middle;
}
.path {
  stroke-dasharray: 1000;
  stroke-dashoffset: 0;
}
.path.circle {
  -webkit-animation: dash .9s ease-in-out;
  animation: dash .9s ease-in-out;
}
.path.line {
  stroke-dashoffset: 1000;
  -webkit-animation: dash .9s .35s ease-in-out forwards;
  animation: dash .9s .35s ease-in-out forwards;
}
.path.check {
  stroke-dashoffset: -100;
  -webkit-animation: dash-check .9s .35s ease-in-out forwards;
  animation: dash-check .9s .35s ease-in-out forwards;
}
p {
  text-align: center;
  margin: 20px 0 60px;
  font-size: 1.25em;
}
span.success {
  color: #73AF55;
  display: inline-block;
      font-size: 16px;
    vertical-align: sub;
}
span.error {
  color: #D06079;
  display: inline-block;
      font-size: 16px;
    vertical-align: sub;
}
@-webkit-keyframes dash {
  0% {
    stroke-dashoffset: 1000;
  }
  100% {
    stroke-dashoffset: 0;
  }
}
@keyframes dash {
  0% {
    stroke-dashoffset: 1000;
  }
  100% {
    stroke-dashoffset: 0;
  }
}
@-webkit-keyframes dash-check {
  0% {
    stroke-dashoffset: -100;
  }
  100% {
    stroke-dashoffset: 900;
  }
}
@keyframes dash-check {
  0% {
    stroke-dashoffset: -100;
  }
  100% {
    stroke-dashoffset: 900;
  }
}



</style>
