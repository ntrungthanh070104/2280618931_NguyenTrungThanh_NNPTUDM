var express = require('express');
var router = express.Router();
let { dataCategories, dataProducts } = require('../utils/data')
let slugify = require('slugify');
let { GenID,getItemByID } = require('../utils/idHandler')
//R CUD
/* GET users listing. */
router.get('/', function (req, res, next) {
  let result = dataProducts.filter(
    function (e) {
      return !e.isDeleted;
    }
  )
  res.send(result);
});
router.get('/:id', function (req, res, next) {
  let id = req.params.id;
  let result = dataProducts.filter(
    function (e) {
      return e.id == id && !e.isDeleted
    }
  )
  if (result.length == 0) {
    res.status(404).send({
      message: "ID NOT FOUND"
    });
  } else {
    res.send(result[0])
  }
});

router.post('/', function (req, res, next) {
  let getCate = getItemByID(req.body.category, dataCategories);
  console.log(getCate);
  if (!getCate) {
    res.status(404).send({
      message: "ID CATE NOT FOUND"
    })
  } else {
    let newProduct = {
      id: GenID(dataProducts),
      title: req.body.title,
      slug: slugify(req.body.title,
        {
          replacement: '-',
          remove: undefined,
          lower: true,
          trim: true
        }
      ),
      images: req.body.images,
      description: req.body.description,  
      creationAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      category: getCate
    }
    res.send(newProduct)
  }
})
router.put('/:id', function (req, res, next) {
  let id = req.params.id;
  let result = dataProducts.filter(
    function (e) {
      return e.id == id && !e.isDeleted
    }
  )
  if (result.length == 0) {
    res.status(404).send({
      message: "ID NOT FOUND"
    });
  } else {
    result = result[0];
    let keys = Object.keys(req.body);
    for (const key of keys) {
      if (result[key]) {
        result[key] = req.body[key]
        result.updatedAt = new Date(Date.now())
      }
    }
    res.send(result)
  }
})
router.delete('/:id', function (req, res, next) {
  let id = req.params.id;
  let result = dataProducts.filter(
    function (e) {
      return e.id == id && !e.isDeleted
    }
  )
  if (result.length == 0) {
    res.status(404).send({
      message: "ID NOT FOUND"
    });
  } else {
    result = result[0];
    result.isDeleted = true;
    result.updatedAt = new Date(Date.now())
    res.send(result)
  }
})



module.exports = router;
