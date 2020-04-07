import mongoose from 'mongoose';

const connectionStatus = { isConnected: false };

const mongooseDeprecatedConfig = {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
};

async function dbConnection() {
    if (connectionStatus.isConnected) {
        console.log('Using existing connection');
        return;
    }
    const db = await mongoose.connect(process.env.MONGO_SRV, mongooseDeprecatedConfig);
    console.log('MongoDB database connection established successfully');
    connectionStatus.isConnected = db.connections[0].readyState;
}

export default dbConnection;
