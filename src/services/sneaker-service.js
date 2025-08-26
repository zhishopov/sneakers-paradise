import Sneaker from "../models/Sneaker.js";

export default {
  getAll(filter = {}, options = {}) {
    let query = Sneaker.find({});

    if (filter.search) {
      query = query.where({ title: filter.search });
    }

    if (filter.genre) {
      query = query.where({ genre: filter.genre });
    }

    if (filter.year) {
      query = query.where({ year: Number(filter.year) });
    }

    if (options.sort) {
      query = query.sort(options.sort);
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }

    return query.exec();
  },

  async getOne(sneakerId) {
    const result = await Sneaker.findById(sneakerId);

    return result;
  },
  create(sneakerData, creatorId) {
    const result = Sneaker.create({
      ...sneakerData,
      year: Number(sneakerData.year),
      price: Number(sneakerData.price),
      size: Number(sneakerData.size),
      creator: creatorId,
    });

    return result;
  },
  async getByCreator(userId) {
    return Sneaker.find({ creator: userId });
  },
  async getPreferred(userId) {
    return Sneaker.find({ preferredList: userId });
  },
  delete(sneakerId) {
    return Sneaker.findByIdAndDelete(sneakerId);
  },
  update(sneakerId, sneakerData) {
    return Sneaker.findByIdAndUpdate(sneakerId, sneakerData, {
      runValidators: true,
    });
  },
};
