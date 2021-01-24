// *********************************************************************
//
// JavaScript DOM code for the creation of sections with info
// from the Company Information Data Block
//
// JavaScript code file: dplCiSection.js
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

function createCiSections(org, dataAvailability, retDocFrag) {
   let tbl, tbody;

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
      if(dataAvailability.controlOwnershipType) {
         addBasicDBsTblRow(tbody, 'Ownership type', org.controlOwnershipType.description) //Level 2
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

   //Add industry codes to the page for Company Information level 2
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
}
