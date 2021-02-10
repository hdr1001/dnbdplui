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

   if(dataAvailability.blockIDs.financialstrengthinsight.level === 2) {
      dataAvailability.isDeterioratingBusiness = typeof org.isDeterioratingBusiness === 'boolean';

      dataAvailability.isHighRiskBusiness = typeof org.isHighRiskBusiness === 'boolean';
   }

   if(dataAvailability.dnbAssessment) {
      dataAvailability.financialCondition = org.dnbAssessment.financialCondition && 
                                                !bObjIsEmpty(org.dnbAssessment.financialCondition);

      dataAvailability.historyRating = org.dnbAssessment.historyRating && 
                                                !bObjIsEmpty(org.dnbAssessment.historyRating);

      dataAvailability.standardRating = org.dnbAssessment.standardRating && 
                                                !bObjIsEmpty(org.dnbAssessment.standardRating)
         
      dataAvailability.failureScore = org.dnbAssessment.failureScore && 
                                          !bObjIsEmpty(org.dnbAssessment.failureScore);

      dataAvailability.delinquencyScore = org.dnbAssessment.delinquencyScore && 
                                             !bObjIsEmpty(org.dnbAssessment.delinquencyScore);

      if(dataAvailability.blockIDs.financialstrengthinsight.level === 2) {
         dataAvailability.creditLimitRecommendation = org.dnbAssessment.creditLimitRecommendation && 
                                                         !bObjIsEmpty(org.dnbAssessment.creditLimitRecommendation);

         dataAvailability.hasSevereNegativeEvents = typeof org.dnbAssessment.hasSevereNegativeEvents === 'boolean';

         dataAvailability.emergingMarketMediationScore = org.dnbAssessment.emergingMarketMediationScore && 
                                                            !bObjIsEmpty(org.dnbAssessment.emergingMarketMediationScore);
      }
   }
}

//DOM code to convert the Financial Strength data in a JavaScript
//object so it can be displayed in sections on a regular HTML page
function createFsSections(org, dataAvailability, retDocFrag) {
   let tbl, tbody;

   function createScoreSection(score, scoreTbl, docFrag) {
      tbody = scoreTbl.appendChild(document.createElement('tbody'));

      addBasicDBsTblRow(tbody, 'Class score', score.classScore);
      if(score.classScoreDescription) {
         addBasicDBsTblRow(tbody, 'Description', score.classScoreDescription);
      }
      if(score.scoreDate) {
         addBasicDBsTblRow(tbody, 'Score date', score.scoreDate);
      }
      if(score.scoreModel && score.scoreModel.description) {
         addBasicDBsTblRow(tbody, 'Model', score.scoreModel.description);
      }

      docFrag.appendChild(scoreTbl);
   }

   if(dataAvailability.dnbAssessment) {
      let ratingTbody;
   
      //Overall financial condition & history section
      if(dataAvailability.financialCondition && org.dnbAssessment.financialCondition.description) {
         console.log('Section \"Financial condition\" will be created');
   
         tbl = getBasicDBsTbl('Financial condition');
         tbody = tbl.appendChild(document.createElement('tbody'));
   
         addBasicDBsTblRow(tbody, 'Overall condition', org.dnbAssessment.financialCondition.description);

         if(dataAvailability.historyRating && org.dnbAssessment.historyRating.description) {
            addBasicDBsTblRow(tbody, 'History', org.dnbAssessment.historyRating.description)
         }

         retDocFrag.appendChild(tbl);
      }
      else {
         console.log('No data available for section \"Financial condition\", it will not be created');
      }

      //D&B rating
      if(dataAvailability.standardRating && org.dnbAssessment.standardRating.rating) {
         console.log('Section \"D&B standard rating\" will be created');
   
         tbl = getBasicDBsTbl('D&B standard rating');
         ratingTbody = tbl.appendChild(document.createElement('tbody'));
   
         addBasicDBsTblRow(ratingTbody, 'D&B Rating', org.dnbAssessment.standardRating.rating);
         if(org.dnbAssessment.standardRating.scoreDate) {
            addBasicDBsTblRow(ratingTbody, 'Score date', org.dnbAssessment.standardRating.scoreDate)
         }

         retDocFrag.appendChild(tbl);
      }
      else {
         console.log('No data available for section \"D&B standard rating\", it will not be created');
      }

      //D&B failure score
      if(dataAvailability.failureScore && org.dnbAssessment.failureScore.classScore) {
         console.log('Section \"D&B failure score\" will be created');

         tbl = getBasicDBsTbl('D&B failure score');

         createScoreSection(org.dnbAssessment.failureScore, tbl, retDocFrag)
      }
      else {
         //If no failure score section is available add the model to the rating section
         if(ratingTbody && dataAvailability.failureScore &&
               org.dnbAssessment.failureScore.scoreModel.description) {

            addBasicDBsTblRow(ratingTbody, 'Model', org.dnbAssessment.failureScore.scoreModel.description)
         }

         console.log('No data available for section \"D&B failure score\", it will not be created');
      }

      //D&B delinquency score
      if(dataAvailability.delinquencyScore && org.dnbAssessment.delinquencyScore.classScore) {
         console.log('Section \"D&B delinquency score\" will be created');

         tbl = getBasicDBsTbl('D&B delinquency score');

         createScoreSection(org.dnbAssessment.delinquencyScore, tbl, retDocFrag)
      }
      else {
         console.log('No data available for section \"D&B delinquencyScore score\", it will not be created');
      }
   }
}
