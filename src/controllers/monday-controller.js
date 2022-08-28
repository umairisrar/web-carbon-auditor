const mondayService = require('../services/monday-service');


async function executeAction(req, res) {

  
  const { shortLivedToken } = req.session;
  const { payload } = req.body;

  try {
    const { inputFields } = payload;
    const { boardId, itemId,deviceType } = inputFields;

    const allRowAttributes = await mondayService.getRowAtributes(shortLivedToken, itemId);

    if (!allRowAttributes || allRowAttributes.length<1) {
      return res.status(200).send({});
    }


    console.log('allRowAttributes');
    console.log(allRowAttributes);

    var websiteColumn = allRowAttributes.find(item => item.title.toLowerCase().indexOf("website")>-1 );

    if(!websiteColumn){
      return res.status(200).send({});
    }

    console.log('websiteColumn');
    console.log(websiteColumn);


    let co2ColumnId=-1,speedColumnId=-1,performanceColumnId=-1,
    unusedCSSBytesColumnId=-1,
    unusedCSSSecondsColumnId=-1,unusedJavascriptBytesColumnId=-1,unusedJavascriptSecondsColumnId=-1,
    energyPerVisitColumnId=-1,
    emissionsPerVisitInGramsColumnId=-1,annualEnergyInKwhColumnId=-1,
    annualEmissionsInGramsColumnId=-1,deviceColumnId=-1;



    var co2Column = allRowAttributes.find(item => item.title.toLowerCase() === "co2 (gms)");
    

    if(!co2Column){
      co2Column= await mondayService.createColumn(shortLivedToken,boardId,"CO2 (gms)","text");
      co2Column = co2Column.data.create_column
    }
    co2ColumnId = co2Column.id;


    
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
      performanceColumn = await mondayService.createColumn(shortLivedToken,boardId,"Performance","text");
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


    var annualEnergyColumn = allRowAttributes.find(item => item.title.toLowerCase() === "annual energy (1000 monthly visitors)");
    if(!annualEnergyColumn){
      annualEnergyColumn = await mondayService.createColumn(shortLivedToken,boardId,"Annual Energy (1000 Monthly Visitors)","text");
      annualEnergyColumn = annualEnergyColumn.data.create_column
    }

    annualEnergyInKwhColumnId = annualEnergyColumn.id;


    var annualEmissionGMColumn = allRowAttributes.find(item => item.title.toLowerCase() === "annual emission (1000 monthly visitors)");
    if(!annualEmissionGMColumn){
      annualEmissionGMColumn = await mondayService.createColumn(shortLivedToken,boardId,"Annual Emission (1000 Monthly Visitors)","text");
      annualEmissionGMColumn = annualEmissionGMColumn.data.create_column 
    }

    annualEmissionsInGramsColumnId = annualEmissionGMColumn.id;


    var deviceColumn = allRowAttributes.find(item => item.title.toLowerCase() === "device");
    

    if(!deviceColumn){
      deviceColumn= await mondayService.createColumn(shortLivedToken,boardId,"Device","text");
      deviceColumn = deviceColumn.data.create_column
    }
    deviceColumnId = deviceColumn.id;


    let auditColumnIds = {

      co2ColumnId,
      energyPerVisitColumnId,
      emissionsPerVisitInGramsColumnId,

      speedColumnId,
      performanceColumnId,

      unusedJavascriptBytesColumnId,
      unusedJavascriptSecondsColumnId,

      unusedCSSBytesColumnId,
      unusedCSSSecondsColumnId,



      annualEnergyInKwhColumnId,
      annualEmissionsInGramsColumnId,
      deviceColumnId

    };

   
    console.log('Audit Column Ids');
    console.log(auditColumnIds);



    await mondayService.changeMultipleColumnValues(shortLivedToken, boardId, itemId, websiteColumn,deviceType,auditColumnIds);

    return res.status(200).send({});
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'internal server error' });
  }
}

async function getRemoteListOptions(req, res) {
  try {

    let DEVICE_TYPES =[{ title: 'Desktop', value: 'desktop' },
    { title: 'Mobile', value: 'mobile' }];

    
    return res.status(200).send(DEVICE_TYPES);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'internal server error' });
  }
}



module.exports = {
  getRemoteListOptions,
  executeAction
};
