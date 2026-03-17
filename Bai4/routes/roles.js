var express = require('express');
var router = express.Router();
let { dataRole, dataUser } = require('../utils/data2');

// Lấy danh sách tất cả Role
router.get('/', function (req, res, next) {
  let result = dataRole.filter(e => !e.isDeleted);
  res.send(result);
});

// Lấy 1 Role theo ID
router.get('/:id', function (req, res, next) {
  let result = dataRole.filter(e => e.id == req.params.id && !e.isDeleted);
  if (result.length == 0) res.status(404).send({ message: "ROLE NOT FOUND" });
  else res.send(result[0]);
});

// Lấy TẤT CẢ USER nằm trong 1 ROLE (Yêu cầu đặc biệt của bạn)
router.get('/:id/users', function (req, res, next) {
  let roleId = req.params.id;
  // Kiểm tra role có tồn tại không
  let roleExists = dataRole.find(e => e.id == roleId && !e.isDeleted);
  if (!roleExists) {
    return res.status(404).send({ message: "ROLE NOT FOUND" });
  }
  // Lọc ra các user có role.id khớp với id truyền vào
  let usersInRole = dataUser.filter(u => u.role && u.role.id == roleId && !u.isDeleted);
  res.send(usersInRole);
});

// Thêm mới 1 Role (POST)
router.post('/', function (req, res, next) {
  let newRole = {
    id: "r" + (dataRole.length + 1), // Tự tạo id dạng r4, r5...
    name: req.body.name,
    description: req.body.description,
    creationAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  dataRole.push(newRole); // Lưu tạm vào mảng
  res.send(newRole);
});

// Cập nhật Role (PUT)
router.put('/:id', function (req, res, next) {
  let roleIndex = dataRole.findIndex(e => e.id == req.params.id && !e.isDeleted);
  if (roleIndex === -1) {
    res.status(404).send({ message: "ROLE NOT FOUND" });
  } else {
    let keys = Object.keys(req.body);
    for (const key of keys) {
      if (dataRole[roleIndex][key] !== undefined && key !== 'id') {
        dataRole[roleIndex][key] = req.body[key];
      }
    }
    dataRole[roleIndex].updatedAt = new Date().toISOString();
    res.send(dataRole[roleIndex]);
  }
});

// Xóa Role (DELETE)
router.delete('/:id', function (req, res, next) {
  let roleIndex = dataRole.findIndex(e => e.id == req.params.id && !e.isDeleted);
  if (roleIndex === -1) {
    res.status(404).send({ message: "ROLE NOT FOUND" });
  } else {
    dataRole[roleIndex].isDeleted = true; // Xóa mềm (soft delete)
    dataRole[roleIndex].updatedAt = new Date().toISOString();
    res.send(dataRole[roleIndex]);
  }
});

module.exports = router;