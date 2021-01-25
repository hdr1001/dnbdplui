// *********************************************************************
//
// JavaScript DOM code related to the D&B Direct+
// Hierarchies & Connections Data Block
//
// JavaScript code file: dplDbHierConn.js
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
//Hierarchies & Connections Data Block
function hcDataAvailability(org, dataAvailability) {
   dataAvailability.corporateLinkage = org.corporateLinkage && !bObjIsEmpty(org.corporateLinkage);

   if(dataAvailability.corporateLinkage) {
      dataAvailability.headQuarter = org.corporateLinkage.headQuarter && !bObjIsEmpty(org.corporateLinkage.headQuarter);

      dataAvailability.parent = org.corporateLinkage.parent && !bObjIsEmpty(org.corporateLinkage.parent);

      dataAvailability.domesticUltimate = org.corporateLinkage.domesticUltimate && !bObjIsEmpty(org.corporateLinkage.domesticUltimate);

      dataAvailability.globalUltimate = org.corporateLinkage.globalUltimate && !bObjIsEmpty(org.corporateLinkage.globalUltimate);
   }
}

//DOM code to convert the Hierarchies & Connections data in a JavaScript
//object so it can be displayed in sections on a regular HTML page
function createHcSections(org, dataAvailability, retDocFrag) {
   let tbl, tbody;

   //Company Information address object conversion
   function getHcAddr(oAddr) {
      let arrAddr = [], str = '';

      if(!oAddr) {return arrAddr}

      //Primary address
      if(oAddr.streetAddress) {
         if(oAddr.streetAddress.line1) {arrAddr.push(oAddr.streetAddress.line1)}
         if(oAddr.streetAddress.line2) {arrAddr.push(oAddr.streetAddress.line2)}
      }

      //Postalcode & city
      if(oAddr.postalCode) {str = oAddr.postalCode}
      if(oAddr.addressLocality) {str.length > 0 ? str += ' ' + oAddr.addressLocality.name : str = oAddr.addressLocality.name}
      if(str.length > 0) {arrAddr.push(str)}

      if(oAddr.addressCountry && oAddr.addressCountry.name) {arrAddr.push(oAddr.addressCountry.name)}

      return arrAddr;
   }

   let arrHierarchySections = [];

   if(dataAvailability.headQuarter) { arrHierarchySections.push({
      title: 'Company HQ', obj: org.corporateLinkage.headQuarter
   }) }

   if(dataAvailability.parent) { arrHierarchySections.push({
      title: 'Parent company', obj: org.corporateLinkage.parent
   }) }

   if(dataAvailability.domesticUltimate) { arrHierarchySections.push({
      title: 'Domestic ultimate', obj: org.corporateLinkage.domesticUltimate
   }) }

   if(dataAvailability.globalUltimate) { arrHierarchySections.push({
      title: 'Global ultimate', obj: org.corporateLinkage.globalUltimate
   }) }

   //Add the relevant hierarchy sections to the page
   arrHierarchySections.forEach(oSection => {
      console.log('Section \"' + oSection.title + '\" will be created');

      tbl = getBasicDBsTbl(oSection.title);
      tbody = tbl.appendChild(document.createElement('tbody'));
      if(oSection.obj.duns) {addBasicDBsTblRow(tbody, 'DUNS', oSection.obj.duns)}
      if(oSection.obj.primaryName) {
         addBasicDBsTblRow(tbody, 'Primary name', oSection.obj.primaryName)
      }
      if(oSection.obj.primaryAddress) {
         addBasicDBsTblRow(tbody, 'Primary address', getHcAddr(oSection.obj.primaryAddress))
      }
      
      retDocFrag.appendChild(tbl);
   });
}
