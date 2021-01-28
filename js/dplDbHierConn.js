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

   //Different hierarchy levels representing the same DUNS collapse
   let bCollapseLevel1and2 = false, bCollapseLevel2and3 = false;

   if(dataAvailability.headQuarter && dataAvailability.domesticUltimate && 
         org.corporateLinkage.headQuarter.duns === org.corporateLinkage.domesticUltimate.duns) {

      bCollapseLevel1and2 = true;
   }

   if(dataAvailability.parent && dataAvailability.domesticUltimate && 
         org.corporateLinkage.parent.duns === org.corporateLinkage.domesticUltimate.duns) {

      bCollapseLevel1and2 = true;
   }

   if(dataAvailability.domesticUltimate && dataAvailability.globalUltimate && 
         org.corporateLinkage.domesticUltimate.duns === org.corporateLinkage.globalUltimate.duns) {

      bCollapseLevel2and3 = true;
   }

   //Define the hierarchy sections which will be shown on screen 
   let arrHierarchySections = [];

   if(bCollapseLevel1and2 && bCollapseLevel2and3) {
      if(dataAvailability.headQuarter) {
         arrHierarchySections.push({title: 'HQ & domestic & global ultimate', obj: org.corporateLinkage.globalUltimate})
      }
      else {
         arrHierarchySections.push({title: 'Parent & domestic & global ultimate', obj: org.corporateLinkage.globalUltimate})
      }
   }
   else if(bCollapseLevel1and2) {
      if(dataAvailability.headQuarter) {
         arrHierarchySections.push({title: 'Company HQ & domestic ultimate', obj: org.corporateLinkage.domesticUltimate});
         arrHierarchySections.push({title: 'Global ultimate', obj: org.corporateLinkage.globalUltimate});
      }
      else {
         arrHierarchySections.push({title: 'Parent company & domestic ultimate', obj: org.corporateLinkage.domesticUltimate});
         arrHierarchySections.push({title: 'Global ultimate', obj: org.corporateLinkage.globalUltimate});
      }
   }
   else if(bCollapseLevel2and3) {
      if(dataAvailability.headQuarter) {
         arrHierarchySections.push({title: 'Company HQ', obj: org.corporateLinkage.headQuarter})
      }
      else {
         arrHierarchySections.push({title: 'Parent company', obj: org.corporateLinkage.parent})
      }
      arrHierarchySections.push({title: 'Domestic & global ultimate', obj: org.corporateLinkage.globalUltimate})
   }
   else if(dataAvailability.corporateLinkage) {
      if(dataAvailability.headQuarter) {
         arrHierarchySections.push({title: 'Company HQ', obj: org.corporateLinkage.headQuarter})
      }
      else {
         arrHierarchySections.push({title: 'Parent company', obj: org.corporateLinkage.parent})
      }
      arrHierarchySections.push({title: 'Domestic ultimate', obj: org.corporateLinkage.domesticUltimate});
      arrHierarchySections.push({title: 'Global ultimate', obj: org.corporateLinkage.globalUltimate});
   }
   else {
      console.log('No corporate linkage available, no sections will be displayed');
   }

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
