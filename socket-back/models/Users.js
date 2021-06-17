import { Model, DataTypes } from 'sequelize';
import md5 from 'md5';
import db from '../services/db';

class Users extends Model {
  static passwordHash = (pass) => md5(md5(`${pass}_test`))
}

Users.init({
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    set(val) {
      this.setDataValue('password', Users.passwordHash(val));
    },
    get() {
      return undefined;
    },
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true,
    get() {
      const userId = this.getDataValue('id');
      const avatar = this.getDataValue('avatar');
      if (!avatar) {
        return avatar;
      }
      return `${global.serverURI}/images/${userId}/${avatar}`;
    },
  },
  lastVisit:{
    type: DataTypes.DATE,
    allowNull: true,
  }
}, {
  sequelize: db,
  tableName: 'users',
  modelName: 'users',
});

export default Users;
