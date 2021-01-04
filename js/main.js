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
            console.log('File selected is ' + event.target.files[0].name);

            const fileReader = new FileReader();
            
            //On load event for reading the file
            fileReader.addEventListener('load', event => {
               let oDBs;

               //Parse the text read
               try {
                  oDBs = JSON.parse(event.target.result);
               }
               catch(err) {
                  console.log(err.message); return;
               }

               //The data block info will be appended to the div dnbDplDBs
               const divDBs = document.getElementById('dnbDplDBs');

               if(divDBs) {
                  const docFrag = getDBsDocFrag(oDBs);

                  //Append the document fragment if successfully created
                  if(docFrag) { divDBs.appendChild(docFrag) }
               }
               else {
                  console.log('getElementById dnbDplDBs failed');
               }
            });

            //Read the local file specified by the user as text
            fileReader.readAsText(event.target.files[0], 'utf-8');
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
