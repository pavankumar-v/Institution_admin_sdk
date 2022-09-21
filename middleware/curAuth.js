const curAuth = async (req, res, next) => {
  try {
    req.claim = req.cookies.userClaim;
    req.curUser = req.cookies.authUser;
    next();
  } catch (error) {
    console.log(error);
    throw new Error("Current user not found");
  }
};

export default curAuth;
