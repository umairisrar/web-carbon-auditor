const initMondayClient = require('monday-sdk-js');

const { co2 } = require('@tgwf/co2')
const fetch = require('node-fetch');
  

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

const createColumn = async (boardId, title, type) => {
  try {
    const query = `mutation { 
    create_column (board_id: ${boardId}, title: ${title}, column_type: ${type}) {
      id }}`;
    return await mondayClient.api(query).then(async (res) => {
      await console.log(`col created: ${JSON.stringify(res.data)}`);
    });
  } catch (err) {
    console.error(err);
  }
};




const changeMultipleColumnValues = async (token, boardId, itemId,websiteColumn, auditColumnIds) => {
  try {
    const mondayClient = initMondayClient({ token });

    const API_KEY = process.env.PSI_API_KEY;
    const psi = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?key=${API_KEY}&url=`;

    let websiteURL = JSON.parse(websiteColumn.value).url;

    var complete_url = psi + websiteURL;

    var byteResult = await calculateWebFootprint(complete_url);

    let {co2ColumnId,speedColumnId,performanceColumnId} = auditColumnIds;

    

    let columnPayload = {
      [co2ColumnId] :byteResult.co2,
      [speedColumnId]:byteResult.speed,
      [performanceColumnId]:byteResult.performance
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


function calculateWebFootprint(complete_url){

  return new Promise(async(resolve,reject)=>{
   

     var response =  await fetch(complete_url).catch(err => console.log('Request Failed', err.message)); 
      var obj = await response.json()
      
      
      var totalBytes = obj.lighthouseResult.audits["total-byte-weight"].numericValue;
      var speed  =  obj.lighthouseResult.audits['speed-index'].displayValue;
      var performance = Math.ceil(obj.lighthouseResult.categories['performance'].score * 100);
    
      const greenHost = false // Is the data transferred from a green host?
      const co2Emission = new co2();
      var co2 = co2Emission.perByte(totalBytes, greenHost).toString();


    resolve({
      co2,
      speed,
      performance
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
