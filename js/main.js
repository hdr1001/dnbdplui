// *********************************************************************
//
// JavaScript code for an example UI for D&B Direct+ Data Blocks
// JavaScript code file: main.js
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

//Register an event listener for event DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
   const inpFile = document.getElementById('inpFile');
   
   //Register an event listener for the change event on the
   //input control inpFile (if it can be located on the page)
   if(inpFile) {
      inpFile.addEventListener('change', event => {
         //A different file was specified by the end user
         console.log('Captured change event element with id ' + event.target.id);

         //In this applicaton only the 1st file in the array is relevant
         if(event.target.files[0]) {
            window.alert('File selected is ' + event.target.files[0].name);
         }
         else {
            console.log('Invalid file selected');
         }
      });
   }
   else {
      console.log('getElementById inpFile failed');
   }   
});