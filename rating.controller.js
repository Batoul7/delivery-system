const service = require('./rating.service');

exports.create = async (req, res) => {
  try {
    const { orderId, driverId, stars, comment } = req.body;
    const clientId = req.user.id;

    const existing = await service.getRatingByOrder(orderId);
    if (existing) return res.status(400).json({ msg: "Order already rated" });

    const rating = await service.createRating({ orderId, clientId, driverId, stars, comment });
    res.status(201).json(rating);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getByDriver = async (req, res) => {
  const ratings = await service.getRatingsByDriver(req.params.driverId);
  res.json(ratings);
};

exports.getByOrder = async (req, res) => {
  const rating = await service.getRatingByOrder(req.params.orderId);
  res.json(rating);
};

exports.delete = async (req, res) => {
  const deleted = await service.deleteRating(req.params.id);
  if (!deleted) return res.status(404).json({ msg: "Rating not found" });
  res.json({ msg: "Deleted", deleted });
};