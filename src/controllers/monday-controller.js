const mondayService = require('../services/monday-service');
const transformationService = require('../services/transformation-service');
const { TRANSFORMATION_TYPES } = require('../constants/transformation');

async function executeActionOld(req, res) {

  
  const { shortLivedToken } = req.session;
  const { payload } = req.body;

  try {
    const { inputFields } = payload;
    const { boardId, itemId, sourceColumnId, targetColumnId, transformationType } = inputFields;

    const text = await mondayService.getColumnValue(shortLivedToken, itemId, sourceColumnId);
    if (!text) {
      return res.status(200).send({});
    }

    const transformedText = transformationService.transformText(
      text,
      transformationType ? transformationType.value : 'TO_UPPER_CASE'
    );

   
    await mondayService.changeMultipleColumnValues(shortLivedToken, boardId, itemId, transformedText);

    return res.status(200).send({});
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'internal server error' });
  }
}


async function executeAction(req, res) {

  
  const { shortLivedToken } = req.session;
  const { payload } = req.body;

  try {
    const { inputFields } = payload;
    const { boardId, itemId, sourceColumnId, targetColumnId, transformationType } = inputFields;

    const allRowAttributes = await mondayService.getRowAtributes(shortLivedToken, itemId);
    
    if (!allRowAttributes || allRowAttributes.length<1) {
      return res.status(200).send({});
    }


    console.log('allRowAttributes');
    console.log(allRowAttributes);

    var websiteColumn = allRowAttributes.find(item => item.title.toLowerCase() === "website");

    if(!websiteColumn){
      return res.status(200).send({});
    }

    
    console.log('websiteColumn');
    console.log(websiteColumn);

    var co2Column = allRowAttributes.find(item => item.title.toLowerCase() === "co2");
    let co2ColumnId=-1,speedColumnId=-1,performanceColumnId=-1;
    if(!co2Column){
      co2Column= await mondayService.createColumn(boardId,"CO2","text");
      
    }

    co2ColumnId = co2Column.id;


    console.log('co2Column');
    console.log(co2Column);
    
    var speedColumn = allRowAttributes.find(item => item.title.toLowerCase() === "speed");

    if(!speedColumn){
      speedColumn= await mondayService.createColumn(boardId,"Speed","text");
      
    }

    speedColumnId = speedColumn.id;

    console.log('speedColumn');
    console.log(speedColumn);

    var performanceColumn = allRowAttributes.find(item => item.title.toLowerCase() === "performance");

    if(!performanceColumn){
      performanceColumn = await mondayService.createColumn(boardId,"Perfomance","text");
      
    }

    performanceColumnId = performanceColumn.id

    console.log('performanceColumn');
    console.log(performanceColumn);

    let auditColumnIds= {co2ColumnId,speedColumnId,performanceColumnId};

   
    console.log('Audit Column Ids');
    console.log(auditColumnIds);

    await mondayService.changeMultipleColumnValues(shortLivedToken, boardId, itemId, websiteColumn,auditColumnIds);

    return res.status(200).send({});
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'internal server error' });
  }
}





async function getRemoteListOptions(req, res) {
  try {
    return res.status(200).send(TRANSFORMATION_TYPES);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'internal server error' });
  }
}

module.exports = {
  executeAction,
  getRemoteListOptions,
};
