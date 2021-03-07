// *********************************************************************
//
// JavaScript DOM code related to the D&B Direct+
// Filing & Events Data Block
//
// JavaScript code file: dplDbFilingEvnts.js
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

//Boolean to yes or no (in case of null return -)
function booleToYesOrNo(boole) {
   if(boole === null || boole === undefined) {
      return '-'
   }

   return boole ? 'Yes' : 'No';
}

//Get the relevant keys associated with a specific event category
function getArrFilgEvntsKeys(evntCat) {
   let retArr = [];

   switch(evntCat) {
      case 'significant':
         retArr = [
            {key: 'hasBusinessDiscontinued', title: 'Business discontinued'},
            {key: 'hasDisastrousEvents', title: 'Has disastrous events'},
            {key: 'hasFireOccurred', title: 'Has fire occured'},
            {key: 'hasBurglaryOccured', title: 'Has burglary occured'},
            {key: 'hasOperationalEvents', title: 'Has operational events'},
            {key: 'hasControlChange', title: 'Has control change'},
            {key: 'hasPartnerChange', title: 'Has partner change'},
            {key: 'hasCEOChange', title: 'Has CEO change'},
            {key: 'hasNameChange', title: 'Has name change'}
         ];
         break;
      case 'legal':
         retArr = [
            {key: 'hasBankruptcy', title: 'Has bankruptcy'},
            {key: 'hasOpenBankruptcy', title: 'Has open bankruptcy'},
            {key: 'hasInsolvency', title: 'Has insolvency'},
            {key: 'hasLiquidation', title: 'Has liquidation'},
            {key: 'hasSuspensionOfPayments', title: 'Has suspension of payments'},
            {key: 'hasCriminalProceedings', title: 'Has criminal proceedings'},
            {key: 'hasOpenCriminalProceedings', title: 'Has open criminal proceedings'},
            {key: 'hasJudgments', title: 'Has judgments'},
            {key: 'hasOpenJudgments', title: 'Has open judgments'},
            {key: 'hasOtherLegalEvents', title: 'Has other legal events'},
            {key: 'hasOpenLegalEvents', title: 'Has open legal events'},
            {key: 'hasSuits', title: 'Has suits'},
            {key: 'hasOpenSuits', title: 'Has open suits'},
            {key: 'hasFinancialEmbarrassment', title: 'Has financial embarrassment'},
            {key: 'hasOpenFinancialEmbarrassment', title: 'Has open financial embarrassment'},
            {key: 'hasDebarments', title: 'Has debarments'},
            {key: 'hasOpenDebarments', title: 'Has open debarments'},
            {key: 'hasLiens', title: 'Has liens'},
            {key: 'hasOpenLiens', title: 'Has open liens'},
            {key: 'hasClaims', title: 'Has claims'},
            {key: 'hasOpenClaims', title: 'Has open claims'}
         ];
         break;
      case 'financing':
         retArr = [
            {key: 'hasSecuredFilings', title: 'Has secured filings'},
            {key: 'hasOpenSecuredFilings', title: 'Has open secured filings'},
            {key: 'hasOpenFinancingEvents', title: 'Has open financing events'},
            {key: 'hasLetterOfAgreement', title: 'Has letter of agreement'},
            {key: 'hasLetterOfLiability', title: 'Has letter of liability'},
            {key: 'hasOpenLetterOfLiability', title: 'Has open letter of liability'},
            {key: 'hasRemovedLetterOfLiability', title: 'Has removed letter of liability'}
         ];
         break;
      default:
         console.log('Invalid event category specified');
   }

   return retArr;
}

//Check for the availability of important properties in the
//Filing & Events Data Block
function feDataAvailability(org, dataAvailability) {
   dataAvailability.hasCompanyMoved = typeof org.hasCompanyMoved === 'boolean';

   dataAvailability.significantEvents = org.significantEvents && !bObjIsEmpty(org.significantEvents);

   dataAvailability.legalEvents = org.legalEvents && !bObjIsEmpty(org.legalEvents);

   dataAvailability.financingEvents = org.financingEvents && !bObjIsEmpty(org.financingEvents);

   dataAvailability.awards = org.awards && !bObjIsEmpty(org.awards);
}

