
export const loginUser = async (req, res, next) => {
  try {

    res.successfullPost(req.user);

  } catch (err) {
    next(err);
  }
};


export const getCurrentSessionUser = async (req, res, next) => {
  try {
    console.log(req.user, 'userrr')

    res.successfullGet(req.user);
  } catch (err) {
    
    next(err);
  }
};


export const logoutSession = async (req, res, next) => {
  try {

    res.successfullDelete();
  } catch (err) {
    next(err);
  }
};

