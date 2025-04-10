const handler = async (_req, res) => {
  using myObject = { [Symbol.asyncDispose]: () => { console.log("Disposed"); } };
  res.end("Hello World!");
};

export default handler;
