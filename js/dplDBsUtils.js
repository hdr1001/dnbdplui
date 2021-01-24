// *********************************************************************
//
// JavaScript utility code for an example UI for D&B D+ Data Blocks
// JavaScript code file: dplDBsUtils.js
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

//Settings for displaying currency amounts
const oCurrOpts = {
   style: 'currency',
   minimumFractionDigits: 0
};

//Check if an object is an empty object
function bObjIsEmpty(obj) {
   return Object.keys(obj).length === 0 && obj.constructor === Object;
}

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

//Company Info address object conversion
function getCiAddr(oAddr) {
   let arrAddr = [], str = '';

   if(!oAddr) {return arrAddr}

   //Street address
   if(oAddr.streetAddress) {
      if(oAddr.streetAddress.line1) {arrAddr.push(oAddr.streetAddress.line1)}
      if(oAddr.streetAddress.line2) {arrAddr.push(oAddr.streetAddress.line2)}
   }

   //Refer to alternative properties if streetAddress doesn't contain info
   if(arrAddr.length === 0) {
      if(oAddr.streetName) {
         str = oAddr.streetName;
   
         if(oAddr.streetNumber) {
            str += ' ' + oAddr.streetNumber
         }

         arrAddr.push(str);

         str = '';
      }
   }

   //Postalcode & city
   if(oAddr.postalCode) {str = oAddr.postalCode}
   if(oAddr.addressLocality) {str.length > 0 ? str += ' ' + oAddr.addressLocality.name : str = oAddr.addressLocality.name}
   if(str.length > 0) {arrAddr.push(str)}

   if(oAddr.addressCountry && oAddr.addressCountry.name) {arrAddr.push(oAddr.addressCountry.name)}

   if(oAddr.isRegisteredAddress) {
      arrAddr.push('Entity registered at this address');
   }

   return arrAddr;
}

//Company Info telephone object conversion
function getCiTel(oTel) {
   return (oTel.isdCode ? '+' + oTel.isdCode + ' ' : '') + oTel.telephoneNumber
}

//Remove the country code from a description
function getDescNoCountryCode(sDesc) {
   let idx = sDesc.indexOf('(');

   if(idx > -1) {
      if(sDesc.substr(idx + 3, 1) == ')') { //Just checking :-)
         sDesc = sDesc.substr(0, idx - 1);
      }
   }

   return sDesc.trim();
}

//Get yearly revenue number from the financials object
function getCiYearlyRevenue(oFin) {
   let sRet = 'NA';

   if(oFin.yearlyRevenue && oFin.yearlyRevenue[0]) {
      if(oFin.yearlyRevenue[0].value && oFin.yearlyRevenue[0].currency) {
         oCurrOpts.currency =  oFin.yearlyRevenue[0].currency;

         const intlNumFormat = new Intl.NumberFormat('en-us', oCurrOpts);

         sRet = intlNumFormat.format(oFin.yearlyRevenue[0].value)
      }
      else {
         if(oFin.yearlyRevenue[0].value) {
            sRet = oFin.yearlyRevenue[0].value
         }
      }

      if(oFin.reliabilityDnBCode === 9093) {
         sRet += ' (*estimate)'
      }
   }

   return sRet;
}

//Get number of employees figure from object
function getCiNumEmpl(oNumEmpl) {
   const sLabel = 'Number of Employees';

   let oRet = {
      label: sLabel,
      sContent: 'NA'
   };

   if(typeof oNumEmpl.value === 'number') {oRet.sContent = oNumEmpl.value.toString()}

   let sLabelAdd = '';
   if(oNumEmpl.informationScopeDescription) {sLabelAdd = oNumEmpl.informationScopeDescription}

   if(oNumEmpl.reliabilityDescription && sLabelAdd) {
      sLabelAdd += ' & ' + oNumEmpl.reliabilityDescription;
   }
   else if(oNumEmpl.reliabilityDescription) {
      sLabelAdd = oNumEmpl.reliabilityDescription;
   }

   if(sLabelAdd) {
      oRet.label = [];
      oRet.label.push(sLabel);
      oRet.label.push(sLabelAdd);
   }

   return oRet;
}

//Add rows to the activity row table
function addActCodeTblRows(tbody, arrIndustryCodes) {
   let tr, th, td;

   //Deduplicate the industry code type codes
   let arrUniqueActCodeTypes = [];
   
   arrIndustryCodes.forEach(oIndustryCode => {
      if(!arrUniqueActCodeTypes.find(elem => elem.typeDnBCode === oIndustryCode.typeDnBCode)) {
         arrUniqueActCodeTypes.push({
            typeDnBCode: oIndustryCode.typeDnBCode,
            typeDescription: oIndustryCode.typeDescription
         })
      }
   });

   //Create a type code select and a table header row 
   tr = tbody.appendChild(document.createElement('tr'));
   td = tr.appendChild(document.createElement('td'));
   td.setAttribute('colspan', '2');
   let opt, selectActType = td.appendChild(document.createElement('select'));

   arrUniqueActCodeTypes.forEach(oActType => {
      opt = selectActType.appendChild(document.createElement('option'));
      opt.setAttribute('value', oActType.typeDnBCode.toString());
      opt.appendChild(document.createTextNode(oActType.typeDescription));
   })

   tr = tbody.appendChild(document.createElement('tr'));
   th = tr.appendChild(document.createElement('th'));
   th.appendChild(document.createTextNode('Code'));
   th = tr.appendChild(document.createElement('th'));
   th.appendChild(document.createTextNode('Description'));

   //Add the individual industry codes on table rows
   arrIndustryCodes.forEach(oIndsCode => {
      tr = tbody.appendChild(document.createElement('tr'));
      tr.setAttribute('class', 'industryCodeRow ' + oIndsCode.typeDnBCode);

      td = tr.appendChild(document.createElement('td'));
      td.appendChild(document.createTextNode(oIndsCode.code));

      td = tr.appendChild(document.createElement('td'));
      td.appendChild(document.createTextNode(oIndsCode.description));
   });

   //Add an onChange eventhandler to the select control
   selectActType.addEventListener('change', event => {
      tbody.querySelectorAll('tr.industryCodeRow').forEach(rowIndustryCode => {
         if(rowIndustryCode.classList.contains(selectActType.value)) {
            rowIndustryCode.style.display = 'table-row';
         }
         else {
            rowIndustryCode.style.display = 'none';
         }
      })
   });

   //Trigger the select component change event
   selectActType.dispatchEvent(new Event('change'));
}
