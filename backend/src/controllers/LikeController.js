const Dev = require('../models/Dev');

module.exports = {
    async store(req, res) {

        const { user } = req.headers;
        const { devId } = req.params;

        const loggedDev = await Dev.findById(user);
        const targetDev = await Dev.findById(devId);

        if (!targetDev) {
            return res.status(400).json({ error: "Dev not exists!" });
        }

        if (targetDev.likes.includes(loggedDev._id)) {
            // Using middleware to find the sockets.
            const loggedSocket = req.connectedUsers[loggedDev._id];
            const targetSocket = req.connectedUsers[targetDev._id];

            if (loggedSocket) {
                req.webSocket.to(loggedSocket).emit('match', targetDev);
            }

            if (targetSocket) {
                req.webSocket.to(targetSocket).emit('match', loggedDev);
            }
        }

        loggedDev.likes.push(targetDev._id);

        await loggedDev.save();

        return res.json(loggedDev);
    }
}