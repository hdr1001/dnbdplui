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
