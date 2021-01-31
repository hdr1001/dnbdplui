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

   //First check actual data availability
   let dataAvailability = {};

   //Parse the information contained in property blockIDs
   dataAvailability.blockIDs = {};

   dplDataBlocks.forEach(dbID => {
      splitBlockIDs = dbID.split('_');

      dataAvailability.blockIDs[splitBlockIDs[0]] = {};
      dataAvailability.blockIDs[splitBlockIDs[0]]['level'] = parseInt(splitBlockIDs[1].slice(-1), 10);
      dataAvailability.blockIDs[splitBlockIDs[0]]['version'] = splitBlockIDs[2];
   });

   //Check for the availability of the common data elements
   org.duns ? dataAvailability.duns = true : dataAvailability.duns = false;
   org.primaryName ? dataAvailability.primaryName = true : dataAvailability.primaryName = false;
   org.countryISOAlpha2Code ? dataAvailability.countryISOAlpha2Code = true : 
                                 dataAvailability.countryISOAlpha2Code = false;

   //Check for the availability of specific properties in specific blocks
   if(dataAvailability.blockIDs['companyinfo']) { ciDataAvailability(org, dataAvailability) }
   if(dataAvailability.blockIDs['hierarchyconnections']) { hcDataAvailability(org, dataAvailability) }
   if(dataAvailability.blockIDs['principalscontacts']) { pcDataAvailability(org, dataAvailability) }

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

   //Add a section concerning the DUNS delivered
   tbl = getBasicDBsTbl('Common data');
   tbl.setAttribute('id', 'commonData');
   tbody = tbl.appendChild(document.createElement('tbody'));
   if(dataAvailability.duns) { addBasicDBsTblRow(tbody, 'DUNS delivered', org.duns) }
   if(dataAvailability.primaryName) { addBasicDBsTblRow(tbody, 'Primary name', org.primaryName) }
   if(dataAvailability.countryISOAlpha2Code) {
      addBasicDBsTblRow(tbody, 'Country code', org.countryISOAlpha2Code)
   }

   retDocFrag.appendChild(tbl);

   //Add the sections to the document fragment
   if(dataAvailability.blockIDs['companyinfo']) { createCiSections(org, dataAvailability, retDocFrag) }
   if(dataAvailability.blockIDs['hierarchyconnections']) { createHcSections(org, dataAvailability, retDocFrag) }
   if(dataAvailability.blockIDs['principalscontacts']) { createPcSections(org, dataAvailability, retDocFrag) }

   return retDocFrag;
}
