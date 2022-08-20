const initMondayClient = require('monday-sdk-js');

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




const changeMultipleColumnValues = async (token, boardId, itemId, columnId, value) => {
  try {
    const mondayClient = initMondayClient({ token });

    var columnvalues = JSON.stringify({name:"Umair",link:"technisia.com"})

    const query = `mutation change_multiple_column_values($boardId: Int!, $itemId: Int!, $columnvalues: JSON!) {
      change_multiple_column_values(board_id: $boardId, item_id: $itemId, column_values: $columnvalues) {
          id
        }
      }
      `;

    const variables = { boardId, columnId, itemId, columnvalues };

    const response = await mondayClient.api(query, { variables });
    return response;
  } catch (err) {
    console.error(err);
  }
};

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
  changeColumnValue,
  changeMultipleColumnValues
};
