export const getEventPage = (req, res) => {
  try {
    res.render("events", {
      title: "event",
      claim: req.claim,
      staff: req.curUser,
    });
  } catch (error) {
    res.status(400).json({ message: "something went wrong" });
  }
};
