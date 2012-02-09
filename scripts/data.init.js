var config = new Kido("local").config();
var countries = new Kido("local").storage().objectSet("countries");
var timeReports = new Kido("local").storage().objectSet("timeReports");
var expenseTypes = new Kido("local").storage().objectSet("expenseTypes");
var expenses = new Kido("local").storage().objectSet("local");
var projects = new Kido("local").storage().objectSet("projects");

countries.drop();
timeReports.drop();
expenseTypes.drop();
projects.drop();
expenses.drop();

config.set("smtpto", "jesus.rodriguez@tellago.com");
config.set("smtpfrom", "jesus.rodriguez@tellago.com");

projects.insert({Code:'132344',Description:'Kido'});
projects.insert({Code:'234234',Description:'Blue Green'});
projects.insert({Code:'345345',Description:'Azure Service Bus'});

countries.insert({Code:'US',Description:'United States',CurrencyCode:'USD',CurrencyDecimalPlaces:'2'});
countries.insert({Code:'UK',Description:'United Kindom',CurrencyCode:'$',CurrencyDecimalPlaces:'2'});
countries.insert({Code:'FI',Description:'Finland',CurrencyCode:'$',CurrencyDecimalPlaces:'2'});

timeReports.insert({StartDate:new Date('07/16/2012'),EndDate:new Date('07/31/2012'),EnterpriseId:'654987987',PeopleKey:'321654',TimeReportStatus:'draft'});
timeReports.insert({StartDate:new Date('07/01/2012'),EndDate:new Date('07/15/2012'),EnterpriseId:'654987987',PeopleKey:'321654',TimeReportStatus:'draft'});
timeReports.insert({StartDate:new Date('06/16/2012'),EndDate:new Date('06/30/2012'),EnterpriseId:'654987987',PeopleKey:'321654',TimeReportStatus:'draft'});
timeReports.insert({StartDate:new Date('06/01/2012'),EndDate:new Date('06/15/2012'),EnterpriseId:'654987987',PeopleKey:'321654',TimeReportStatus:'draft'});
timeReports.insert({StartDate:new Date('05/16/2012'),EndDate:new Date('05/31/2012'),EnterpriseId:'654987987',PeopleKey:'321654',TimeReportStatus:'draft'});
timeReports.insert({StartDate:new Date('05/01/2012'),EndDate:new Date('05/15/2012'),EnterpriseId:'654987987',PeopleKey:'321654',TimeReportStatus:'draft'});
timeReports.insert({StartDate:new Date('04/16/2012'),EndDate:new Date('04/30/2012'),EnterpriseId:'654987987',PeopleKey:'321654',TimeReportStatus:'draft'});

