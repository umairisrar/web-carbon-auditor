const initMondayClient = require('monday-sdk-js');

const { co2 } = require('@tgwf/co2')
const fetch = require('node-fetch');
const swd = require('../helpers/sustainable-web-design');

  
//const swd = new SustainableWebDesign();



const co2Emission = new co2();
//const swd = new co2({model:'swd'});

const getColumnValue = async (token, itemId, columnId) => {
  try {
    const mondayClient = initMondayClient();
    mondayClient.setToken(token);

    const query = `query($itemId: [Int], $columnId: [String]) {
        items (ids: $itemId) {
          column_values(ids:$columnId) {
            value
          }
        }
      }`;
    const variables = { columnId, itemId };

    const response = await mondayClient.api(query, { variables });
    return response.data.items[0].column_values[0].value;
  } catch (err) {
    console.error(err);
  }
};





const getRowAtributes = async (token, itemId) => {
  try {
    const mondayClient = initMondayClient();
    mondayClient.setToken(token);

    const query = `query($itemId: [Int]) {
        items (ids: $itemId) {
          column_values {
            title
            id
            value
          }
        }
      }`;
    const variables = { itemId };

    const response = await mondayClient.api(query, { variables });

    return response.data.items[0].column_values;

  } catch (err) {
    console.error(err);
  }
};

const createColumn = async (token,boardId, title, type) => {
  try {


    const mondayClient = initMondayClient({ token });

    console.log({token,boardId,title,type});



    const query = `mutation create_column($boardId: Int!, $title: String!) {
      create_column(board_id: $boardId, title: $title, column_type: text) {
          id
        }
      }
      `;

    const variables = { boardId, title };

    //const response = await mondayClient.api(query, { variables });





    // const query = `mutation { 
    // create_column (board_id: ${boardId}, title: ${title}, column_type: text }) {
    //   id }}`;


      console.log(query);
  //    const variables = { boardId, title };

//    const response = await mondayClient.api(query, { variables });

    
    var resp = await mondayClient.api(query,{variables});

    return resp;
    // return await mondayClient.api(query,{variables}).then(async (res) => {
    //   await console.log(`col created: ${JSON.stringify(res)}`);
    // });
  } catch (err) {
    console.error(err);
  }
};


const isValidUrl = urlString=> {
  var urlPattern = new RegExp('^(https?:\\/\\/)?'+ // validate protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // validate OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // validate port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // validate query string
  '(\\#[-a-z\\d_]*)?$','i'); // validate fragment locator
return !!urlPattern.test(urlString);
}

