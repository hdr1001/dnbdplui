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

   if(dataAvailability.blockIDs.financialstrengthinsight.level === 2) { //Level 2
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

      if(dataAvailability.blockIDs.financialstrengthinsight.level === 2) { //Level 2
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

   function createScoreSection(score, scoreTblBody, docFrag) {
      if(score.classScore || score.nationalPercentile) {
         if(dataAvailability.blockIDs.financialstrengthinsight.level === 2) { //Level 2
            if(score.nationalPercentile) {
               addBasicDBsTblRow(tbody, 'Percentile score', score.nationalPercentile)
            }

            if(score.scoreOverrideReasons && score.scoreOverrideReasons.length > 0) {
               addBasicDBsTblRow(tbody, 'Override reason(s)', 
                     score.scoreOverrideReasons.map(reason => reason.description))
            }
         }

         //Level 1
         if(score.classScore) {
            addBasicDBsTblRow(scoreTblBody, 'Class score', score.classScore)
         }
         if(score.classScoreDescription) {
            addBasicDBsTblRow(scoreTblBody, 'Description', score.classScoreDescription)
         }
         if(score.scoreDate) {
            addBasicDBsTblRow(scoreTblBody, 'Score date', score.scoreDate)
         }
         if(score.scoreModel && score.scoreModel.description) {
            addBasicDBsTblRow(scoreTblBody, 'Model', score.scoreModel.description)
         }
      }
   }

   if(dataAvailability.dnbAssessment) {
      //Overall financial condition & history section
      if(['financialCondition', 'historyRating', 'hasSevereNegativeEvents', 'isHighRiskBusiness',
            'isDeterioratingBusiness'].some(elem => dataAvailability[elem])) {
         console.log('Section \"Financial condition\" will be created');

         tbl = getBasicDBsTbl('Financial condition');
         tbody = tbl.appendChild(document.createElement('tbody'));

         if(dataAvailability.financialCondition && org.dnbAssessment.financialCondition.description) {
            addBasicDBsTblRow(tbody, 'Overall condition', org.dnbAssessment.financialCondition.description);
         }
         if(dataAvailability.historyRating && org.dnbAssessment.historyRating.description) {
            addBasicDBsTblRow(tbody, 'History', org.dnbAssessment.historyRating.description)
         }

         if(dataAvailability.blockIDs.financialstrengthinsight.level === 2) { //Level 2
            if(dataAvailability.hasSevereNegativeEvents && org.dnbAssessment.hasSevereNegativeEvents) {
               addBasicDBsTblRow(tbody, 'Severe negative events', 'Yes')
            }
            if(dataAvailability.isHighRiskBusiness && org.isHighRiskBusiness) {
               addBasicDBsTblRow(tbody, 'High risk business', 'Yes')
            }
            if(dataAvailability.isDeterioratingBusiness && org.isDeterioratingBusiness) {
               addBasicDBsTblRow(tbody, 'Is deteriorating', 'Yes')
            }
         }

         if(tbody.childElementCount > 0) { 
            retDocFrag.appendChild(tbl)
         }
         else {
            console.log('No meaningful data available for section \"Financial condition\", it will not be created');
         }
      }
      else {
         console.log('No data available for section \"Financial condition\", it will not be created');
      }

      //D&B standard rating
      if(dataAvailability.standardRating) {
         console.log('Section \"D&B standard rating\" will be created');
   
         tbl = getBasicDBsTbl('D&B standard rating');
         tbody = tbl.appendChild(document.createElement('tbody'));
   
         if(org.dnbAssessment.standardRating.rating && !(org.dnbAssessment.standardRating.financialStrength &&
                  org.dnbAssessment.standardRating.riskSegment)) {
            addBasicDBsTblRow(tbody, 'D&B Rating', org.dnbAssessment.standardRating.rating)
         }
         if(dataAvailability.blockIDs.financialstrengthinsight.level === 2) { //Level 2
            if(org.dnbAssessment.standardRating.financialStrength) {
               addBasicDBsTblRow(tbody, 'Financial strength', org.dnbAssessment.standardRating.financialStrength)
            }
            if(org.dnbAssessment.standardRating.riskSegment) {
               addBasicDBsTblRow(tbody, 'Risk segment', org.dnbAssessment.standardRating.riskSegment)
            }
            if(dataAvailability.creditLimitRecommendation) {
               const maxRecCredit = org.dnbAssessment.creditLimitRecommendation;

               if(maxRecCredit.maximumRecommendedLimit && maxRecCredit.maximumRecommendedLimit.value) {
                  oCurrOpts.currency =  maxRecCredit.maximumRecommendedLimit.currency;

                  const intlNumFormat = new Intl.NumberFormat('en-us', oCurrOpts);
      
                  addBasicDBsTblRow(tbody, 'Max rec credit limit',
                        intlNumFormat.format(maxRecCredit.maximumRecommendedLimit.value));

                  if(maxRecCredit.assessmentDate && org.dnbAssessment.standardRating.scoreDate &&
                           (maxRecCredit.assessmentDate !== org.dnbAssessment.standardRating.scoreDate)) {

                     addBasicDBsTblRow(tbody, 'Credit limit score date', maxRecCredit.assessmentDate)
                  }
               }
            }
            if(org.dnbAssessment.standardRating.ratingReason && org.dnbAssessment.standardRating.ratingReason.length > 0) {
               addBasicDBsTblRow(tbody, 'Rating reason(s)', 
                     org.dnbAssessment.standardRating.ratingReason.map(reason => reason.description))
            }
            if(org.dnbAssessment.standardRating.ratingOverrideReasons && 
                     org.dnbAssessment.standardRating.ratingOverrideReasons.length > 0) {

               addBasicDBsTblRow(tbody, 'Override reason(s)', 
                     org.dnbAssessment.standardRating.ratingOverrideReasons.map(reason => reason.description))
            }
         }
         if(org.dnbAssessment.standardRating.scoreDate) {
            addBasicDBsTblRow(tbody, 'Score date', org.dnbAssessment.standardRating.scoreDate)
         }

         if(tbody.childElementCount > 0) {
            retDocFrag.appendChild(tbl)
         }
         else {
            console.log('No meaningful data available for section \"D&B standard rating\", it will not be created');
         }
      }
      else {
         console.log('No data available for section \"D&B standard rating\", it will not be created');
      }

      //D&B failure score
      if(dataAvailability.failureScore) {
         console.log('Section \"D&B failure score\" will be created');

         tbl = getBasicDBsTbl('D&B failure score');
         tbody = tbl.appendChild(document.createElement('tbody'));

         createScoreSection(org.dnbAssessment.failureScore, tbody, retDocFrag)

         if(tbody.childElementCount > 0) {
            retDocFrag.appendChild(tbl)
         }
         else {
            console.log('No meaningful data available for section \"D&B failure score\", it will not be created');
         }
      }
      else {
         console.log('No data available for section \"D&B failure score\", it will not be created');
      }

      //D&B delinquency score
      if(dataAvailability.delinquencyScore) {
         console.log('Section \"D&B delinquency score\" will be created');

         tbl = getBasicDBsTbl('D&B delinquency score');
         tbody = tbl.appendChild(document.createElement('tbody'));

         createScoreSection(org.dnbAssessment.delinquencyScore, tbody, retDocFrag)

         if(tbody.childElementCount > 0) {
            retDocFrag.appendChild(tbl)
         }
         else {
            console.log('No meaningful data available for section \"D&B delinquencyScore score\", it will not be created');
         }
      }
      else {
         console.log('No data available for section \"D&B delinquencyScore score\", it will not be created');
      }

      //EMMA Score
      if(dataAvailability.blockIDs.financialstrengthinsight.level === 2) { //Level 2
         if(dataAvailability.emergingMarketMediationScore) {
            console.log('Section \"D&B emerging market score\" will be created');

            tbl = getBasicDBsTbl('D&B emerging market score');
            tbody = tbl.appendChild(document.createElement('tbody'));
   
            createScoreSection(org.dnbAssessment.emergingMarketMediationScore, tbody, retDocFrag)
   
            if(tbody.childElementCount > 0) {
               retDocFrag.appendChild(tbl)
            }
            else {
               console.log('No meaningful data available for section \"D&B emerging market score\", it will not be created');
            }
         }
         else {
            console.log('No data available for section \"D&B emerging market score\", it will not be created');
         }
      }
   }
}
