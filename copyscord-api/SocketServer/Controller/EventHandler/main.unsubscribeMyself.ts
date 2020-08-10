const handler = (socket, input) => {
  socket.join(input);
};

export default handler;
