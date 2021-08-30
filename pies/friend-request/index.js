module.exports = (ctx) => {
    ctx.on('NewFriendRequestEvent', async (event) => {
        await ctx.api.handleNewFriendRequest(event.eventId, event.fromId, event.groupId, 0, '');
    });
};
