// *********************************************************************
//
// JavaScript DOM code for an example UI for D&B D+ Data Blocks
// JavaScript code file: constructDom.js
//
// Copyright 2021 Hans de Rooij
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//       http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
// either express or implied. See the License for the specific
// language governing permissions and limitations under the
// License.
//
// *********************************************************************

//Create a document fragement based on the D&B Direct+ Data Block passed in
function getDBsDocFrag(oDBs) {
   //Create a table for displaying basic data block data
   function getBasicDBsTbl(title) {
      const tbl = document.createElement('table');
      tbl.setAttribute('class', 'dnbDplDBsSection')

      const tblCapt = tbl.appendChild(document.createElement('caption'));
      tblCapt.appendChild(document.createTextNode(title));

      return tbl;
   }

   //Add a row (or rows) to a basic data block data table
   function addBasicDBsTblRow(tbody, rowLabel, rowContent) {
      const bLabelIsArray = Array.isArray(rowLabel);
      const bContentIsArray = Array.isArray(rowContent);

      //Skip if no content available or empty array
      if(!rowContent || (bContentIsArray && rowContent.length === 0)) {
         console.log('No content available for ' + rowLabel); return;
      }

      let tr = tbody.appendChild(document.createElement('tr'));

      let td, th = tr.appendChild(document.createElement('th'));
      if(bLabelIsArray) {
         rowLabel.forEach((lbl, idx) => {
            th.appendChild(document.createTextNode(lbl));
            if(idx < rowLabel.length - 1) {
               th.appendChild(document.createElement('br'))
            }
         })
      }
      else {
         th.appendChild(document.createTextNode(rowLabel));
      }

      if(bContentIsArray) { //Multiple values
         let tdMultRow;

         rowContent.forEach((arrElem, idx) => {
            let tdMultRow;

            if(idx > 0) {
               tr = tbody.appendChild(document.createElement('tr'));
               th.setAttribute('rowspan', idx + 1);
            }

            tdMultRow = tr.appendChild(document.createElement('td'));
            tdMultRow.appendChild(document.createTextNode(arrElem));
         });
      }
      else { //Single value
         td = tr.appendChild(document.createElement('td'));
         td.appendChild(document.createTextNode(rowContent ? rowContent : ''));
      }

      tr.setAttribute('class', 'bottomRow');
   }

   const dplReq = oDBs.inquiryDetail;

   //Escape if the request details are not available on the JSON returned
   if(!dplReq) {
      console.log('Data block without request details info, escaping from getDBsDocFrag');
      return null;
   }

   const dplDataBlocks = oDBs.inquiryDetail.blockIDs;

   //Escape if the blockIDs property is not available on the JSON returned
   if(!dplDataBlocks) {
      console.log('Data block without blockIDs property info, escaping from getDBsDocFrag');
      return null;
   }

   //Parse the information contained in property blockIDs
   oDBs.dbArr = dplDataBlocks.map(dbID => {
      let oRet = {};

      splitBlockIDs = dbID.split('_');

      oRet.name = splitBlockIDs[0];
      oRet.level = parseInt(splitBlockIDs[1].slice(-1), 10);
      oRet.version = splitBlockIDs[2];

      return oRet;
   });
   
   const org = oDBs.organization;

   //Escape if no organization property is available in the data block object
   if(!org) {
      console.log('Data block without organization property, escaping from getDBsDocFrag');
      return null;
   }

   const retDocFrag = document.createDocumentFragment();

   //Escape if no document fragment can be created
   if(!retDocFrag) {
      console.log('Something went wrong instantiating a new document fragment');
      return null;
   }

   //All systems go ➡️ let's create a document fragment based on the data block info
   const dbCompanyInfo = oDBs.dbArr.find(aDB => aDB.name === 'companyinfo')

   //First check actual data availability
   let dataAvailability = {};

   if(dbCompanyInfo) {
      org.duns ? dataAvailability.duns = true : dataAvailability.duns = false;
      org.primaryName ? dataAvailability.primaryName = true : dataAvailability.primaryName = false;
   
      dataAvailability.tradeStyleNames = org.tradeStyleNames && org.tradeStyleNames.length > 0;
   
      dataAvailability.dunsControlStatus = org.dunsControlStatus && !bObjIsEmpty(org.dunsControlStatus);
      dataAvailability.operatingStatus = dataAvailability.dunsControlStatus && org.dunsControlStatus.operatingStatus
                                             && !bObjIsEmpty(org.dunsControlStatus.operatingStatus);
   
      dataAvailability.primaryAddress = org.primaryAddress && !bObjIsEmpty(org.primaryAddress);
   
      dataAvailability.telephone = org.telephone && org.telephone.length > 0;
   
      dataAvailability.websiteAddress = org.websiteAddress && org.websiteAddress.length > 0;
   
      dataAvailability.email = org.email && org.email.length > 0;
   
      dataAvailability.registrationNumbers = org.registrationNumbers && org.registrationNumbers.length > 0;
   
      dataAvailability.activities = org.activities && org.activities.length > 0;
   
      dataAvailability.primaryIndustryCode = org.primaryIndustryCode && !bObjIsEmpty(org.primaryIndustryCode);
   
      dataAvailability.stockExchanges = org.stockExchanges && org.stockExchanges.length > 0;

      if(dbCompanyInfo.level === 2) {
         org.registeredName ? dataAvailability.registeredName = true : dataAvailability.registeredName = false;

         dataAvailability.businessEntityType = org.businessEntityType 
                                                   && org.businessEntityType.description;

         dataAvailability.legalForm = org.legalForm && org.legalForm.description;

         dataAvailability.registeredDetails = org.registeredDetails
                                                   && org.registeredDetails.legalForm
                                                   && org.registeredDetails.legalForm.description;

         org.startDate ? dataAvailability.startDate = true : dataAvailability.startDate = false;

         org.incorporatedDate ? dataAvailability.incorporatedDate = true : dataAvailability.incorporatedDate = false;

         dataAvailability.registeredAddress = org.registeredAddress && !bObjIsEmpty(org.registeredAddress);

         dataAvailability.mailingAddress = org.mailingAddress && !bObjIsEmpty(org.mailingAddress);

         dataAvailability.financials = org.financials && org.financials.length > 0;

         dataAvailability.organizationSizeCategory = org.organizationSizeCategory 
                                                         && org.organizationSizeCategory.description;

         dataAvailability.numberOfEmployees = org.numberOfEmployees && org.numberOfEmployees.length > 0;

         dataAvailability.isStandalone = typeof org.isStandalone === 'boolean';

         dataAvailability.industryCodes = org.industryCodes && org.industryCodes.length > 0;
      }
   }

   //Log the data availability
   console.log('\nAvailable data');
   Object.keys(dataAvailability)
      .filter(sKey => dataAvailability[sKey])
      .forEach(sKey => console.log('  ' + sKey));

   console.log('\nMissing data');
   Object.keys(dataAvailability)
      .filter(sKey => !dataAvailability[sKey])
      .forEach(sKey => console.log('  ' + sKey));

   console.log(' ');

   //Add the Direct+ request details to the page
   let tbl = getBasicDBsTbl('Inquiry details');
   let tbody = tbl.appendChild(document.createElement('tbody'));
   addBasicDBsTblRow(tbody, 'DUNS', oDBs.inquiryDetail.duns);
   addBasicDBsTblRow(tbody, 'Data blocks', oDBs.inquiryDetail.blockIDs);
   addBasicDBsTblRow(tbody, 'Trade up', oDBs.inquiryDetail.tradeUp);
   //addBasicDBsTblRow(tbody, 'Reference', oDBs.inquiryDetail.customerReference);

   retDocFrag.appendChild(tbl);

   //Add high level DUNS information to the page
   if(['duns', 'primaryName', 'tradeStyleNames', 'operatingStatus',
          'registeredName', 'businessEntityType', 'legalForm', 
          'registeredDetails', 'startDate', 'incorporatedDate'].some(elem => dataAvailability[elem])) {
      console.log('Section \"General\" will be created');

      tbl = getBasicDBsTbl('General');
      tbody = tbl.appendChild(document.createElement('tbody'));
      if(dataAvailability.duns) {addBasicDBsTblRow(tbody, 'DUNS', org.duns)}
      if(dataAvailability.primaryName) {addBasicDBsTblRow(tbody, 'Primary name', org.primaryName)}
      if(dataAvailability.registeredName) {addBasicDBsTblRow(tbody, 'Registered name', org.registeredName)} //Level 2
      if(dataAvailability.tradeStyleNames) {
         addBasicDBsTblRow(tbody, 'Tradestyle(s)', org.tradeStyleNames.map(oTS => oTS.name))
      }
      if(dataAvailability.businessEntityType) {
         addBasicDBsTblRow(tbody, 'Entity type', org.businessEntityType.description) //Level 2
      }
      if(dataAvailability.legalForm) {
         addBasicDBsTblRow(tbody, 'Legal form', org.legalForm.description) //Level 2
      }
      if(dataAvailability.registeredDetails) {
         addBasicDBsTblRow(tbody, 'Registered as', org.registeredDetails.legalForm.description) //Level 2
      }
      if(dataAvailability.startDate) {
         addBasicDBsTblRow(tbody, 'Start date', org.startDate) //Level 2
      }
      if(dataAvailability.incorporatedDate) {
         addBasicDBsTblRow(tbody, 'Incorp. date', org.incorporatedDate) //Level 2
      }
      if(dataAvailability.operatingStatus) {
         addBasicDBsTblRow(tbody, 'Operating status', org.dunsControlStatus.operatingStatus.description)
      }

      retDocFrag.appendChild(tbl);
   }
   else {
      console.log('No data available for section \"General\", it will not be created');
   }

   //Add address information to the page
   if(['primaryAddress', 'registeredAddress', 'mailingAddress'].some(elem => dataAvailability[elem])) {
      console.log('Section \"Address\" will be created');

      tbl = getBasicDBsTbl('Address');
      tbody = tbl.appendChild(document.createElement('tbody'));
      if(dataAvailability.primaryAddress) {addBasicDBsTblRow(tbody, 'Primary address', getCiAddr(org.primaryAddress))}
      if(dataAvailability.registeredAddress && !(dataAvailability.primaryAddress && org.primaryAddress.isRegisteredAddress)) {
         addBasicDBsTblRow(tbody, 'Registered address', getCiAddr(org.registeredAddress)); //Level 2
      }
      if(dataAvailability.mailingAddress) {addBasicDBsTblRow(tbody, 'Mail address', getCiAddr(org.mailingAddress))} //Level 2

      retDocFrag.appendChild(tbl);
   }
   else {
      console.log('No data available for section \"Address\", it will not be created');
   }

   //Add contact information to the page
   if(['telephone', 'websiteAddress', 'email'].some(elem => dataAvailability[elem])) {
      console.log('Section \"Contact @\" will be created');

      tbl = getBasicDBsTbl('Contact @');
      tbody = tbl.appendChild(document.createElement('tbody'));
      if(dataAvailability.telephone) {
         addBasicDBsTblRow(tbody, 'Telephone', org.telephone.map(oTel => getCiTel(oTel)))
      }
      if(dataAvailability.websiteAddress) {addBasicDBsTblRow(tbody, 'Website', org.websiteAddress.map(oURL => oURL.url))}
      if(dataAvailability.email) {addBasicDBsTblRow(tbody, 'e-mail', org.email.map(oEmail => oEmail.address))}

      retDocFrag.appendChild(tbl);
   }
   else {
      console.log('No data available for section \"Contact @\", it will not be created');
   }

   //Add company size related elements to the page
   if(['financials', 'organizationSizeCategory', 'isStandalone'].some(elem => dataAvailability[elem])) {
      console.log('Section \"Company size\" will be created');

      tbl = getBasicDBsTbl('Company size');
      tbody = tbl.appendChild(document.createElement('tbody'));
      if(dataAvailability.financials) {
         addBasicDBsTblRow(tbody, 'Yearly revenue', getCiYearlyRevenue(org.financials[0])) //Level 2
      }
      if(dataAvailability.numberOfEmployees) {
         org.numberOfEmployees
            .map(oNumEmpl => getCiNumEmpl(oNumEmpl))
            .forEach(oRow => {
               addBasicDBsTblRow(tbody, oRow.label, oRow.sContent) //Level 2
            })
      }
      if(dataAvailability.organizationSizeCategory) {
         addBasicDBsTblRow(tbody, 'Size category', org.organizationSizeCategory.description) //Level 2
      }
      if(dataAvailability.isStandalone) {
         addBasicDBsTblRow(tbody, 'Standalone', org.isStandalone ? 'Yes' : 'No') //Level 2
      }

      retDocFrag.appendChild(tbl);
   }
   else {
      console.log('No data available for section \"Company size\", it will not be created');
   }

   //Add registration number(s) to the page
   if(dataAvailability.registrationNumbers) {
      console.log('Section \"Registration number(s)\" will be created');

      tbl = getBasicDBsTbl('Registration number(s)');
      tbody = tbl.appendChild(document.createElement('tbody'));
      org.registrationNumbers.forEach(oRegNum => {
         addBasicDBsTblRow(tbody, getDescNoCountryCode(oRegNum.typeDescription), oRegNum.registrationNumber)
      });

      retDocFrag.appendChild(tbl);
   }
   else {
      console.log('No data available for section \"Registration number(s)\", it will not be created');
   }

   //Add listed activities to the page
   if(dataAvailability.activities) {
      console.log('Section \"Business operations\" will be created');

      tbl = getBasicDBsTbl('Business operations');
      tbody = tbl.appendChild(document.createElement('tbody'));
      org.activities.forEach(oAct => {
         addBasicDBsTblRow(tbody, oAct.language.description, oAct.description)
      })

      retDocFrag.appendChild(tbl);
   }
   else {
      console.log('No data available for section \"Business operations\", it will not be created');
   }

   //Add primary SIC activity code to the page
   if(dataAvailability.primaryIndustryCode && !dataAvailability.industryCodes) {
      console.log('Section \"Primary (SIC) activity code\" will be created');

      tbl = getBasicDBsTbl('Primary (SIC) activity code');
      tbody = tbl.appendChild(document.createElement('tbody'));
      addBasicDBsTblRow(tbody, org.primaryIndustryCode.usSicV4, org.primaryIndustryCode.usSicV4Description)

      retDocFrag.appendChild(tbl);
   }
   else {
      if(!dataAvailability.primaryIndustryCode) {
         console.log('No data available for section \"Primary (SIC) activity code\", it will not be created');
      }
      else {
         console.log('Industry codes available, section \"Primary (SIC) activity code\" will not be created');
      }
   }

   if(dataAvailability.industryCodes) {
      console.log('Section \"Activity code\" will be created');

      tbl = getBasicDBsTbl('Activity codes');
      tbody = tbl.appendChild(document.createElement('tbody'));

      addActCodeTblRows(tbody, org.industryCodes); //Level 2

      retDocFrag.appendChild(tbl);
   }
   else {
      console.log('No data available for section \"Activity codes\", it will not be created');
   }

   //Add stock exchange listing(s) to the page
   if(dataAvailability.stockExchanges) {
      console.log('Section \"Stock exchange(s)\" will be created');

      tbl = getBasicDBsTbl('Stock exchange(s)');
      tbody = tbl.appendChild(document.createElement('tbody'));
      addBasicDBsTblRow(tbody, 'Stock exchanges', org.stockExchanges.map(oStkExch => oStkExch.tickerName))
      
      retDocFrag.appendChild(tbl);
   }
   else {
      console.log('No data available for section \"Stock exchange(s)\", it will not be created');
   }

   return retDocFrag;
}
