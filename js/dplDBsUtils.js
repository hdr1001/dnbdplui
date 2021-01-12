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

//Check if an object is an empty object
function bObjIsEmpty(obj) {
   return Object.keys(obj).length === 0 && obj.constructor === Object;
}

//Company Info address object conversion
function getCiAddr(oAddr) {
   let arrAddr = [], str = '';

   if(!oAddr) {return arrAddr}

   //Street address
   if(oAddr.streetAddress) {
      if(oAddr.streetAddress.line1) {arrAddr.push(oAddr.streetAddress.line1)}
      if(oAddr.streetAddress.line2) {arrAddr.push(oAddr.streetAddress.line2)}
   }

   //Refer to alternative properties if streetAddress doesn't contain info
   if(arrAddr.length === 0) {
      if(oAddr.streetName) {
         str = oAddr.streetName;
   
         if(oAddr.streetNumber) {
            str += ' ' + oAddr.streetNumber
         }

         arrAddr.push(str);

         str = '';
      }
   }

   //Postalcode & city
   if(oAddr.postalCode) {str = oAddr.postalCode}
   if(oAddr.addressLocality) {str.length > 0 ? str += ' ' + oAddr.addressLocality.name : str = oAddr.addressLocality.name}
   if(str.length > 0) {arrAddr.push(str)}

   if(oAddr.addressCountry && oAddr.addressCountry.name) {arrAddr.push(oAddr.addressCountry.name)}

   if(oAddr.isRegisteredAddress) {
      arrAddr.push('Entity registered at this address');
   }

   return arrAddr;
}

//Company Info telephone object conversion
function getCiTel(oTel) {
   return (oTel.isdCode ? '+' + oTel.isdCode + ' ' : '') + oTel.telephoneNumber
}

//Remove the country code from a description
function getDescNoCountryCode(sDesc) {
   let idx = sDesc.indexOf('(');

   if(idx > -1) {
      if(sDesc.substr(idx + 3, 1) == ')') { //Just checking :-)
         sDesc = sDesc.substr(0, idx - 1);
      }
   }

   return sDesc.trim();
}
