import { Model, DataTypes } from 'sequelize';
import db from '../services/db';
import Users from "./Users";
import Groups from "./Groups";

class Messages extends Model {}

Messages.init({
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  data: {
    type: DataTypes.TEXT(),
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('text'),
    defaultValue: 'text',
  },
}, {
  sequelize: db,
  tableName: 'messages',
  modelName: 'messages',
});

Messages.belongsTo(Users, {
  foreignKey: 'from',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});
Users.hasMany(Messages, {
  foreignKey: 'from',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});

Messages.belongsTo(Groups, {
  foreignKey: 'groupId',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});
Groups.hasMany(Messages, {
  foreignKey: 'groupId',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});

export default Messages;
