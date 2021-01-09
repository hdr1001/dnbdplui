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
      const bContentIsArray = Array.isArray(rowContent);

      //Skip if no content available or empty array
      if(!rowContent || (bContentIsArray && rowContent.length === 0)) {
         console.log('No content available for ' + rowLabel); return;
      }

      let tr = tbody.appendChild(document.createElement('tr'));

      let td, th = tr.appendChild(document.createElement('th'));
      th.appendChild(document.createTextNode(rowLabel));

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

   //Check section availability
   let bNameAddr = false;
   if(org.primaryName || 
         (org.tradeStyleNames && org.tradeStyleNames.length > 0) ||
         (org.primaryAddress && org.primaryAddress.language)) {

      console.log('Name & address information available');
      bNameAddr = true;
   }

   let bAddContactAt = false;
   if((org.telephone && org.telephone.length > 0 && org.telephone[0].telephoneNumber) ||
         (org.websiteAddress && org.websiteAddress.length > 0) || 
         (org.email && org.email.length > 0)) {

      console.log('Contact information available');
      bAddContactAt = true;
   }

   //Add the Direct+ request details to the page
   let tbl = getBasicDBsTbl('Inquiry details');
   let tbody = tbl.appendChild(document.createElement('tbody'));
   addBasicDBsTblRow(tbody, 'DUNS', oDBs.inquiryDetail.duns);
   addBasicDBsTblRow(tbody, 'Data blocks', oDBs.inquiryDetail.blockIDs);
   addBasicDBsTblRow(tbody, 'Trade up', oDBs.inquiryDetail.tradeUp);
   addBasicDBsTblRow(tbody, 'Reference', oDBs.inquiryDetail.customerReference);

   retDocFrag.appendChild(tbl);

   //Add the DUNS and the primary name to the page
   if(bNameAddr) {
      tbl = getBasicDBsTbl('Name & address');
      tbody = tbl.appendChild(document.createElement('tbody'));
      if(org.primaryName) {addBasicDBsTblRow(tbody, 'Primary name', org.primaryName)}
      if(org.tradeStyleNames && org.tradeStyleNames.length > 0) {
         addBasicDBsTblRow(tbody, 'Tradestyle(s)', org.tradeStyleNames.map(oTS => oTS.name))
      }
      if(org.primaryAddress && org.primaryAddress.language) {
         addBasicDBsTblRow(tbody, 'Primary address', getCiAddr(org.primaryAddress))
      }

      retDocFrag.appendChild(tbl);
   }

   //Add contact information to the page
   if(bAddContactAt) {
      tbl = getBasicDBsTbl('Contact @');
      tbody = tbl.appendChild(document.createElement('tbody'));
      if(org.telephone && org.telephone.length > 0 && org.telephone[0].telephoneNumber) {
         addBasicDBsTblRow(tbody, 'Telephone', org.telephone.map(oTel => getCiTel(oTel)))
      }
      if(org.websiteAddress) {addBasicDBsTblRow(tbody, 'Website', org.websiteAddress.map(oURL => oURL.url))}
      if(org.email) {addBasicDBsTblRow(tbody, 'e-mail', org.email.map(oEmail => oEmail.address))}

      retDocFrag.appendChild(tbl);
   }

   return retDocFrag;
}
