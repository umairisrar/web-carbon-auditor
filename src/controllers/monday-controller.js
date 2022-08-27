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
    energyPerVisitColumnId=-1,
    emissionsPerVisitInGramsColumnId=-1,annualEnergyInKwhColumnId=-1,annualEmissionsInGramsColumnId=-1;



    var co2Column = allRowAttributes.find(item => item.title.toLowerCase() === "co2 (gms)");
    

    if(!co2Column){
      co2Column= await mondayService.createColumn(shortLivedToken,boardId,"CO2 (gms)","text");
      co2Column = co2Column.data.create_column
    }
    co2ColumnId = co2Column.id;


    var co2SWDColumn = allRowAttributes.find(item => item.title.toLowerCase() === "co2 swd");

    if(!co2SWDColumn){
      co2SWDColumn= await mondayService.createColumn(shortLivedToken,boardId,"CO2 SWD","text");
      co2SWDColumn = co2SWDColumn.data.create_column
    }
    co2SWDColumnId = co2SWDColumn.id;


    console.log('co2SWDColumn');
    console.log(co2SWDColumn);
    
    var speedColumn = allRowAttributes.find(item => item.title.toLowerCase() === "speed");

    if(!speedColumn){
      speedColumn= await mondayService.createColumn(shortLivedToken,boardId,"Speed","text");
      speedColumn = speedColumn.data.create_column
    }

    speedColumnId = speedColumn.id;

    console.log('speedColumn');
    console.log(speedColumn);

    var performanceColumn = allRowAttributes.find(item => item.title.toLowerCase() === "performance");

    if(!performanceColumn){
      performanceColumn = await mondayService.createColumn(shortLivedToken,boardId,"Perfomance","text");
      performanceColumn = performanceColumn.data.create_column
    }

    performanceColumnId = performanceColumn.id

    console.log('performanceColumn');
    console.log(performanceColumn);


    var unusedJavascriptBytesColumn = allRowAttributes.find(item => item.title.toLowerCase() === "unused js (kb)");
    if(!unusedJavascriptBytesColumn){
      unusedJavascriptBytesColumn = await mondayService.createColumn(shortLivedToken,boardId,"Unused JS (KB)","text");
      unusedJavascriptBytesColumn = unusedJavascriptBytesColumn.data.create_column
    }
    unusedJavascriptBytesColumnId = unusedJavascriptBytesColumn.id

    
    var unusedJavascriptSecondsColumn = allRowAttributes.find(item => item.title.toLowerCase() === "unused js (ms)");
    if(!unusedJavascriptSecondsColumn){
      unusedJavascriptSecondsColumn = await mondayService.createColumn(shortLivedToken,boardId,"Unused JS (ms)","text");
      unusedJavascriptSecondsColumn = unusedJavascriptSecondsColumn.data.create_column
    }
    unusedJavascriptSecondsColumnId = unusedJavascriptSecondsColumn.id



    var unusedCSSBytesColumn = allRowAttributes.find(item => item.title.toLowerCase() === "unused css (kb)");
    if(!unusedCSSBytesColumn){
      unusedCSSBytesColumn = await mondayService.createColumn(shortLivedToken,boardId,"Unused CSS (KB)","text");
      unusedCSSBytesColumn = unusedCSSBytesColumn.data.create_column
    }
    unusedCSSBytesColumnId = unusedCSSBytesColumn.id


    var unusedCSSSecondsColumn = allRowAttributes.find(item => item.title.toLowerCase() === "unused css (ms)");
    if(!unusedCSSSecondsColumn){
      unusedCSSSecondsColumn = await mondayService.createColumn(shortLivedToken,boardId,"Unused CSS (ms)","text");
      unusedCSSSecondsColumn = unusedCSSSecondsColumn.data.create_column
    }
    unusedCSSSecondsColumnId = unusedCSSSecondsColumn.id
    

    var energyColumn = allRowAttributes.find(item => item.title.toLowerCase() === "energy per visit (kwh)");
    if(!energyColumn){
      energyColumn = await mondayService.createColumn(shortLivedToken,boardId,"Energy Per Visit (kWh)","text");
      energyColumn = energyColumn.data.create_column
    }
    energyPerVisitColumnId = energyColumn.id



    var emissionPerVistGMColumn = allRowAttributes.find(item => item.title.toLowerCase() === "emission per visit (gms)");
    if(!emissionPerVistGMColumn){
      emissionPerVistGMColumn = await mondayService.createColumn(shortLivedToken,boardId,"Emission Per Visit (gms)","text");
      emissionPerVistGMColumn = emissionPerVistGMColumn.data.create_column
    }

    emissionsPerVisitInGramsColumnId = emissionPerVistGMColumn.id;


    var annualEnergyColumn = allRowAttributes.find(item => item.title.toLowerCase() === "annual energy (kwh)");
    if(!annualEnergyColumn){
      annualEnergyColumn = await mondayService.createColumn(shortLivedToken,boardId,"Annual Energy (kWh)","text");
      annualEnergyColumn = annualEnergyColumn.data.create_column
    }

    annualEnergyInKwhColumnId = annualEnergyColumn.id;


    var annualEmissionGMColumn = allRowAttributes.find(item => item.title.toLowerCase() === "annual emission (co2e)");
    if(!annualEmissionGMColumn){
      annualEmissionGMColumn = await mondayService.createColumn(shortLivedToken,boardId,"Annual Emission (CO2e)","text");
      annualEmissionGMColumn = annualEmissionGMColumn.data.create_column 
    }

    annualEmissionsInGramsColumnId = annualEmissionGMColumn.id;




    let auditColumnIds= {
      co2ColumnId,speedColumnId,performanceColumnId,
      unusedJavascriptBytesColumnId,unusedJavascriptSecondsColumnId,unusedCSSBytesColumnId,
      unusedCSSSecondsColumnId,
      
      energyPerVisitColumnId,
      emissionsPerVisitInGramsColumnId,
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
