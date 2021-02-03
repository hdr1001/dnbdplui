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
function pcDataAvailability(org, dataAvailability) {
   dataAvailability.mostSeniorPrincipals = org.mostSeniorPrincipals && org.mostSeniorPrincipals.length > 0;

   if(dataAvailability.blockIDs.principalscontacts.level > 1) { //Level 2 & higher
      dataAvailability.principalsSummary = org.principalsSummary && !bObjIsEmpty(org.principalsSummary);

      dataAvailability.currentPrincipals = org.currentPrincipals && org.currentPrincipals.length > 0;
   }
}

//DOM code to convert the principals & contacts data in a JavaScript
//object so it can be displayed in sections on a regular HTML page
function createPcSections(org, dataAvailability, retDocFrag) {
   let tbl, tbody;

   //Log principal data availability availability
   function logPrincipalDataAvailability(oPrincipal, oPDA, dbLevel) {
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
   
      console.log((oPDA.namePrefix ? 'A name prefix' : 'No name prefix') + sMsg);
      console.log((oPDA.nameSuffix ? 'A name suffix' : 'No name suffix') + sMsg);

      console.log((oPDA.gender ? 'Gender' : 'No gender') + sMsg);

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

      if(dbLevel > 2) {
         console.log((oPDA.subjectType ? 'A subject type' : 'No subject type') + sMsg);

         console.log((oPDA.birthDate ? 'Date of birth' : 'No date of birth') + sMsg);

         console.log((oPDA.nationality ? 'Nationality' : 'No nationality') + sMsg);

         console.log((oPDA.responsibleAreas ? 'Areas' : 'No areas') + ' of responsibility available');
      }

      console.log();
   }

   //Record principal data availability availability
   function principalDataAvailability(oPrincipal, dbLevel) {
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

      //Level 3 elements
      if(dbLevel > 2) {
         oPrinDataAvail.subjectType = oPrincipal.subjectType && oPrincipal.subjectType.length > 0;

         oPrinDataAvail.birthDate = oPrincipal.birthDate && oPrincipal.birthDate.length > 0;

         oPrinDataAvail.nationality = oPrincipal.nationality && oPrincipal.nationality.name;

         oPrinDataAvail.responsibleAreas = oPrincipal.responsibleAreas && 
                                                oPrincipal.responsibleAreas.length > 0;
      }

      logPrincipalDataAvailability(oPrincipal, oPrinDataAvail, dbLevel);

      return oPrinDataAvail;
   }

   //Convert principal data to HTML table
   function principalToDOM(mostSenior, dbLevel, oPrincipal) {
      console.log('Section \"Principal\" will be created');

      //Determine data availability for the principal passed in
      let oPDA = principalDataAvailability(oPrincipal, dbLevel);

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

      if(oPDA.subjectType && oPrincipal.subjectType !== 'Individuals') { //Level 3 & higher
         addBasicDBsTblRow(tbody, 'Subject type', 'Legal entity')
      }

      if(oPDA.namePrefix) { addBasicDBsTblRow(tbody, 'Name prefix', oPrincipal.namePrefix) }
      if(oPDA.nameSuffix) { addBasicDBsTblRow(tbody, 'Name suffix', oPrincipal.nameSuffix) }

      if(oPDA.gender) { addBasicDBsTblRow(tbody, 'Gender', oPrincipal.gender.description) }

      if(oPDA.birthDate) { addBasicDBsTblRow(tbody, 'Date of birth', oPrincipal.birthDate) } //Level 3 & higher

      if(oPDA.nationality) { addBasicDBsTblRow(tbody, 'Nationality', oPrincipal.nationality.name) } //Level 3 & higher

      if(oPDA.jobTitles) { addBasicDBsTblRow(tbody, 'Job title(s)', oPrincipal.jobTitles.map(oJT => oJT.title)) }

      if(oPDA.managementResponsibilities) {
         addBasicDBsTblRow(tbody, 'Mngmt responsibilities', oPrincipal.managementResponsibilities.map(oMR => oMR.description))
      }

      if(oPDA.responsibleAreas) { //Level 3 & higher
         addBasicDBsTblRow(tbody, 'Areas of responsibility', oPrincipal.responsibleAreas.map(oAR => oAR.description))
      }

      if(mostSenior) {
         addBasicDBsTblRow(tbody, 'Most senior?', mostSenior ? 'Yes' : 'No')
      }
   
      retDocFrag.appendChild(tbl);
   }

   //Add a bit of general information about principals
   if(dataAvailability.principalsSummary) { //Level 2 & higher
      console.log('Section \"Principal summary\" will be created');

      tbl = getBasicDBsTbl('Principal summary');
      tbody = tbl.appendChild(document.createElement('tbody'));

      if(typeof org.principalsSummary.currentPrincipalsCount === 'number') {
         addBasicDBsTblRow(tbody, 'Current principals count', org.principalsSummary.currentPrincipalsCount.toString())
      }
      if(typeof org.principalsSummary.otherAssociationsCount === 'number') {
         addBasicDBsTblRow(tbody, 'Other associations count', org.principalsSummary.otherAssociationsCount.toString())
      }
      if(typeof org.principalsSummary.inactiveAssociationsCount === 'number') {
         addBasicDBsTblRow(tbody, 'Inactive associations count', org.principalsSummary.inactiveAssociationsCount.toString())
      }
      if(typeof org.principalsSummary.detrimentalPrincipalsCount === 'number') {
         addBasicDBsTblRow(tbody, 'Detrimental principals count', org.principalsSummary.detrimentalPrincipalsCount.toString())
      }
      if(typeof org.principalsSummary.detrimentalPrincipalsPercentage === 'number') {
         addBasicDBsTblRow(tbody, 'Detrimental principals perc.', org.principalsSummary.detrimentalPrincipalsPercentage + '%')
      }

      retDocFrag.appendChild(tbl);
   }
   else {
      console.log('No data available for section \"Principal summary\", it will not be created');
   }
   
   //Add most senior principal(s) information to the page
   if(dataAvailability.mostSeniorPrincipals) {
      let mostSeniorPrincipalToDOM = principalToDOM.bind(null, true, dataAvailability.blockIDs.principalscontacts.level);
      org.mostSeniorPrincipals.forEach(mostSeniorPrincipalToDOM);
   }

   //Add most senior principal(s) information to the page
   if(dataAvailability.currentPrincipals) { //Level 2 & higher
      let currentPrincipalsToDOM = principalToDOM.bind(null, false, dataAvailability.blockIDs.principalscontacts.level);
      org.currentPrincipals.forEach(currentPrincipalsToDOM);
   }
}
