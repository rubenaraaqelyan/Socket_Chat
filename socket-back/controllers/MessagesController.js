import Joi from "joi";
import { Groups, Messages, Users } from "../models";
import Socket from "../services/Socket";

class MessagesController {

  static getMessages = async (req, res, next) => {
    try {
      const { groupId } = req.params

      const data = await Messages.findAll({
        include: Users,
        where: { groupId },
      })

      res.json({
        status: 'ok',
        data,
      })
    } catch (err) {
      next(err);
    }
  }

  static send = async (req, res, next) => {
    try {
      const schema = Joi.object({
        groupId: Joi.number().required(),
        type: Joi.string().valid('text'),
      })
      await schema.validateAsync(req.body);
      const { userId } = req;
      const { data, type, groupId } = req.body;
      console.log({ data, type, groupId })
      const message = await Messages.create({
        from: userId,
        groupId,
        data,
        type,
      });

      const group = await Groups.findByPk(groupId);
      Socket.emit(group.members, 'new-message', message)

      res.json({
        status: 'ok',
        message,
      })
    } catch (e) {
      next(e);
    }
  }
}

export default MessagesController
