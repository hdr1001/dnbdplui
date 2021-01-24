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
   const dplReq = oDBs.inquiryDetail;

   //Escape if the request details are not available on the JSON returned
   if(!dplReq) {
      console.log('Data block without request details info, escaping from getDBsDocFrag');
      return null;
   }

   const dplDataBlocks = oDBs.inquiryDetail.blockIDs;

   //Escape if the blockIDs property is not available on the JSON returned
   if(!dplDataBlocks) {
      console.log('Data block without blockIDs property info, escaping from getDBsDocFrag');
      return null;
   }

   //Parse the information contained in property blockIDs
   oDBs.dbArr = dplDataBlocks.map(dbID => {
      let oRet = {};

      splitBlockIDs = dbID.split('_');

      oRet.name = splitBlockIDs[0];
      oRet.level = parseInt(splitBlockIDs[1].slice(-1), 10);
      oRet.version = splitBlockIDs[2];

      return oRet;
   });
   
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
   const dbCompanyInfo = oDBs.dbArr.find(aDB => aDB.name === 'companyinfo');
   const dbHierarchyConn = oDBs.dbArr.find(aDB => aDB.name === 'hierarchyconnections');

   //First check actual data availability
   let dataAvailability = {};

   if(dbCompanyInfo) { ciDataAvailability(org, dataAvailability, dbCompanyInfo.level) }
   if(dbHierarchyConn) { hcDataAvailability(org, dataAvailability) }

   //Log the data availability
   console.log('\nAvailable data');
   Object.keys(dataAvailability)
      .filter(sKey => dataAvailability[sKey])
      .forEach(sKey => console.log('  ' + sKey));

   console.log('\nMissing data');
   Object.keys(dataAvailability)
      .filter(sKey => !dataAvailability[sKey])
      .forEach(sKey => console.log('  ' + sKey));

   console.log(' ');

   //Add the Direct+ request details to the page
   let tbl = getBasicDBsTbl('Inquiry details');
   let tbody = tbl.appendChild(document.createElement('tbody'));
   addBasicDBsTblRow(tbody, 'DUNS', oDBs.inquiryDetail.duns);
   addBasicDBsTblRow(tbody, 'Data blocks', oDBs.inquiryDetail.blockIDs);
   addBasicDBsTblRow(tbody, 'Trade up', oDBs.inquiryDetail.tradeUp);
   //addBasicDBsTblRow(tbody, 'Reference', oDBs.inquiryDetail.customerReference);

   retDocFrag.appendChild(tbl);

   //Add the sections to the document fragment
   if(dbCompanyInfo) { createCiSections(org, dataAvailability, retDocFrag) }
   if(dbHierarchyConn) { createHcSections(org, dataAvailability, retDocFrag) }

   return retDocFrag;
}