expenseTypes.insert({Code:'GL28',Description:'Travel - Air',IsMobile:true,RequiresToDate:true,Icon:"images/icons/plane.png",IsQuick:true,
 Fields:[
  {Key:'T2_Reason', DefaultValue:'',DisplayName:'Reason',ReadOnly:false,SequenceNumber:1,Type:'String',
	  ValidValues:[
	  {key:'ANAIOBTO',value:'Airline not available in OBT online'},
	  {key:'LMRCA',value:'Last minute reservation change at airport'},
	  {key:'CRDBP',value:'Client requests different booking procedures'},
	  {key:'other',value:'Other'}]
  },
  {Key:'T2_From', DefaultValue:'',DisplayName:'From',ReadOnly:false,SequenceNumber:2,Type:'String',
	 ValidValues:[]
  },
  {Key:'T2_To', DefaultValue:'',DisplayName:'To',ReadOnly:false,SequenceNumber:3,Type:'String',
	  ValidValues:[]
  },
  {Key:'T2_CommunteType', DefaultValue:'',DisplayName:'Type',ReadOnly:false,SequenceNumber:4,Type:'String',
	  ValidValues:[
	  {key:'1',value:'One-Way'},
	  {key:'2',value:'Round Trip'}]
  },
  {Key:'T2_ClassOfTravel', DefaultValue:'',DisplayName:'Class of Travel',ReadOnly:false,SequenceNumber:5,Type:'String',
	  ValidValues:[
	  {key:'economyCoach',value:'Economy/ Coach'},
	  {key:'business',value:'Business'},
	  {key:'first',value:'First'}]
  }]
});
expenseTypes.insert({Code:'GL23',Description:'Accommodation - Hotel',IsMobile:true,RequiresToDate:true,Icon:"images/icons/hotel.png",IsQuick:true,
 Fields:[
  {Key:'T2_HotelChain', DefaultValue:'',DisplayName:'Hotel Chain',ReadOnly:false,SequenceNumber:1,Type:'String',
	  ValidValues:[
	  {key:'ACHotel',value:'AC Hotel'},
	  {key:'ascott',value:'Ascott'}]
  },
  {Key:'T2_HotelLocation', DefaultValue:'',DisplayName:'Hotel Location',ReadOnly:false,SequenceNumber:2,Type:'String',
	  ValidValues:[]
  }]
});
expenseTypes.insert({Code:'GL25',Description:'KM/Miles Allowance',IsMobile:true,RequiresToDate:true,Icon:"images/icons/travel.png",IsQuick:true,
 Fields:[
  {Key:'T2_Reason', DefaultValue:'',DisplayName:'Reason',ReadOnly:false,SequenceNumber:1,Type:'String',
	  ValidValues:[
	  {key:'homeOffice',value:'Home Home Office'},
	  {key:'homeClient',value:'Home Client Site/Other Office'},
	  {key:'homeAirport',value:'Home Airport'},
	  {key:'entertainment',value:'Entertainment'},
	  {key:'other',value:'Other'}]
  },
  {Key:'T2_NoOfKMMiles', DefaultValue:'',DisplayName:'Miles',ReadOnly:false,SequenceNumber:2,Type:'Decimal',
	  ValidValues:[]
  },
  {Key:'T2_RateFree', DefaultValue:'0',DisplayName:'Rate',ReadOnly:false,SequenceNumber:3,Type:'Decimal',
	  ValidValues:[]
  },
  {Key:'T2_RateReadOnly', DefaultValue:'0.55',DisplayName:'Rate',ReadOnly:true,SequenceNumber:3,Type:'Decimal',
	  ValidValues:[]
  },
  {Key:'T2_AmountPerDay', DefaultValue:'',DisplayName:'Amount Per Day',ReadOnly:true,SequenceNumber:4,Type:'Decimal',
	  ValidValues:[]
  },
  {Key:'T2_DeductNormalCommute', DefaultValue:'',DisplayName:'Deduct Normal Commute',ReadOnly:false,SequenceNumber:5,Type:'Boolean',
	  ValidValues:[]
  },
  {Key:'T2_CommuteType', DefaultValue:'2',DisplayName:'Type',ReadOnly:true,SequenceNumber:6,Type:'String',
	  ValidValues:[
	  {key:'1',value:'One-Way'},
	  {key:'2',value:'Round Trip'}]
  },
  {Key:'T2_CommuteDeductionPerDay', DefaultValue:'',DisplayName:'Deduction Per Day',ReadOnly:true,SequenceNumber:7,Type:'Decimal',
	  ValidValues:[]
  },
  {Key:'T2_NetAmountPerDay', DefaultValue:'',DisplayName:'Net Amount Per Day',ReadOnly:true,SequenceNumber:8,Type:'Decimal',
	  ValidValues:[]
  }]
});
expenseTypes.insert({Code:'GL22',Description:'Car Hire/Rental',IsMobile:true,RequiresToDate:true,Icon:"images/icons/carRental.png",IsQuick:true,
 Fields:[
  {Key:'T2_Reason', DefaultValue:'',DisplayName:'Reason',ReadOnly:false,SequenceNumber:1,Type:'String',DataSource:'carRentalAgency',
	  ValidValues:[
	  {key:'homeOffice',value:'Home Home Office'},
	  {key:'homeClient',value:'Home Client Site/Other Office'},
	  {key:'ClientOffice',value:'Client Site/Other Other/Client Site'},
	  {key:'other',value:'Other'}]
  },
  {Key:'T2_AgencyName', DefaultValue:'',DisplayName:'Agency Name',ReadOnly:false,SequenceNumber:2,Type:'Integer',DataSource:'carRentalAgency',
	  ValidValues:[
	  {key:'alamo',value:'Alamo'},
	  {key:'avis',value:'Avis'},
	  {key:'budget',value:'Budget'},
	  {key:'hertz',value:'Hertz'},
	  {key:'national',value:'National'},
	  {key:'other',value:'Other'},
	  {key:'sixt',value:'Sixt'},
	  {key:'europcar',value:'Europcar'}]
  },
  {Key:'T2_Distance', DefaultValue:'',DisplayName:'Distance(KM/Miles)',ReadOnly:false,SequenceNumber:3,Type:'Integer',DataSource:'carRentalAgency',
	  ValidValues:[]
  }]
});
expenseTypes.insert({Code:'GL21',Description:'Travel - Taxi',IsMobile:true,RequiresToDate:true,Icon:"images/icons/taxi.png",
 Fields:[
  {Key:'T2_Reason', DefaultValue:'',DisplayName:'Reason',ReadOnly:false,SequenceNumber:1,Type:'String',
	  ValidValues:[
	  {key:'homeOffice',value:'Home Home Office'},
	  {key:'homeClient',value:'Home Client Site/Other Office'},
	  {key:'homeAirport',value:'Home Airport'},
	  {key:'entertainment',value:'Entertainment'},
	  {key:'other',value:'Other'}]
  }]
});
expenseTypes.insert({Code:'GL32',Description:'Telecom',IsMobile:true,RequiresToDate:true,Icon:"images/icons/phone.png",
 Fields:[
  {Key:'T2_Type', DefaultValue:'',DisplayName:'Type',ReadOnly:false,SequenceNumber:1,Type:'String',
	  ValidValues:[
	  {key:'hotelPhone',value:'Home Hotel Phone'},
	  {key:'mobilePhone',value:'Mobile Phone'},
	  {key:'landLine',value:'Land Line'},
	  {key:'internet',value:'Internet'},
	  {key:'other',value:'Other'}]
  }]
});
