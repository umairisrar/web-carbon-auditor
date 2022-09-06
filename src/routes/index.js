const router = require('express').Router();
const mondayRoutes = require('./monday');
const path = require('path');

router.use(mondayRoutes);

router.get('/',  async function (req, res) {
  res.sendFile(path.join(__dirname, 'public')+'/index.html');
});

router.get('/terms-conditions',function(req,res) {

  
  res.sendFile(path.join(__dirname, 'public')+'/terms-conditions.html');
});

router.get('/how-to-use',function(req,res) {

  
  res.sendFile(path.join(__dirname, 'public')+'/terms-conditions.html');
});


router.get('/privacy-policy',function(req,res) {

  
  res.sendFile(path.join(__dirname, 'public')+'/privacy-policy.html');
});



router.get('/health', function (req, res) {
  res.json(getHealth());
  res.end();
});

function getHealth() {
  return {
    ok: true,
    message: 'Healthy',
  };
}

module.exports = router;
