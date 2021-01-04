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
   let tbl = document.createElement('table');
   let tr = tbl.appendChild(document.createElement('tr'));

   let td = tr.appendChild(document.createElement('td'));
   td.appendChild(document.createTextNode('DUNS: '))

   td = tr.appendChild(document.createElement('td'));
   td.appendChild(document.createTextNode(org.duns ? org.duns : ''));

   tr = tbl.appendChild(document.createElement('tr'));

   td = tr.appendChild(document.createElement('td'));
   td.appendChild(document.createTextNode('Primary name: '))

   td = tr.appendChild(document.createElement('td'));
   td.appendChild(document.createTextNode(org.primaryName ? org.primaryName : ''));

   retDocFrag.appendChild(tbl);

   return retDocFrag;
}
