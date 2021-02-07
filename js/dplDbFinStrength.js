// *********************************************************************
//
// JavaScript DOM code related to the D&B Direct+
// Financial Strength Insights Data Block
//
// JavaScript code file: dplDbFinStrength.js
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
//Financial Strength Insights Data Block
function fsDataAvailability(org, dataAvailability) {
   dataAvailability.dnbAssessment = org.dnbAssessment && !bObjIsEmpty(org.dnbAssessment);

   if(dataAvailability.dnbAssessment) {
      dataAvailability.failureScore = org.dnbAssessment.failureScore && 
                                          !bObjIsEmpty(org.dnbAssessment.failureScore);

      dataAvailability.delinquencyScore = org.dnbAssessment.delinquencyScore && 
                                             !bObjIsEmpty(org.dnbAssessment.delinquencyScore);

      dataAvailability.historyRating = org.dnbAssessment.historyRating && 
                                          !bObjIsEmpty(org.dnbAssessment.historyRating);

      dataAvailability.standardRating = org.dnbAssessment.standardRating && 
                                             !bObjIsEmpty(org.dnbAssessment.standardRating)

      dataAvailability.financialCondition = org.dnbAssessment.financialCondition && 
                                                !bObjIsEmpty(org.dnbAssessment.financialCondition);
   }
}

//DOM code to convert the Financial Strength data in a JavaScript
//object so it can be displayed in sections on a regular HTML page
function createFsSections(org, dataAvailability, retDocFrag) {
   let tbl, tbody;

   if(dataAvailability.standardRating && org.dnbAssessment.standardRating.rating) {
      console.log('Section \"D&B standard rating\" will be created');

      tbl = getBasicDBsTbl('D&B standard rating');
      tbody = tbl.appendChild(document.createElement('tbody'));

      addBasicDBsTblRow(tbody, 'D&B Rating', org.dnbAssessment.standardRating.rating);
      if(org.dnbAssessment.standardRating.scoreDate) {
         addBasicDBsTblRow(tbody, 'Score date', org.dnbAssessment.standardRating.scoreDate)
      }
      if(dataAvailability.failureScore && org.dnbAssessment.failureScore.scoreModel
            && org.dnbAssessment.failureScore.scoreModel.description) {

         addBasicDBsTblRow(tbody, 'Score model', org.dnbAssessment.failureScore.scoreModel.description)
      }

      retDocFrag.appendChild(tbl);
   }
   else {
      console.log('No data available for section \"D&B standard rating\", it will not be created');
   }
}
