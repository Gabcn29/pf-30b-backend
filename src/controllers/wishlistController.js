const { User, Article, Wishlist } = require("../db");

const assignItem = async (req, res) => {
  const { userId, articleId } = req.body;
  if (isNaN(userId) || isNaN(articleId))
    return res.status(400).json({ message: "ID must be a number" });
  try {
    const findUser = await User.findByPk(userId);
    if (findUser) {
      const findArticle = await Article.findByPk(articleId);
      if (!findArticle) {
        return res
          .status(404)
          .json({ message: "An article with that ID could not be found" });
      } else {
        const newWished = await Wishlist.create({
          userId,
          articleId,
        });
        return res.status(201).json({
          message: "Article added to wishlist successfully",
          newWished,
        });
      }
    } else {
      return res
        .status(404)
        .json({ message: "A user with that ID could not be found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const getUserList = async (req, res) => {
  const { id } = req.params;
  if (isNaN(id))
    return res.status(400).json({ message: "ID must be a number" });
  try {
    const findUser = await User.findByPk(id, { include: Article });
    if (findUser) {
      return res.status(200).json(findUser);
    } else {
      return res
        .status(404)
        .json({ message: "User with that ID could not be found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const deleteItem = async (req, res) => {
  const { id } = req.params;
  if (isNaN(id))
    return res.status(400).json({ message: "ID must be a number" });
  try {
    const findWished = await Wishlist.findByPk(id);
    if (findWished) {
      await findWished.destroy();
      return res
        .status(200)
        .json({ message: "Article deleted from wishlist successfully" });
    } else {
      return res
        .status(404)
        .json({
          message: "Item from wishlist with that ID could not be found",
        });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

module.exports = {
  assignItem,
  getUserList,
  deleteItem,
};
