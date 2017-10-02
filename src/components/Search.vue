<template>
  <div class="Search search-box">
  	<form action="" name="preferred-pricing-form" id="preferred-pricing-form" method="post" accept-charset="utf-8" enctype="multipart/form-data">
	    <h1>{{ msg }}</h1>
	    <input autocomplete="false" id="searchInputBox" type="text" name="search" placeholder="Start typing the name of the company..." v-model.trim="searchKey" @keydown.down="searchDown" @keydown.up="searchUp" @keydown.enter.stop.prevent="searchSelected">
		<ul>
	   		<li v-if="checkIfAnyResult()">No Match Found</li>
	   		<li  :tabindex="index" :id="'searchHover'+index" v-for="(company,index) in filteredSearch" @click.stop.prevent="selectedCompany(company)" :class="{searchHover:(index == searchCounter)}" v-else >{{company.CompanyName}}</li>
	   	</ul>
	   	<div v-if="selectedCompanyDetails" class="selectedCompany">
	   		<span><span class="detailsLabel">Name: </span>{{selectedCompanyDetails.CompanyName}}</span>	
		   	<span><span class="detailsLabel">Address: </span>{{selectedCompanyDetails.Address}}</span>	
		   	<span><span class="detailsLabel">City: </span>{{selectedCompanyDetails.City}}</span>	
		   	<span><span class="detailsLabel">Province: </span>{{selectedCompanyDetails.Prov}}</span>	
		   	<span><span class="detailsLabel">Postal Code: </span>{{selectedCompanyDetails.PostalCode}}</span>	
	   	</div>
	   	<div class="mandatory-parts">
	   		<label for="first_name">Name</label>
		    <input type="text" name="first_name" placeholder="Name" v-model="customer.name" required>
		    <label for="last_name">Last Name</label>
		    <input type="hidden" name="last_name" placeholder="Last Name" v-model="customer.name" required>
		    <label for="email">Email</label>
		    <input type="email" name="email" placeholder="Email" v-model="customer.email" required>
		    <label for="phone">Phone</label>
		    <input type="tel" name="phone" placeholder="Phone" v-model="customer.phone" required>
		    <label for="comments">Comments</label>	    
		    <textarea name="comments" placeholder="Comments" v-model="customer.comments"></textarea>
	    </div>	
	    <input type="submit" name="Send" value="Send" @click.stop.prevent="submitForm">
	</form>
	<div v-if="formSubmittedWithoutError" class="successMsg">
		Your request has been successfully submitted. Thanks.
	</div>
	<div v-if="formSubmittedWithError" class="failureMsg">
		There was an error. Please try again.
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
      msg: 'Search',
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
  			console.log("Vitore" + this.formSubmitted);
  		}, 4000);

  		console.log("bahire" + this.formSubmitted);
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
  		this.$http.post('https://form.edealer.ca/forms-v3/ThankYouExternal.html?WID=844',qs.stringify({
  			first_name:this.customer.name,
  			last_name:this.customer.name,
  			email:this.customer.email,
  			phone:this.customer.phone,
  			comments:this.customer.comments,
  			form_name: this.customer.form_name

  		}), {
  			headers : {
        		'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
    		}
		})
  		.then(function(response){
  			if(response.data.status.trim().toLowerCase().indexOf('success') > -1){
  				console.log("Yahoo");
  				self.customer.name="";
  				self.customer.email="";
  				self.customer.phone="";
  				self.customer.comments="";
  				self.selectedCompanyDetails=null;
  				self.showSuccsessMsg();
  			}else{
  				console.log("There was an error");
  				this.showErrorMsg();
  			}
  		}, function(response){
  			
  			console.log("There was an error");
  			console.log(response);
  			this.showErrorMsg();
  		});
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
}
div.search-box{
	position: relative;
	display: block;
	width: 100%;
	max-width: 600px;
	box-sizing: border-box;
	text-align: center;
	margin:0 auto;
}
div.search-box input{
	width: 100%;	
	padding:10px 20px;
	margin:0;
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

}
li{
	font-size: 14px;
	padding: 20px 10px;
	cursor: pointer;
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
	margin:20px 0;
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
	height: 150px;
}
.search-box input[type="submit"]{
	background-color: #034c9c;
	border:none;	
	color:#fff;
	outline: 0;
}
div.search-box .searchHover{
	background-color: #034c9c;
	color:#fff;
	transition: all linear 100ms;
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
</style>
