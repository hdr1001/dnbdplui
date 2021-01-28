// *********************************************************************
//
// JavaScript DOM code related to the D&B Direct+
// Company Information Data Block
//
// JavaScript code file: dplDbCompanyInfo.js
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

//Check for the availability of important properties in the
//Company Information Data Block
function ciDataAvailability(org, dataAvailability, dbLevel) {
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

   if(dbLevel === 2) {
      org.registeredName ? dataAvailability.registeredName = true : dataAvailability.registeredName = false;

      dataAvailability.businessEntityType = org.businessEntityType 
                                                && org.businessEntityType.description;

      dataAvailability.legalForm = org.legalForm && org.legalForm.description;

      dataAvailability.controlOwnershipType = org.controlOwnershipType && !bObjIsEmpty(org.controlOwnershipType);

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

//DOM code to convert the Comapany Information data in a JavaScript
//object so it can be displayed in sections on a regular HTML page
function createCiSections(org, dataAvailability, retDocFrag) {
   let tbl, tbody;

   //Company Information address object conversion
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

      //Remove the Common data section in case a General section is available
      let commonDataTbl = retDocFrag.getElementById('commonData');
      if(commonDataTbl) { commonDataTbl.parentNode.removeChild(commonDataTbl) }
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
