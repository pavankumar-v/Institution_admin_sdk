export const getEventPage = (req, res) => {
  try {
    const claim = req.cookies.userClaim;
    const curUser = req.cookies.authUser;
    res.render("events", { title: "event", claim, staff: curUser });
  } catch (error) {
    res.status(400).json({ message: "something went wrong" });
  }
};
