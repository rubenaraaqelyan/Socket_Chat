import socketIo from 'socket.io';
import socketioJwt from 'socketio-jwt';
import _ from 'lodash';
import { Users, Messages, Groups } from "../models";

const { JWT_SECRET } = process.env;

class Socket {
  static users = [];

  static activeUsers = () => {
    const users = _.uniq(this.users.map(u => u.userId))
    this.io.emit('active-users', users)
  }

  static newMessage = async (groupId, message, userId) => {
    let members = await Groups.findOne({
      attributes: ['members'],
      where: { id: groupId },
    })

    members = members.getDataValue('members')
    const activeMembers = this.users.filter(u => members.includes(u.userId))

    message.user = (await Users.findByPk(userId)).get()
    activeMembers.forEach(u => {
      this.io.to(u.socketId).emit('new-message', message)
    })
  }

  static init(server) {
    this.io = socketIo(server, {
      cors: {
        origin: "*",
      },
    })
    this.io.use(socketioJwt.authorize({
      secret: JWT_SECRET,
      handshake: true,
    }));

    this.io.on('connect', async client => {
      const { userId } = client.decoded_token;
      const { id: socketId } = client;
      this.users.push({ socketId, userId: +userId });

      this.activeUsers();

      client.on('send-message', async data => {
        try {
          const message = await Messages.create({
            from: +userId,
            groupId: +data.groupId,
            type: 'text',
            data: data.message,
          })

          await this.newMessage(data.groupId, message.get(), userId)
        } catch (err) {
          console.warn(err)
        }
      })

      client.on('disconnect', async () => {
        this.users = this.users.filter(u => u.socketId !== socketId)
        this.activeUsers();
        await Users.update(
          { lastVisit: new Date() },
          {
            where: { id: userId }, silent: true,
          })
      })

      await Users.update({
        lastVisit: null,
      }, {
        where: { id: userId },
        silent: true,
      })
    })
  }

  static emit(usersId, key, message) {
    const users = this.users.filter(u => usersId.includes(+u.userId))
    users.forEach(user => {
      this.io.to(user.socketId).emit(key, message)
    });
  }
}

export default Socket
