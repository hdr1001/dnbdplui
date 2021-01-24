// *********************************************************************
//
// JavaScript DOM code for the creation of sections with info
// from the Hierarchies & Connections Data Block
//
// JavaScript code file: dplHcSection.js
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

function createHcSections(org, dataAvailability, retDocFrag) {
   let tbl, tbody;
   
   //Add parent information to the page from hierarchy & connections data block
   if(dataAvailability.parent) {
      console.log('Section \"Parent company\" will be created');

      tbl = getBasicDBsTbl('Parent company');
      tbody = tbl.appendChild(document.createElement('tbody'));
      if(org.corporateLinkage.parent.duns) {addBasicDBsTblRow(tbody, 'DUNS', org.corporateLinkage.parent.duns)}
      if(org.corporateLinkage.parent.primaryName) {
         addBasicDBsTblRow(tbody, 'Primary name', org.corporateLinkage.parent.primaryName)
      }
      if(org.corporateLinkage.parent.primaryAddress) {
         addBasicDBsTblRow(tbody, 'Primary address', getCiAddr(org.corporateLinkage.parent.primaryAddress))
      }
      
      retDocFrag.appendChild(tbl);
   }
   else {
      console.log('No data available for section \"Parent company\", it will not be created');
   }
}
