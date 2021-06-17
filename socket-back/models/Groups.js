import { Model, DataTypes } from 'sequelize';
import db from '../services/db';

class Groups extends Model {
}

Groups.init({
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '',
  },
  members: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  type:{
    type: DataTypes.ENUM('direct', 'group'),
    allowNull: false,
    defaultValue: 'direct',
  }
}, {
  sequelize: db,
  tableName: 'groups',
  modelName: 'groups',
});


export default Groups;
