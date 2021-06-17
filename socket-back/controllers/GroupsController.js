import Joi from "joi";
import { Groups } from "../models";
import Socket from "../services/Socket";
import { literal } from "sequelize";

class GroupsController {

  static createDirect = async (req, res, next) => {
    const schema = Joi.object({
      memberId: Joi.number().required(),
    })
    const { userId } = req;
    const { memberId } = req.body;
    await schema.validateAsync(req.body);
    const members = [userId, +memberId];
    const [group] = await Groups.findOrCreate({
      where: {
        members: literal(`JSON_CONTAINS(members, '${JSON.stringify(members)}')`)
      },
      defaults: {
        name: '',
        members,
      }
    });

    Socket.emit([memberId], 'new-conversation', group)
    res.json({
      status: 'ok',
      group
    })
  }
}

export default GroupsController
