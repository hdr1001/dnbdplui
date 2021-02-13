// *********************************************************************
//
// JavaScript DOM code related to the D&B Direct+
// Payment Insights Data Block
//
// JavaScript code file: dplDbPaymInsights.js
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
//Payment Insights Data Block
function piDataAvailability(org, dataAvailability) {
   dataAvailability.businessTrading = org.businessTrading && org.businessTrading.length > 0;
}

//DOM code to convert the payment insights data in a JavaScript
//object so it can be displayed in sections on a regular HTML page
function createPiSections(org, dataAvailability, retDocFrag) {
   const sTitle = 'Payment insights';
   let tbl, tbody;

   if(dataAvailability.businessTrading) {
      org.businessTrading.map(paymInsight => {
         paymInsight.summary.map(sumry => {
            console.log('Section \"' + sTitle + '\" will be created');

            tbl = getBasicDBsTbl(sTitle + (paymInsight.summaryDate ? ' (' + paymInsight.summaryDate + ')' : ''));
            tbody = tbl.appendChild(document.createElement('tbody'));
      
            if(typeof sumry.paydexScore === 'number') {
               addBasicDBsTblRow(tbody, 'D&B Paydex', sumry.paydexScore.toString())
            }
            if(typeof sumry.paymentBehaviorDays === 'number') {
               addBasicDBsTblRow(tbody, 'Average delay in days', sumry.paymentBehaviorDays.toString())
            }
            if(sumry.paymentBehaviorResult && sumry.paymentBehaviorResult.description) {
               addBasicDBsTblRow(tbody, 'Description', sumry.paymentBehaviorResult.description)
            }
            if(typeof sumry.totalExperiencesCount === 'number') {
               addBasicDBsTblRow(tbody, 'Experiences count', sumry.totalExperiencesCount.toString())
            }
            if(sumry.dataCoverage && sumry.dataCoverage.description) {
               addBasicDBsTblRow(tbody, 'Data coverage', sumry.dataCoverage.description)
            }

            retDocFrag.appendChild(tbl)
         })
      })
   }
   else {
      console.log('No business trading data available but section \"' + sTitle + '\" will be created');

      tbl = getBasicDBsTbl(sTitle);
      tbody = tbl.appendChild(document.createElement('tbody'));

      addBasicDBsTblRow(tbody, 'D&B Paydex', 'Not available');

      retDocFrag.appendChild(tbl)
   }
}
