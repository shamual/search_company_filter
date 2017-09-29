<template>
  <div class="Search search-box">
	    <h1>{{ msg }}</h1>
	    <input type="text" name="search" placeholder="Search For Company" v-model="searchKey" >
		<ul>
	   		<li v-if="checkIfAnyResult()">No Match Found</li>
	   		<li  v-for="company in filteredSearch" v-on:click="selectedCompany(company)" v-else>{{company.CompanyName}}</li>
	   	</ul>
	   	<div v-if="selectedCompanyDetails" class="selectedCompany">
	   		<span><span class="detailsLabel">Name: </span>{{selectedCompanyDetails.CompanyName}}</span>	
		   	<span><span class="detailsLabel">Address: </span>{{selectedCompanyDetails.Address}}</span>	
		   	<span><span class="detailsLabel">City: </span>{{selectedCompanyDetails.City}}</span>	
		   	<span><span class="detailsLabel">Province: </span>{{selectedCompanyDetails.Prov}}</span>	
		   	<span><span class="detailsLabel">Postal Code: </span>{{selectedCompanyDetails.PostalCode}}</span>	
	   	</div>	
	    <input type="text" name="name" placeholder="Name" v-model="name" >
	    <input type="email" name="email" placeholder="Email" v-model="email" >
	    <input type="tel" name="phone" placeholder="Phone" v-model="phone" >


	   	
  </div>
</template>

<script>
import companies from "../companies"
export default { 
    data () {
    return {
      msg: 'Search',
      selectedCompanyDetails: null,
      searchKey: '',
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
	 }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
	padding: 10px 5px;
	margin:0;
	box-sizing: border-box;
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
	max-height: 400px;
	overflow-y: scroll;
	overflow-x: hidden;
	transition: all linear 200ms;
}
li{
	font-size: 14px;
	padding: 20px 10px;
	cursor: pointer;
}
li:nth-child(even){
	background-color: #fff;		
}
.selectedCompany{
	display: block;
	padding: 10px;
	margin-top: 40px;
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
</style>
