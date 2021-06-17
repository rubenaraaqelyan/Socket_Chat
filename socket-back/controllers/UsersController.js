import fs from 'fs';
import HttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import { literal } from "sequelize";
import { Groups, Users } from '../models';

const { JWT_SECRET } = process.env;

class UsersController {
  static myAccount = async (req, res, next) => {
    try {
      const user = await Users.findByPk(req.userId);

      res.json({
        user,
      });
    } catch (e) {
      next(e);
    }
  }

  static register = async (req, res, next) => {
    try {
      const { file } = req;
      const {
        email, firstName, lastName, password,
      } = req.body;

      const user = await Users.create({
        email, firstName, lastName, password,
      });

      const fileTypes = {
        'image/jpeg': '.jpg',
        'image/png': '.png',
        'image/gif': '.gif',
      };

      if (file) {
        const imageDir = `public/images/${user.id}/`;
        if (!fs.existsSync(imageDir)) {
          fs.mkdirSync(imageDir, { recursive: true });
        }
        const avatar = `${file.fieldname}-${Date.now()}${fileTypes[file.mimetype]}`;
        fs.writeFileSync(imageDir + avatar, file.buffer);

        user.avatar = avatar;
        await user.save();
      }
      res.json({
        status: 'ok',
        user,
      });
    } catch (e) {
      next(e);
    }
  }

  static login = async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const user = await Users.findOne({
        where: {
          email,
        },
      });

      if (!user || user.getDataValue('password') !== password) {
        throw HttpError(403, 'invalid email or password');
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET);

      res.json({
        status: 'ok',
        user,
        token,
      });
    } catch (e) {
      next(e);
    }
  }

  static list = async (req, res, next) => {
    try {
      const { userId } = req;

      let users = await Users.findAll({
        where: {
          id: {
            $not: userId
          }
        },
      });

      const groups = await Groups.findAll({
        where: {
          type: 'direct',
          members: literal(`JSON_CONTAINS(members, '[${userId}]')`),
        },
      })
      users = users.map(u => {
        const group = groups.find(g => g.members.includes(u.id));
        u.groupId = group ? group.id : null;
        u.setDataValue('groupId', u.groupId);
        return u;
      });
      res.json({
        status: 'ok',
        users,
        groups,
      });
    } catch (e) {
      next(e);
    }
  }
}

export default UsersController;
