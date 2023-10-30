const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')

class Connection {
    //create a new server instance and connect to server
    async connect() {
      this.mongoServer = await MongoMemoryServer.create();
      const mongoUri = this.mongoServer.getUri();
  
      this.connection = await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }
  
    //disconnect from server and stop running server
    async disconnect() {
      await mongoose.disconnect();
      await this.mongoServer.stop();
    }
  
    //delete all documents in inmemory db
    async cleanup() {
      const models = Object.keys(this.connection.models);
      const promises = [];
  
      models.map((model) => {
        promises.push(this.connection.models[model].deleteMany({}));
      });
  
      await Promise.all(promises);
    }
}
  
exports.connect = async () => {
    const conn = new Connection();
    await conn.connect();
    return conn;
};