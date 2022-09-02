const initMondayClient = require('monday-sdk-js');

const { co2 } = require('@tgwf/co2')
const fetch = require('node-fetch');
const swd = require('../helpers/sustainable-web-design');
const Cache = require("@11ty/eleventy-fetch");



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

const createColumn = async (token, boardId, title,description, type) => {
  try {


    const mondayClient = initMondayClient({ token });

    console.log({ token, boardId, title, type });



    const query = `mutation create_column($boardId: Int!, $title: String!, $description:String) {
      create_column(board_id: $boardId, title: $title,description:$description, column_type: text) {
          id
        }
      }
      `;

    const variables = { boardId, title,description };

    

    console.log(query);
   


    var resp = await mondayClient.api(query, { variables });

    return resp;
    // return await mondayClient.api(query,{variables}).then(async (res) => {
    //   await console.log(`col created: ${JSON.stringify(res)}`);
    // });
  } catch (err) {
    console.error(err);
  }
};


const isValidUrl = urlString => {
  var urlPattern = new RegExp('^(https?:\\/\\/)?' + // validate protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // validate fragment locator
  return !!urlPattern.test(urlString);
}

function isNumeric(str) {
  if (typeof str != "string") return false // we only process strings!  
  return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
         !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

const changeMultipleColumnValues = async (token, boardId, itemId, websiteColumn, deviceType, auditColumnIds) => {
  try {
    const mondayClient = initMondayClient({ token });



    let {
      co2ColumnId, speedColumnId, performanceColumnId,
      unusedJavascriptBytesColumnId, unusedJavascriptSecondsColumnId, unusedCSSBytesColumnId,
      unusedCSSSecondsColumnId,
      energyPerVisitColumnId,
      transferSizeInKBColumnId ,
      annualEnergyInKwhColumnId,
      annualEmissionsInGramsColumnId, deviceColumnId, greenHostingColumnId } = auditColumnIds;

    let columnPayload = {};

    let websiteURL = JSON.parse(websiteColumn.value);

    console.log(websiteURL);
    if (isValidUrl(websiteURL)) {

      if (!websiteURL.startsWith('https://')) {

        if (websiteURL.startsWith('http://')) {

          websiteURL = websiteURL.replace('http', 'https')

        } else {
          websiteURL = "https://" + websiteURL
        }


      }


      var byteResult = await calculateWebFootprint(websiteURL, deviceType);

      if (byteResult.error) {
        var websiteColumnId = websiteColumn.id;
        columnPayload = {
          [websiteColumnId]: 'Error:' + byteResult.msg,
          [co2ColumnId]: '-',
          [speedColumnId]: '-',
          [performanceColumnId]: '-',
          [unusedJavascriptBytesColumnId]: '-',
          [unusedCSSSecondsColumnId]: '-',
          [unusedJavascriptSecondsColumnId]: '-',
          [unusedCSSBytesColumnId]: '-',
          [energyPerVisitColumnId]: '-',
          [annualEnergyInKwhColumnId]: '-',
          [annualEmissionsInGramsColumnId]: '-',
          [transferSizeInKBColumnId]: '-',
          [deviceColumnId]: deviceType.value,
          [greenHostingColumnId]: '-',

        }
      } else {

        columnPayload = {

          [co2ColumnId]: byteResult.co2,
          [speedColumnId]: byteResult.speed,
          [performanceColumnId]: byteResult.performance,
          [greenHostingColumnId]: byteResult.isGreen,
          [transferSizeInKBColumnId]: byteResult.transferSizeInKB,
          [unusedJavascriptBytesColumnId]: byteResult.unusedJavascriptBytes,
          [unusedCSSSecondsColumnId]: byteResult.unusedCSSSeconds,
          [unusedJavascriptSecondsColumnId]: byteResult.unusedJavascriptSeconds,
          [unusedCSSBytesColumnId]: byteResult.unusedCSSBytes,
          [energyPerVisitColumnId]: byteResult.energyPerVisit,
        
          [annualEnergyInKwhColumnId]: byteResult.annualEnergyInKwh,
          [annualEmissionsInGramsColumnId]: byteResult.annualEmissionsInGrams,
          [deviceColumnId]: deviceType.value
          
        }
      }




    } else {

      var websiteColumnId = websiteColumn.id;
      columnPayload = {
        [websiteColumnId]: 'Please enter Valid URL',
        [co2ColumnId]: '-',
        [speedColumnId]: '-',
        [performanceColumnId]: '-',
        [unusedJavascriptBytesColumnId]: '-',
        [unusedCSSSecondsColumnId]: '-',
        [unusedJavascriptSecondsColumnId]: '-',
        [unusedCSSBytesColumnId]: '-',
        [energyPerVisitColumnId]: '-',
        [annualEnergyInKwhColumnId]: '-',
        [annualEmissionsInGramsColumnId]: '-',
        [transferSizeInKBColumnId]: '-',
        [greenHostingColumnId]: '-',
        [deviceColumnId]: deviceType.value

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

const changeMultipleColumnValuesForEmail= async (token, boardId, itemId, emailCountColumn, emailCarbonColumnIds) =>{

  try {
    const mondayClient = initMondayClient({ token });



    let {
      spamEmailColumnId,
      p2pEmailColumnId,
      l2lEmailColumnId,

      longEmailColumnId,
      newsletterEmailColumnId,
      attachmentEmailColumnId} = emailCarbonColumnIds;

    let columnPayload = {};

    let emailCount = emailCountColumn.value;

    console.log(emailCount);
    if (isNumeric(emailCount)) {


      var byteResult = await calculateEmailFootprint(emailCount);

    
      columnPayload = {

        [spamEmailColumnId]: byteResult.spamEmailCarbon,
        [p2pEmailColumnId]: byteResult.shortP2PEmailCarbon,
        [l2lEmailColumnId]: byteResult.shortL2LEmailCarbon,
        [longEmailColumnId]: byteResult.longEmailCarbon,
        [newsletterEmailColumnId]: byteResult.newsletterEmailCarbon,
        [attachmentEmailColumnId]: byteResult.attachmentEmailCarbon

      }




    } else {

      var emailCountColumnId = emailCountColumn.id;
      columnPayload = {
        [emailCountColumnId]: 'Please enter valid number',
        [spamEmailColumnId]: '-',
        [p2pEmailColumnId]: '-',
        [l2lEmailColumnId]: '-',
        [longEmailColumnId]: '-',
        [newsletterEmailColumnId]: '-',
        [attachmentEmailColumnId]: '-'

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
  
}


function getGooglePageSpeedInsightsData(websiteURL, deviceType) {

  return new Promise(async (resolve, reject) => {


    const API_KEY = process.env.PSI_API_KEY;

    const params = new URLSearchParams();
    params.append('url', websiteURL);
    params.append('key', API_KEY);

    params.append('fields', 'lighthouseResult.audits.*,lighthouseResult.categories.*.score,lighthouseResult.categories.*.title');
    params.append('prettyPrint', false);
    // I use the mobile strategy, but `desktop` is a valid value too.
    params.append('strategy', deviceType.value);

    params.append('category', 'PERFORMANCE');
    params.append('category', 'ACCESSIBILITY');
    params.append('category', 'BEST-PRACTICES');
    params.append('category', 'SEO');


    const psi = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params.toString()}`;
    var complete_url = psi;
    console.log(complete_url);

    

    let obj = await Cache(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params.toString()}`, {
      duration: '1d',
      type: 'json',
    });

    // var psiResponse = await fetch(complete_url).catch(err => console.log('Request Failed', err.message));
    // var obj = await psiResponse.json()
    resolve(obj);

  })

}

function getGreenWeb(url) {
  return new Promise(async (resolve, reject) => {


    const parsedURL = new URL(url);
    const GREEN_FOUNDATION_API_ENDPOINT = "https://api.thegreenwebfoundation.org/greencheck";
    var gfRes = await fetch(`${GREEN_FOUNDATION_API_ENDPOINT}/${parsedURL.host}`);
    var result = await gfRes.json();
    console.log('Green Resu',result);
    resolve(result);

  })

}

function calculateWebFootprint(url, deviceType) {

  return new Promise(async (resolve, reject) => {


    const [pagespeedapiObj, greenweb] = await Promise.all([
      getGooglePageSpeedInsightsData(url, deviceType),
      getGreenWeb(url),
    ]);

    if (pagespeedapiObj === null || pagespeedapiObj === void 0 ? void 0 : pagespeedapiObj.error) {
      resolve({ error: true, msg: pagespeedapiObj.error.message })
    }

    const isGreenHost = greenweb === null || greenweb === void 0 ? void 0 : greenweb.green;


    var categoriesData = pagespeedapiObj.lighthouseResult.categories;

    var totalBytes = pagespeedapiObj.lighthouseResult.audits["total-byte-weight"].numericValue;
    var speed = pagespeedapiObj.lighthouseResult.audits['speed-index'].displayValue;
    var performance = Math.ceil(categoriesData['performance'].score * 100);
    //var domSize = pagespeedapiObj.lighthouseResult.audits['dom-size'].details.items[0].value;

    var unusedJavascriptSeconds = '-';
    if (pagespeedapiObj.lighthouseResult.audits['unused-javascript']["details"]["overallSavingsMs"]) {
      unusedJavascriptSeconds = pagespeedapiObj.lighthouseResult.audits['unused-javascript']["details"]["overallSavingsMs"] ;
    }

    var unusedJavascriptBytes = '-';

    if (pagespeedapiObj.lighthouseResult.audits['unused-javascript']["details"]["overallSavingsBytes"]) {
      unusedJavascriptBytes = parseFloat((pagespeedapiObj.lighthouseResult.audits['unused-javascript']["details"]["overallSavingsBytes"] / 1024).toFixed(2));
    }


    var unusedCSSSeconds = '-';
    if (pagespeedapiObj.lighthouseResult.audits['unused-css-rules']["details"]["overallSavingMs"]) {
      unusedCSSSeconds = pagespeedapiObj.lighthouseResult.audits['unused-css-rules']["details"]["overallSavingMs"] ;
    }

    var unusedCSSBytes = '-';
    if (pagespeedapiObj.lighthouseResult.audits['unused-css-rules']["details"]["overallSavingBytes"]) {
      unusedCSSBytes = parseFloat((pagespeedapiObj.lighthouseResult.audits['unused-css-rules']["details"]["overallSavingBytes"] / 1024).toFixed(2));
    }


    var co2Value = swd.perVisit(totalBytes, isGreenHost);

    console.log("Carbon=>" + co2Value)

    var energyPerVisit = swd.energyPerVisit(totalBytes);

    console.log("energyPerVisit=>" + energyPerVisit);

    // var emissionsPerVisitInGrams = null;
    // if (isGreenHost)
    //   emissionsPerVisitInGrams = swd.emissionsPerVisitInGrams(energyPerVisit, swd.RENEWABLES_INTENSITY);
    // else
    //   emissionsPerVisitInGrams = swd.emissionsPerVisitInGrams(energyPerVisit);


    // console.log("emissionsPerVisitInGrams=>" + emissionsPerVisitInGrams);

    var transferSizeInKB = parseFloat(totalBytes/1024).toFixed(2).toString();

    var annualEnergyInKwh = swd.annualEnergyInKwh(energyPerVisit).toFixed(2).toString() ;
    var annualEmissionsInGrams = swd.annualEmissionsInGrams(co2Value).toFixed(2).toString();

    var isGreen = isGreenHost?'Yes':'No';

    resolve({
      co2: co2Value.toFixed(2).toString(),
      energyPerVisit: energyPerVisit.toString(),
      transferSizeInKB,
      annualEnergyInKwh,
      annualEmissionsInGrams,
      speed,
      performance,
      unusedJavascriptSeconds,
      unusedJavascriptBytes,
      unusedCSSSeconds,
      unusedCSSBytes,
      isGreen
    });


  })
}



function calculateEmailFootprint(emailCount) {

  return new Promise(async (resolve, reject) => {

  let spamEmailPercentage = 0.47;
  let normalEmailPercentage = 0.53;  
  let businessEmailWithAttachmentPercentage = 0.24;

  let SPAM_CO2=0.03;
  let SHORT_PHONE2PHONE_CO2 = 0.2 ;
  let SHORT_LAPTOP2LAPTOP_CO2 =0.3 ;
  let LONG_LAPTOP2LAPTOP_CO2 = 17 ;  
  let NEWSLETTER_CO2 = 26 ;  
  let ATTACHMENT_CO2 = 50;



  let spamEmailCarbon = emailCount * SPAM_CO2 * spamEmailPercentage;
  let shortP2PEmailCarbon = emailCount* SHORT_PHONE2PHONE_CO2 * normalEmailPercentage;

  let shortL2LEmailCarbon = emailCount * SHORT_LAPTOP2LAPTOP_CO2 * normalEmailPercentage;

  let longEmailCarbon = emailCount* LONG_LAPTOP2LAPTOP_CO2 * normalEmailPercentage;

  let newsletterEmailCarbon = emailCount* NEWSLETTER_CO2 * normalEmailPercentage;

  let attachmentEmailCarbon = emailCount* ATTACHMENT_CO2 * businessEmailWithAttachmentPercentage;


    resolve({
      spamEmailCarbon,
      shortP2PEmailCarbon,
      shortL2LEmailCarbon,
      longEmailCarbon,
      newsletterEmailCarbon,
      attachmentEmailCarbon
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
  changeMultipleColumnValues,
  changeMultipleColumnValuesForEmail
};
