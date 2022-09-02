const mondayService = require('../services/monday-service');


async function executeAction(req, res) {

  
  const { shortLivedToken } = req.session;
  const { payload } = req.body;

  try {
    const { inputFields } = payload;
    const { boardId, itemId,deviceType } = inputFields;

    
    console.log('=========>',deviceType)

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
    transferSizeInKBColumnId=-1,annualEnergyInKwhColumnId=-1,
    annualEmissionsInGramsColumnId=-1,deviceColumnId=-1,greenHostingColumnId=-1;



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

    var performanceColumn = allRowAttributes.find(item => item.title.toLowerCase() === "performance score");

    if(!performanceColumn){
      performanceColumn = await mondayService.createColumn(shortLivedToken,boardId,"Performance Score","text");
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



    var transferSizeInKBColumn = allRowAttributes.find(item => item.title.toLowerCase() === "transfer size (kb)");
    if(!transferSizeInKBColumn){
      transferSizeInKBColumn = await mondayService.createColumn(shortLivedToken,boardId,"Transfer Size (KB)","text");
      transferSizeInKBColumn = transferSizeInKBColumn.data.create_column
    }

    transferSizeInKBColumnId = transferSizeInKBColumn.id;


    var greenHostingColumn = allRowAttributes.find(item => item.title.toLowerCase() === "green hosting");
    if(!greenHostingColumn){
      greenHostingColumn = await mondayService.createColumn(shortLivedToken,boardId,"Green Hosting","text");
      greenHostingColumn = greenHostingColumn.data.create_column
    }

    greenHostingColumnId = greenHostingColumn.id;


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
      transferSizeInKBColumnId,

      speedColumnId,
      performanceColumnId,

      unusedJavascriptBytesColumnId,
      unusedJavascriptSecondsColumnId,

      unusedCSSBytesColumnId,
      unusedCSSSecondsColumnId,



      annualEnergyInKwhColumnId,
      annualEmissionsInGramsColumnId,
      deviceColumnId,
      greenHostingColumnId

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

async function executeEmailAction(req,res){
  const { shortLivedToken } = req.session;
  const { payload } = req.body;

  try {
    const { inputFields } = payload;
    const { boardId, itemId } = inputFields;

    const allRowAttributes = await mondayService.getRowAtributes(shortLivedToken, itemId);

    if (!allRowAttributes || allRowAttributes.length<1) {
      return res.status(200).send({});
    }


    console.log('allRowAttributes');
    console.log(allRowAttributes);

    var emailCountColumn = allRowAttributes.find(item => item.title.toLowerCase().indexOf("number of emails")>-1 );

    if(!emailCountColumn){
      return res.status(200).send({});
    }


    let spamEmailColumnId=-1,p2pEmailColumnId=-1,l2lEmailColumnId=-1,
    longEmailColumnId=-1,
    newsletterEmailColumnId=-1,attachmentEmailColumnId=-1;


    var spamEmailColumn = allRowAttributes.find(item => item.title.toLowerCase() === "spam email");
    

    if(!spamEmailColumn){
      spamEmailColumn= await mondayService.createColumn(shortLivedToken,boardId,"SPAM EMAIL","","text");
      spamEmailColumn = spamEmailColumn.data.create_column
    }
    spamEmailColumnId = spamEmailColumn.id;


    var p2pEmailColumn = allRowAttributes.find(item => item.title.toLowerCase() === "short email phone 2 phone");
    

    if(!p2pEmailColumn){
      p2pEmailColumn= await mondayService.createColumn(shortLivedToken,boardId,"Short Email Phone 2 Phone","","text");
      p2pEmailColumn = p2pEmailColumn.data.create_column
    }
    p2pEmailColumnId = p2pEmailColumn.id;


    var l2lEmailColumn = allRowAttributes.find(item => item.title.toLowerCase() === "short email laptop 2 laptop");

    if(!l2lEmailColumn){
      l2lEmailColumn= await mondayService.createColumn(shortLivedToken,boardId,"Short Email Laptop 2 Laptop","","text");
      l2lEmailColumn = l2lEmailColumn.data.create_column
    }
    l2lEmailColumnId = l2lEmailColumn.id;



    var longEmailColumn = allRowAttributes.find(item => item.title.toLowerCase() === "long email");
    
    if(!longEmailColumn){
      longEmailColumn= await mondayService.createColumn(shortLivedToken,boardId,"Long Email","","text");
      longEmailColumn = longEmailColumn.data.create_column
    }
    longEmailColumnId = longEmailColumn.id;



    var newsletterEmailColumn = allRowAttributes.find(item => item.title.toLowerCase() === "newsletter email");
    
    if(!newsletterEmailColumn){
      newsletterEmailColumn= await mondayService.createColumn(shortLivedToken,boardId,"Newsletter Email","","text");
      newsletterEmailColumn = newsletterEmailColumn.data.create_column
    }
    newsletterEmailColumnId = newsletterEmailColumn.id;


    var attachmentEmailColumn = allRowAttributes.find(item => item.title.toLowerCase() === "attachment email");
    
    if(!attachmentEmailColumn){
      attachmentEmailColumn= await mondayService.createColumn(shortLivedToken,boardId,"Attachment Email","","text");
      attachmentEmailColumn = attachmentEmailColumn.data.create_column
    }
    attachmentEmailColumn = attachmentEmailColumn.id;


    let emailCarbonColumnIds = {

      spamEmailColumnId,
      p2pEmailColumnId,
      l2lEmailColumnId,

      longEmailColumnId,
      newsletterEmailColumnId,
      attachmentEmailColumnId
      

    };

    await mondayService.changeMultipleColumnValuesForEmail(shortLivedToken, boardId, itemId, emailCountColumn,emailCarbonColumnIds);

  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'internal server error' });
  }
}



module.exports = {
  getRemoteListOptions,
  executeAction,
  executeEmailAction
};
