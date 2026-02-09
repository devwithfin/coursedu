const { Op } = require('sequelize');
const Material = require('../models/material.model');
const Course = require('../models/course.model');

exports.getAll = async (req, res) => {
  const { course_ids, limit, orderBy } = req.query;
  const whereClause = {};
  const findOptions = {};

  if (course_ids) {
    // course_ids can be a comma-separated string, convert to array of numbers
    whereClause.course_id = {
      [Op.in]: course_ids.split(',').map(id => parseInt(id.trim(), 10)),
    };
  }

  if (limit) {
    findOptions.limit = parseInt(limit, 10);
  }

  if (orderBy) {
    const [field, direction] = orderBy.split(',');
    if (field && (direction === 'ASC' || direction === 'DESC')) {
      findOptions.order = [[field, direction]];
    }
  }

  try {
    const materials = await Material.findAll({
      where: whereClause,
      ...findOptions,
      include: [
        {
          model: Course,
          attributes: ['id', 'title'],
        },
      ],
    });
    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching materials', error: error.message });
  }
};

exports.getById = async (req, res) => {
    try {
        const material = await Material.findByPk(req.params.id, {
            include: [{
                model: Course,
                attributes: ['title'],
            }],
        });

        if (!material) {
            return res.status(404).json({ message: 'Material not found' });
        }

        res.json(material);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching material', error: error.message });
    }
};