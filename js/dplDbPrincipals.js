// *********************************************************************
//
// JavaScript DOM code related to the D&B Direct+
// Principals & Contacts Data Block
//
// JavaScript code file: dplDbPrincipals.js
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
//Principals & Contacts Data Block
function pcDataAvailability(org, dataAvailability, dbLevel) {
   dataAvailability.mostSeniorPrincipals = org.mostSeniorPrincipals && org.mostSeniorPrincipals.length > 0;
}

//DOM code to convert the principals & contacts data in a JavaScript
//object so it can be displayed in sections on a regular HTML page
function createPcSections(org, dataAvailability, retDocFrag) {
   let tbl, tbody;

   //Log principal data availability availability
   function logPrincipalDataAvailability(oPrincipal, oPDA) {
      if(oPDA.fullName) {
         console.log('Data availability for principal ' + oPrincipal.fullName)
      }
      else if(oPDA.familyName) {
         console.log('Data availability for principal ' + oPrincipal.familyName)
      }
      else {
         console.log('No name information available!')
      }

      console.log('Name component count ' + oPDA.nameComponentCount);

      let sMsg = ' is available';
   
      console.log(oPDA.namePrefix ? 'A name prefix' : 'No name prefix' + sMsg);
      console.log(oPDA.nameSuffix ? 'A name suffix' : 'No name suffix' + sMsg);

      console.log(oPDA.gender ? 'Gender' : 'No gender' + sMsg);

      if(oPDA.jobTitles) {
         console.log('Job title count is ' + oPrincipal.jobTitles.length)
      }
      else {
         console.log('No job title(s) available')
      }

      if(oPDA.managementResponsibilities) {
         console.log('Mngmt responsibilities count is ' + oPrincipal.managementResponsibilities.length)
      }
      else {
         console.log('No Mngmt responsibilities available')
      }

      if(oPDA.idNumbers) {
         console.log('ID count is ' + oPrincipal.idNumbers.length)
      }
      else {
         console.log('No IDs available for the principal')
      }

      console.log();
   }

   //Record principal data availability availability
   function principalDataAvailability(oPrincipal) {
      let oPrinDataAvail = {};

      //Property fullName
      oPrinDataAvail.fullName = Boolean(oPrincipal.fullName);

      //Name components
      let count = 0;
      if(oPrinDataAvail.givenName = Boolean(oPrincipal.givenName)) { count++ }
      if(oPrinDataAvail.middleName = Boolean(oPrincipal.middleName)) { count++ }
      if(oPrinDataAvail.familyName = Boolean(oPrincipal.familyName)) { count++ }

      oPrinDataAvail.nameComponentCount = count;

      //Additional name information
      oPrinDataAvail.namePrefix = Boolean(oPrincipal.namePrefix);
      oPrinDataAvail.nameSuffix = Boolean(oPrincipal.nameSuffix);

      //Gender
      oPrinDataAvail.gender = oPrincipal.gender && !bObjIsEmpty(oPrincipal.gender);

      //Job titles, management responsibilities & IDs
      oPrinDataAvail.jobTitles = oPrincipal.jobTitles && oPrincipal.jobTitles.length > 0;
      oPrinDataAvail.managementResponsibilities = oPrincipal.managementResponsibilities &&
                                                      oPrincipal.managementResponsibilities.length > 0;
      oPrinDataAvail.idNumbers = oPrincipal.idNumbers && oPrincipal.idNumbers.length > 0;

      logPrincipalDataAvailability(oPrincipal, oPrinDataAvail);

      return oPrinDataAvail;
   }

   //Convert principal data to HTML table
   function principalToDOM(mostSenior, oPrincipal) {
      console.log('Section \"Principal\" will be created');

      //Determine data availability for the principal passed in
      let oPDA = principalDataAvailability(oPrincipal);

      tbl = getBasicDBsTbl('Principal');
      tbody = tbl.appendChild(document.createElement('tbody'));

      if(oPDA.fullName) {
         addBasicDBsTblRow(tbody, 'Full name', oPrincipal.fullName)
      }
      else if(oPDA.nameComponentCount > 0) {
         let sFullName = '';

         if(oPDA.givenName) { sFullName += oPrincipal.givenName + ' '}
         if(oPDA.middleName) { sFullName += oPrincipal.middleName + ' '}
         if(oPDA.familyName) { sFullName += oPrincipal.familyName + ' '}

         addBasicDBsTblRow(tbody, 'Full name', sFullName)
      }

      if(oPDA.namePrefix) { addBasicDBsTblRow(tbody, 'Name prefix', oPrincipal.namePrefix) }
      if(oPDA.nameSuffix) { addBasicDBsTblRow(tbody, 'Name suffix', oPrincipal.nameSuffix) }

      if(oPDA.gender) { addBasicDBsTblRow(tbody, 'Gender', oPrincipal.gender.description) }

      if(oPDA.jobTitles) { addBasicDBsTblRow(tbody, 'Job title(s)', oPrincipal.jobTitles.map(oJT => oJT.title)) }

      if(oPDA.managementResponsibilities) {
         addBasicDBsTblRow(tbody, 'Mngmt responsibilities', oPrincipal.managementResponsibilities.map(oMR => oMR.description))
      }

      if(typeof mostSenior === 'boolean') {
         addBasicDBsTblRow(tbody, 'Is most senior?', mostSenior ? 'Yes' : 'No')
      }
   
      retDocFrag.appendChild(tbl);
   }

   //Add most senior principal(s) information to the page
   if(dataAvailability.mostSeniorPrincipals) {
      let mostSeniorPrincipalToDOM = principalToDOM.bind(null, true);

      org.mostSeniorPrincipals.forEach(mostSeniorPrincipalToDOM)
   }
}
