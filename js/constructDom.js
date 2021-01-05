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
      let tbl = document.createElement('table');
      const thead = tbl.appendChild(document.createElement('thead'));
      const tr = thead.appendChild(document.createElement('tr'));
      const th = tr.appendChild(document.createElement('th'));

      th.appendChild(document.createTextNode(title));
      th.setAttribute('colspan', 2)

      return tbl;
   }

   function addBasicDBsTblRow(tbody, rowLabel, rowContent) {
      if(!rowContent) { return }

      let tr = tbody.appendChild(document.createElement('tr'));

      let td = tr.appendChild(document.createElement('td'));
      td.appendChild(document.createTextNode(rowLabel));

      td = tr.appendChild(document.createElement('td'));
      td.appendChild(document.createTextNode(rowContent ? rowContent : ''));
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

   //Add the Direct+ request details to the page
   let tbl = getBasicDBsTbl('Inquiry details');
   let tbody = tbl.appendChild(document.createElement('tbody'));
   addBasicDBsTblRow(tbody, 'DUNS', oDBs.inquiryDetail.duns);
   addBasicDBsTblRow(tbody, 'Data blocks', oDBs.inquiryDetail.blockIDs[0]);
   addBasicDBsTblRow(tbody, 'Trade up', oDBs.inquiryDetail.tradeUp);
   addBasicDBsTblRow(tbody, 'Reference', oDBs.inquiryDetail.customerReference);

   retDocFrag.appendChild(tbl);

   //Add the DUNS and the primary name to the page
   tbl = getBasicDBsTbl('DUNS & Name');
   tbody = tbl.appendChild(document.createElement('tbody'));
   addBasicDBsTblRow(tbody, 'DUNS', org.duns);
   addBasicDBsTblRow(tbody, 'Primary name', org.primaryName);

   retDocFrag.appendChild(tbl);

   return retDocFrag;
}
