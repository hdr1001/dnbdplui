// *********************************************************************
//
// JavaScript utility code for establishing Data Block data
// availability
//
// JavaScript code file: dplDataAvailability.js
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

function ciDataAvailability(org, dataAvailability, dbLevel) {
   org.duns ? dataAvailability.duns = true : dataAvailability.duns = false;
   org.primaryName ? dataAvailability.primaryName = true : dataAvailability.primaryName = false;

   dataAvailability.tradeStyleNames = org.tradeStyleNames && org.tradeStyleNames.length > 0;

   dataAvailability.dunsControlStatus = org.dunsControlStatus && !bObjIsEmpty(org.dunsControlStatus);
   dataAvailability.operatingStatus = dataAvailability.dunsControlStatus && org.dunsControlStatus.operatingStatus
                                          && !bObjIsEmpty(org.dunsControlStatus.operatingStatus);

   dataAvailability.primaryAddress = org.primaryAddress && !bObjIsEmpty(org.primaryAddress);

   dataAvailability.telephone = org.telephone && org.telephone.length > 0;

   dataAvailability.websiteAddress = org.websiteAddress && org.websiteAddress.length > 0;

   dataAvailability.email = org.email && org.email.length > 0;

   dataAvailability.registrationNumbers = org.registrationNumbers && org.registrationNumbers.length > 0;

   dataAvailability.activities = org.activities && org.activities.length > 0;

   dataAvailability.primaryIndustryCode = org.primaryIndustryCode && !bObjIsEmpty(org.primaryIndustryCode);

   dataAvailability.stockExchanges = org.stockExchanges && org.stockExchanges.length > 0;

   if(dbLevel === 2) {
      org.registeredName ? dataAvailability.registeredName = true : dataAvailability.registeredName = false;

      dataAvailability.businessEntityType = org.businessEntityType 
                                                && org.businessEntityType.description;

      dataAvailability.legalForm = org.legalForm && org.legalForm.description;

      dataAvailability.controlOwnershipType = org.controlOwnershipType && !bObjIsEmpty(org.controlOwnershipType);

      dataAvailability.registeredDetails = org.registeredDetails
                                                && org.registeredDetails.legalForm
                                                && org.registeredDetails.legalForm.description;

      org.startDate ? dataAvailability.startDate = true : dataAvailability.startDate = false;

      org.incorporatedDate ? dataAvailability.incorporatedDate = true : dataAvailability.incorporatedDate = false;

      dataAvailability.registeredAddress = org.registeredAddress && !bObjIsEmpty(org.registeredAddress);

      dataAvailability.mailingAddress = org.mailingAddress && !bObjIsEmpty(org.mailingAddress);

      dataAvailability.financials = org.financials && org.financials.length > 0;

      dataAvailability.organizationSizeCategory = org.organizationSizeCategory 
                                                      && org.organizationSizeCategory.description;

      dataAvailability.numberOfEmployees = org.numberOfEmployees && org.numberOfEmployees.length > 0;

      dataAvailability.isStandalone = typeof org.isStandalone === 'boolean';

      dataAvailability.industryCodes = org.industryCodes && org.industryCodes.length > 0;
   }
}

function hcDataAvailability(org, dataAvailability) {
   dataAvailability.corporateLinkage = org.corporateLinkage && !bObjIsEmpty(org.corporateLinkage);

   if(dataAvailability.corporateLinkage) {
      dataAvailability.headQuarter = org.corporateLinkage.headQuarter && !bObjIsEmpty(org.corporateLinkage.headQuarter);

      dataAvailability.parent = org.corporateLinkage.parent && !bObjIsEmpty(org.corporateLinkage.parent);

      dataAvailability.domesticUltimate = org.corporateLinkage.domesticUltimate && !bObjIsEmpty(org.corporateLinkage.domesticUltimate);

      dataAvailability.globalUltimate = org.corporateLinkage.globalUltimate && !bObjIsEmpty(org.corporateLinkage.globalUltimate);
   }
}
