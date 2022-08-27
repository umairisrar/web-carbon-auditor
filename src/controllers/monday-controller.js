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


    let co2ColumnId=-1,speedColumnId=-1,performanceColumnId=-1,co2SWDColumnId=-1,
    unusedCSSBytesColumnId=-1,
    unusedCSSSecondsColumnId=-1,unusedJavascriptBytesColumnId=-1,unusedJavascriptSecondsColumnId=-1,
    energyPerVisitColumnId=-1,emissionsPerVisitInGramsColumnId=-1,annualEnergyInKwhColumnId=-1,annualEmissionsInGramsColumnId=-1;



    var co2Column = allRowAttributes.find(item => item.title.toLowerCase() === "co2");
    

    if(!co2Column){
      co2Column= await mondayService.createColumn(shortLivedToken,boardId,"CO2","text");
      
    }
    co2ColumnId = co2Column.id;


    var co2SWDColumn = allRowAttributes.find(item => item.title.toLowerCase() === "co2 swd");

    if(!co2SWDColumn){
      co2SWDColumn= await mondayService.createColumn(shortLivedToken,boardId,"CO2 SWD","text");
      
    }
    co2SWDColumnId = co2SWDColumn.id;


    console.log('co2SWDColumn');
    console.log(co2SWDColumn);
    
    var speedColumn = allRowAttributes.find(item => item.title.toLowerCase() === "speed");

    if(!speedColumn){
      speedColumn= await mondayService.createColumn(shortLivedToken,boardId,"Speed","text");
      
    }

    speedColumnId = speedColumn.id;

    console.log('speedColumn');
    console.log(speedColumn);

    var performanceColumn = allRowAttributes.find(item => item.title.toLowerCase() === "performance");

    if(!performanceColumn){
      performanceColumn = await mondayService.createColumn(shortLivedToken,boardId,"Perfomance","text");
      
    }

    performanceColumnId = performanceColumn.id

    console.log('performanceColumn');
    console.log(performanceColumn);


    var unusedJavascriptBytesColumn = allRowAttributes.find(item => item.title.toLowerCase() === "unused javacript");
    if(!unusedJavascriptBytesColumn){
      unusedJavascriptBytesColumn = await mondayService.createColumn(shortLivedToken,boardId,"Unused Javacript","text");
      
    }
    unusedJavascriptBytesColumnId = unusedJavascriptBytesColumn.id

    
    var unusedJavascriptSecondsColumn = allRowAttributes.find(item => item.title.toLowerCase() === "unused javacript seconds");
    if(!unusedJavascriptSecondsColumn){
      unusedJavascriptSecondsColumn = await mondayService.createColumn(shortLivedToken,boardId,"Unused Javacript Seconds","text");
      
    }
    unusedJavascriptSecondsColumnId = unusedJavascriptSecondsColumn.id



    var unusedCSSBytesColumn = allRowAttributes.find(item => item.title.toLowerCase() === "unused javacript");
    if(!unusedCSSBytesColumn){
      unusedCSSBytesColumn = await mondayService.createColumn(shortLivedToken,boardId,"Unused Javacript","text");
      
    }
    unusedCSSBytesColumnId = unusedCSSBytesColumn.id


    var unusedCSSSecondsColumn = allRowAttributes.find(item => item.title.toLowerCase() === "unused css seconds");
    if(!unusedCSSSecondsColumn){
      unusedCSSSecondsColumn = await mondayService.createColumn(shortLivedToken,boardId,"Unused CSS Seconds","text");
      
    }
    unusedCSSSecondsColumnId = unusedCSSSecondsColumn.id
    

    var energyColumn = allRowAttributes.find(item => item.title.toLowerCase() === "energy per visit");
    if(!energyColumn){
      energyColumn = await mondayService.createColumn(shortLivedToken,boardId,"Energy Per Visit","text");
      
    }
    energyPerVisitColumnId = energyColumn.id



    var emissionPerVistGMColumn = allRowAttributes.find(item => item.title.toLowerCase() === "emission per visit(gms)");
    if(!emissionPerVistGMColumn){
      emissionPerVistGMColumn = await mondayService.createColumn(shortLivedToken,boardId,"Energy Per Visit","text");
      
    }

    emissionsPerVisitInGramsColumnId = emissionPerVistGMColumn.id;


    var annualEnergyColumn = allRowAttributes.find(item => item.title.toLowerCase() === "annual energy");
    if(!annualEnergyColumn){
      annualEnergyColumn = await mondayService.createColumn(shortLivedToken,boardId,"Annual Energy","text");
      
    }

    annualEnergyInKwhColumnId = annualEnergyColumn.id;


    var annualEmissionGMColumn = allRowAttributes.find(item => item.title.toLowerCase() === "annual emission");
    if(!annualEmissionGMColumn){
      annualEmissionGMColumn = await mondayService.createColumn(shortLivedToken,boardId,"Annual Emission","text");
      
    }

    annualEmissionsInGramsColumnId = annualEmissionGMColumn.id;




    let auditColumnIds= {
      co2ColumnId,speedColumnId,performanceColumnId,
      unusedJavascriptBytesColumnId,unusedJavascriptSecondsColumnId,unusedCSSBytesColumnId,
      unusedCSSSecondsColumnId, energyPerVisitColumnId,emissionsPerVisitInGramsColumnId,
      annualEnergyInKwhColumnId,
      co2SWDColumnId,annualEmissionsInGramsColumnId};

   
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