const changeMultipleColumnValues = async (token, boardId, itemId,websiteColumn, auditColumnIds) => {
  try {
    const mondayClient = initMondayClient({ token });

    let {
      co2ColumnId, speedColumnId, performanceColumnId,
      unusedJavascriptBytesColumnId, unusedJavascriptSecondsColumnId, unusedCSSBytesColumnId,
      unusedCSSSecondsColumnId,
      energyPerVisitColumnId,
      emissionsPerVisitInGramsColumnId,
      annualEnergyInKwhColumnId,
      annualEmissionsInGramsColumnId } = auditColumnIds;

    let columnPayload = {};

    let websiteURL = JSON.parse(websiteColumn.value);

    console.log(websiteURL);
    if (isValidUrl(websiteURL)) {

      if(!websiteURL.startsWith('https://')){
        
        if (websiteURL.startsWith('http://')) {

          websiteURL = websiteURL.replace('http','https')

        }else{
          websiteURL = "https://"+websiteURL
        }

        
      }

      const API_KEY = process.env.PSI_API_KEY;

      const params = new URLSearchParams();
      params.append('url', websiteURL);
      params.append('key', API_KEY);

      params.append('fields', 'lighthouseResult.audits.*,lighthouseResult.categories.*.score,lighthouseResult.categories.*.title');
      params.append('prettyPrint', false);
      // I use the mobile strategy, but `desktop` is a valid value too.
      params.append('strategy', 'desktop');

      params.append('category', 'PERFORMANCE');
      params.append('category', 'ACCESSIBILITY');
      params.append('category', 'BEST-PRACTICES');
      params.append('category', 'SEO');


      const psi = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params.toString()}`;
      var complete_url = psi;
      console.log(complete_url);

      var psiResponse =  await fetch(complete_url).catch(err => console.log('Request Failed', err.message)); 
      var obj = await psiResponse.json()

      var byteResult = await calculateWebFootprint(obj);



      columnPayload = {

        [co2ColumnId]: byteResult.co2,
        [speedColumnId]: byteResult.speed,
        [performanceColumnId]: byteResult.performance,
        [unusedJavascriptBytesColumnId]: byteResult.unusedJavascriptBytes,
        [unusedCSSSecondsColumnId]: byteResult.unusedCSSSeconds,
        [unusedJavascriptSecondsColumnId]: byteResult.unusedJavascriptSeconds,
        [unusedCSSBytesColumnId]: byteResult.unusedCSSBytes,
        [energyPerVisitColumnId]: byteResult.energyPerVisit,
        [emissionsPerVisitInGramsColumnId]: byteResult.emissionsPerVisitInGrams,
        [annualEnergyInKwhColumnId]: byteResult.annualEnergyInKwh,
        [annualEmissionsInGramsColumnId]: byteResult.annualEmissionsInGrams

      }



    } else {

      var websiteColumnId = websiteColumn.id;
      columnPayload = {
        [websiteColumnId]:'"Please enter Valid URL',
        [co2ColumnId]: '-',
        [speedColumnId]: '-',
        [performanceColumnId]: '-',
        [unusedJavascriptBytesColumnId]: '-',
        [unusedCSSSecondsColumnId]: '-',
        [unusedJavascriptSecondsColumnId]: '-',
        [unusedCSSBytesColumnId]: '-',
        [energyPerVisitColumnId]: '-',
        [emissionsPerVisitInGramsColumnId]: '-',
        [annualEnergyInKwhColumnId]: '-',
        [annualEmissionsInGramsColumnId]: '-'

      }
    }




    var columnvalues = JSON.stringify(columnPayload)


    console.log('columnvalues');
    console.log(columnvalues);

    const query = `mutation change_multiple_column_values($boardId: Int!, $itemId: Int!, $columnvalues: JSON!) {
        change_multiple_column_values(board_id: $boardId, item_id: $itemId, column_values: $columnvalues) {
            id
          }
        }
        `;

    const variables = { boardId, itemId, columnvalues };

    const response = await mondayClient.api(query, { variables });
    return response;
  } catch (err) {
    console.error(err);
  }
};


function calculateWebFootprint(obj){

  return new Promise(async(resolve,reject)=>{
   
      var categoriesData = obj.lighthouseResult.categories;

      var totalBytes = obj.lighthouseResult.audits["total-byte-weight"].numericValue;
      var speed  =  obj.lighthouseResult.audits['speed-index'].displayValue;
      var performance = Math.ceil(categoriesData['performance'].score * 100);
      //var domSize = obj.lighthouseResult.audits['dom-size'].details.items[0].value;
      
      var unusedJavascriptSeconds = '-';
      if(obj.lighthouseResult.audits['unused-javascript']["details"]["overallSavingsMs"]){
         unusedJavascriptSeconds = obj.lighthouseResult.audits['unused-javascript']["details"]["overallSavingsMs"]+" ms";
      }
      
      var unusedJavascriptBytes = '-';

      if(obj.lighthouseResult.audits['unused-javascript']["details"]["overallSavingsBytes"]){
        unusedJavascriptBytes = parseFloat((obj.lighthouseResult.audits['unused-javascript']["details"]["overallSavingsBytes"]/1024).toFixed(2));
      }
      
      
      var unusedCSSSeconds = '-';
      if(obj.lighthouseResult.audits['unused-css-rules']["details"]["overallSavingMs"]){
         unusedCSSSeconds = obj.lighthouseResult.audits['unused-css-rules']["details"]["overallSavingMs"]+" ms";
      }

      var unusedCSSBytes = '-';
      if(obj.lighthouseResult.audits['unused-css-rules']["details"]["overallSavingBytes"]){
        unusedCSSBytes  = parseFloat((obj.lighthouseResult.audits['unused-css-rules']["details"]["overallSavingBytes"]/1024).toFixed(2));
      }
      

    

      // const getGrade = function (score) {
      //   if (score < 0.5) {
      //     return 'BAD';
      //   }
      //   if (score < 0.9) {
      //     return 'OK';
      //   }
      //   return 'EXCELLENT';
      // };
    
      // Object.keys(categoriesData).map(function (key) {
      //   categoriesData[key].score = (categoriesData[key].score * 100).toFixed();
      //   categoriesData[key].grade = getGrade(categoriesData[key].score);
      // });


      const greenHost = false // Is the data transferred from a green host?
      
      //var co2Value = co2Emission.perByte(totalBytes, greenHost).toString();
      var co2Value = swd.perVisit(totalBytes, greenHost).toFixed(2).toString();

      var energyPerVisit = swd.energyPerVisit(totalBytes).toFixed(2).toString();

      

       var emissionsPerVisitInGrams = swd.emissionsPerVisitInGrams(energyPerVisit);
       var annualEnergyInKwh = swd.annualEnergyInKwh(energyPerVisit).toFixed(2).toString()+" Kwh";
       var annualEmissionsInGrams = swd.annualEmissionsInGrams(co2Value).toFixed(2).toString()+" CO2e";


    resolve({
      co2:co2Value,
      energyPerVisit,
      emissionsPerVisitInGrams,
      annualEnergyInKwh,
      annualEmissionsInGrams,
      speed,
      performance,
      unusedJavascriptSeconds,
      unusedJavascriptBytes,
      unusedCSSSeconds,
      unusedCSSBytes
    });


  })
}

const changeColumnValue = async (token, boardId, itemId, columnId, value) => {
  try {
    const mondayClient = initMondayClient({ token });

    const query = `mutation change_column_value($boardId: Int!, $itemId: Int!, $columnId: String!, $value: JSON!) {
        change_column_value(board_id: $boardId, item_id: $itemId, column_id: $columnId, value: $value) {
          id
        }
      }
      `;
    const variables = { boardId, columnId, itemId, value };

    const response = await mondayClient.api(query, { variables });
    return response;
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  getColumnValue,
  getRowAtributes,
  changeColumnValue,
  createColumn,
  changeMultipleColumnValues
};