//DOM code to convert the Filing & Events data in a JavaScript
//object so it can be displayed in sections on a regular HTML page
function createFeSections(org, dataAvailability, retDocFrag) {
   let tbl, tbody;

   //List event entries for significant, legal and financing categories
   function listEvents(evntCat) {
      const evnts = org[evntCat + 'Events'];

      const hasEvnts = evnts['has' + capitalize1st(evntCat) + 'Events'];

      //Report whether the has...Events property is available
      if(hasEvnts || hasEvnts === false) {
         console.log('Header key has' + capitalize1st(evntCat) + 'Events is available');
      }
      else {
         if(evnts['has' + capitalize1st(evntCat) + 'Events'] === null) {
            console.log('Header key has' + capitalize1st(evntCat) + 'Events has a value of null');
         }
         else {
            console.log('Header key has' + capitalize1st(evntCat) + 'Events is not available');
         }
      }

      //Add a row for the has...Events property
      let tr = addBasicDBsTblRow(tbody, 'Has ' + evntCat + ' events', booleToYesOrNo(hasEvnts));

      //Add a plus/minus button to the row created
      if(tr) { 
         tr.classList.add('filgEvnts', evntCat, 'header');

         tr.style.display = 'table-row';

         //Add the plus/minus button to the table header element
         let th = tr.childNodes[0];

         if(th && th.tagName.toLowerCase() === 'th') {
            const btn = th.appendChild(document.createElement('button'));

            btn.classList.add('btnPlusMinus', evntCat);

            btn.textContent = '+';

            //Click event handler for the plus/minus button 
            btn.addEventListener('click', event => {
               if(btn.textContent === '+') {
                  tbody.querySelectorAll('tr.' + evntCat).forEach(filgEvntsRow => {
                     filgEvntsRow.style.display = 'table-row';
                  });

                  btn.textContent = '-';
               }
               else { // - clicked
                  tbody.querySelectorAll('tr.' + evntCat).forEach(filgEvntsRow => {
                     if(filgEvntsRow.classList.contains('header')) {
                        filgEvntsRow.style.display = 'table-row';
                     }
                     else {
                        filgEvntsRow.style.display = 'none';
                     }
                  });

                  btn.textContent = '+';
               }
            });
         }
      }

      //Get the relevant keys associated with a specific event category
      let arrKeys = getArrFilgEvntsKeys(evntCat);
      
      //Get the keys actually available on the data block
      const arrAvailableKeys = Object.keys(evnts).filter(sKey => evnts[sKey] !== null);

      let i, idx;

      for(i = 0; i < arrKeys.length; i++) { //Loop through all possibly available keys

         //Check if a specific key is actually available
         idx = arrAvailableKeys.findIndex(aKey => aKey === arrKeys[i].key);

         if(idx !== -1) { // if available ...
            tr = addBasicDBsTblRow(tbody, arrKeys[i].title, booleToYesOrNo(evnts[arrKeys[i].key]));
            if(tr) {
               tr.classList.add('filgEvnts', evntCat, 'row');
               tr.style.display = 'none'; //Hide row by default
            }
         }
         else { // key not available ...
            console.log('Key ' + arrKeys[i].key + ' not available');
         }
      }
   }

   //Add high level corporate hierarchy information section to the page
   if(['hasCompanyMoved', 'significantEvents', 'legalEvents', 'financingEvents', 'awards'].some(elem => dataAvailability[elem])) {
      console.log('Section \"Filings & Events\" will be created');

      tbl = getBasicDBsTbl('Filings & Events');
      tbody = tbl.appendChild(document.createElement('tbody'));
      if(dataAvailability.hasCompanyMoved) {
         addBasicDBsTblRow(tbody, 'Company has moved', booleToYesOrNo(org.hasCompanyMoved))
      }

      if(dataAvailability.significantEvents) { listEvents('significant') }
      if(dataAvailability.legalEvents) { listEvents('legal') }
      if(dataAvailability.financingEvents) { listEvents('financing') }

/*
      if(dataAvailability.awards) {
         addBasicDBsTblRow(tbody, 'Company has moved', dataAvailability.hasCompanyMoved)
      }
*/
      retDocFrag.appendChild(tbl);
   }
   else {
      console.log('No data available for section \"Filings & Events\", it will not be created');
   }
}
