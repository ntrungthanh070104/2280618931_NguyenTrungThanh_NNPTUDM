var express = require('express');
var router = express.Router();
let { dataUser, dataRole } = require('../utils/data2');

// Lấy danh sách tất cả User
router.get('/', function (req, res, next) {
  let result = dataUser.filter(e => !e.isDeleted);
  res.send(result);
});

// Lấy 1 User theo username
router.get('/:username', function (req, res, next) {
  let result = dataUser.filter(e => e.username == req.params.username && !e.isDeleted);
  if (result.length == 0) res.status(404).send({ message: "USER NOT FOUND" });
  else res.send(result[0]);
});

// Thêm mới 1 User (POST)
router.post('/', function (req, res, next) {
  // Tìm thông tin Role nếu người dùng truyền roleId lên
  let roleInfo = dataRole.find(r => r.id === req.body.roleId);
  
  let newUser = {
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    fullName: req.body.fullName,
    avatarUrl: req.body.avatarUrl || "https://i.sstatic.net/l60Hf.png",
    status: req.body.status !== undefined ? req.body.status : true,
    loginCount: 0,
    // Nếu không truyền roleId hợp lệ, mặc định cho làm User (r3)
    role: roleInfo || { id: "r3", name: "Người dùng", description: "Tài khoản người dùng thông thường" },
    creationAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  dataUser.push(newUser);
  res.send(newUser);
});

// Cập nhật User (PUT)
router.put('/:username', function (req, res, next) {
  let userIndex = dataUser.findIndex(e => e.username == req.params.username && !e.isDeleted);
  if (userIndex === -1) {
    res.status(404).send({ message: "USER NOT FOUND" });
  } else {
    let keys = Object.keys(req.body);
    for (const key of keys) {
      if (dataUser[userIndex][key] !== undefined && key !== 'username') {
        dataUser[userIndex][key] = req.body[key];
      }
    }
    // Nếu có update roleId
    if (req.body.roleId) {
       let newRole = dataRole.find(r => r.id === req.body.roleId);
       if (newRole) dataUser[userIndex].role = newRole;
    }
    
    dataUser[userIndex].updatedAt = new Date().toISOString();
    res.send(dataUser[userIndex]);
  }
});

// Xóa User (DELETE)
router.delete('/:username', function (req, res, next) {
  let userIndex = dataUser.findIndex(e => e.username == req.params.username && !e.isDeleted);
  if (userIndex === -1) {
    res.status(404).send({ message: "USER NOT FOUND" });
  } else {
    dataUser[userIndex].isDeleted = true;
    dataUser[userIndex].updatedAt = new Date().toISOString();
    res.send(dataUser[userIndex]);
  }
});

module.exports = router;